import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { user, function_type = 'default' } = body;

    if (!id) {
      return respErr('缺少 task_id 参数');
    }

    if (!user) {
      return respErr('缺少 user 参数');
    }

    const functionType = function_type as DifyFunctionType;

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    const result = await difyService.stopWorkflow(id, { user }, functionType);
    return respData(result);
  } catch (error) {
    console.error('Dify stop workflow error:', error);
    return respErr('停止 workflow 失败');
  }
} 