import { NextRequest, NextResponse } from 'next/server';
import { newStorage } from '@/lib/storage';
import { nanoid } from 'nanoid';
import { rateLimiter } from '@/lib/security/simple-rate-limiter';
import { getClientIp, anonymizeIp } from '@/lib/utils/get-client-ip';

// 允许的文件类型
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain', // .txt
  'application/msword' // .doc
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP (不需要强制登录,但需要限流)
    const clientIp = getClientIp(request);

    // 使用IP作为用户标识进行限流
    const userIdentifier = clientIp || `anonymous-${Date.now()}`;

    // 检查速率限制
    const limitCheck = rateLimiter.checkLimit(userIdentifier, clientIp || undefined);
    if (!limitCheck.allowed) {
      console.log(`[上传限制] IP ${anonymizeIp(clientIp)} 触发限制: ${limitCheck.reason}`);
      return NextResponse.json(
        {
          error: limitCheck.reason || '上传频率过高,请稍后再试',
          waitTime: limitCheck.waitTime,
          userCount: limitCheck.userCount,
          ipCount: limitCheck.ipCount
        },
        { status: 429 }
      );
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '请选择要上传的文件' }, { status: 400 });
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型,请上传 PDF、DOCX 或 TXT 格式的文档' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件大小不能超过 10MB' },
        { status: 400 }
      );
    }

    // 生成唯一的文件名
    const timestamp = Date.now();
    const randomId = nanoid(10);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const fileName = `documents/${timestamp}-${randomId}.${extension}`;

    // 将文件转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到 S3
    const storage = newStorage();
    const result = await storage.uploadFile({
      body: buffer,
      key: fileName,
      contentType: file.type,
      disposition: 'attachment' // 文档使用 attachment
    });

    // 记录成功上传日志
    console.log(`[上传成功] IP ${anonymizeIp(clientIp)} 上传文件: ${fileName}, 原文件名: ${file.name}`);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      filename: file.name,
      size: file.size
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: '上传失败,请重试' },
      { status: 500 }
    );
  }
}
