import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const functionType = (searchParams.get('function_type') || 'default') as DifyFunctionType;
    
    const query = {
      keyword: searchParams.get('keyword') || undefined,
      status: searchParams.get('status') as 'succeeded' | 'failed' | 'stopped' | undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      created_by_end_user_session_id: searchParams.get('created_by_end_user_session_id') || undefined,
      created_by_account: searchParams.get('created_by_account') || undefined,
    };

    // 过滤掉 undefined 值
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    );

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    const result = await difyService.getWorkflowLogs(filteredQuery, functionType);
    return respData(result);
  } catch (error) {
    console.error('Dify get workflow logs error:', error);
    return respErr('获取 workflow 日志失败');
  }
} 