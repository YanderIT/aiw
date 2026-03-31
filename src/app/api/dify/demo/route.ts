import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, user = 'demo-user', function_type = 'default' } = body;

    if (!prompt) {
      return respErr('缺少 prompt 参数');
    }

    const functionType = function_type as DifyFunctionType;

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    // 示例：使用简单的文本输入运行 workflow
    const result = await difyService.runWorkflow({
      inputs: {
        prompt: prompt,
      },
      response_mode: 'blocking',
      user: user,
    }, functionType);

    return respData(result);
  } catch (error) {
    console.error('Dify demo error:', error);
    return respErr('Dify 示例调用失败');
  }
}

// 获取当前 API 状态
export async function GET() {
  try {
    const availableFunctionTypes = difyService.getAvailableFunctionTypes();
    
    return respData({
      status: 'ok',
      message: 'Dify API 模块运行正常',
      timestamp: new Date().toISOString(),
      availableFunctionTypes,
      apiKeyStatus: {
        'recommendation-letter': difyService.checkApiKey('recommendation-letter'),
        'cover-letter': difyService.checkApiKey('cover-letter'),
        'resume-generator': difyService.checkApiKey('resume-generator'),
        'default': difyService.checkApiKey('default'),
      },
      endpoints: {
        'POST /api/dify/workflows/run': '执行 workflow (支持 function_type 参数)',
        'GET /api/dify/workflows/run/[id]': '获取 workflow 运行状态 (支持 function_type 查询参数)',
        'POST /api/dify/workflows/tasks/[id]/stop': '停止 workflow 任务 (支持 function_type 参数)',
        'POST /api/dify/files/upload': '上传文件 (支持 function_type 参数)',
        'GET /api/dify/workflows/logs': '获取 workflow 日志 (支持 function_type 查询参数)',
        'POST /api/dify/demo': '示例调用 (支持 function_type 参数)',
      },
      functionTypes: {
        'recommendation-letter': '推荐信生成',
        'cover-letter': '求职信生成',
        'resume-generator': '简历生成',
        'default': '默认功能',
      },
    });
  } catch (error) {
    console.error('Dify status error:', error);
    return respErr('获取状态失败');
  }
} 