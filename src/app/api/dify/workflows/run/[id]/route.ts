import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const functionType = (searchParams.get('function_type') || 'default') as DifyFunctionType;

    if (!id) {
      return respErr('缺少 workflow_run_id 参数');
    }

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    const result = await difyService.getWorkflowRun(id, functionType);
    return respData(result);
  } catch (error) {
    console.error('Dify get workflow run error:', error);
    return respErr('获取 workflow 运行状态失败');
  }
} 