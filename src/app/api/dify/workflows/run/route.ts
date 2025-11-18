import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputs, response_mode = 'blocking', user, function_type = 'default' } = body;

    if (!inputs || !user) {
      return respErr('缺少必要参数：inputs 和 user');
    }

    const functionType = function_type as DifyFunctionType;

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    if (response_mode === 'streaming') {
      // 流式响应 - 直接从Dify API获取流并转发给前端
      // 从环境变量获取API密钥
      const API_KEY_MAP: Record<string, string | undefined> = {
        'recommendation-letter': process.env.DIFY_API_KEY_RECOMMENDATION_LETTER,
        'cover-letter': process.env.DIFY_API_KEY_COVER_LETTER,
        'resume-generator': process.env.DIFY_API_KEY_RESUME_GENERATOR,
        'sop': process.env.DIFY_API_KEY_SOP,
        'personal-statement': process.env.DIFY_API_KEY_PERSONAL_STATEMENT,
        'revise-recommendation-letter': process.env.DIFY_API_KEY_REVISE_RECOMMENDATION_LETTER,
        'revise-sop': process.env.DIFY_API_KEY_REVISE_SOP,
        'revise-personal-statement': process.env.DIFY_API_KEY_REVISE_PERSONAL_STATEMENT,
        'revise-cover-letter': process.env.DIFY_API_KEY_REVISE_COVER_LETTER,
        'default': process.env.DIFY_API_KEY,
      };

      const apiKey = API_KEY_MAP[functionType] || API_KEY_MAP['default'];
      if (!apiKey) {
        return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
      }

      const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';

      const difyResponse = await fetch(`${baseUrl}/workflows/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          response_mode: 'streaming',
          user,
        }),
      });

      if (!difyResponse.ok) {
        return respErr(`Dify API 错误: ${difyResponse.status}`);
      }

      // 直接转发Dify的流式响应
      return new Response(difyResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // 阻塞模式
      const result = await difyService.runWorkflow(
        {
          inputs,
          response_mode,
          user,
        },
        functionType
      );

      return respData(result);
    }
  } catch (error) {
    console.error('Dify workflow run error:', error);
    return respErr('执行 workflow 失败');
  }
} 