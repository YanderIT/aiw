import { NextRequest } from 'next/server';
import { respData, respErr } from '@/lib/resp';
import { difyService, DifyFunctionType } from '@/services/dify';
import { rateLimiter } from '@/lib/security/simple-rate-limiter';
import { getClientIp, anonymizeIp } from '@/lib/utils/get-client-ip';

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

    // 获取客户端IP
    const clientIp = getClientIp(req);
    
    // 检查速率限制（基于user参数和IP）
    const limitCheck = rateLimiter.checkLimit(user, clientIp || undefined);
    if (!limitCheck.allowed) {
      console.log(`[Dify上传限制] 用户 ${user} 或 IP ${anonymizeIp(clientIp)} 触发限制: ${limitCheck.reason}`);
      return respErr(limitCheck.reason || '上传频率过高，请稍后再试', 429);
    }

    // 检查 API Key 是否可用
    if (!difyService.checkApiKey(functionType)) {
      return respErr(`功能类型 '${functionType}' 的 API Key 未配置`);
    }

    const result = await difyService.uploadFile(file, user, type, functionType);
    
    // 记录成功上传日志
    console.log(`[Dify上传成功] 用户 ${user} IP ${anonymizeIp(clientIp)} 上传文件: ${file.name}`);
    
    return respData(result);
  } catch (error) {
    console.error('Dify upload file error:', error);
    return respErr('上传文件失败');
  }
} 