import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const user = formData.get('user') as string;
    const type = formData.get('type') as string | undefined;
    const functionType = (formData.get('function_type') as string || 'default') as DifyFunctionType;

    if (!file) {
      return respErr('缺少文件参数');
    }

    if (!user) {
      return respErr('缺少 user 参数');
    }

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    const result = await difyService.uploadFile(file, user, type, functionType);
    return respData(result);
  } catch (error) {
    console.error('Dify upload file error:', error);
    return respErr('上传文件失败');
  }
} 