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
      // 流式响应
      const stream = new ReadableStream({
        start(controller) {
          difyService.runWorkflowStreaming(
            { inputs, response_mode, user },
            (chunk) => {
              controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
            },
            functionType
          ).then(() => {
            controller.close();
          }).catch((error) => {
            controller.enqueue(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            controller.close();
          });
        }
      });

      return new Response(stream, {
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