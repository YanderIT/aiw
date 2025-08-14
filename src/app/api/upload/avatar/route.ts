import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { newStorage } from '@/lib/storage';
import { nanoid } from 'nanoid';
import { rateLimiter } from '@/lib/security/simple-rate-limiter';
import { getClientIp, anonymizeIp } from '@/lib/utils/get-client-ip';

// 允许的文件类型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取用户标识和客户端IP
    const userIdentifier = (session.user as any).uuid || (session.user as any).id || session.user.email;
    const clientIp = getClientIp(request);
    
    // 检查速率限制
    const limitCheck = rateLimiter.checkLimit(userIdentifier, clientIp || undefined);
    if (!limitCheck.allowed) {
      console.log(`[上传限制] 用户 ${userIdentifier} 或 IP ${anonymizeIp(clientIp)} 触发限制: ${limitCheck.reason}`);
      return NextResponse.json(
        { 
          error: limitCheck.reason || '上传频率过高，请稍后再试',
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
        { error: '不支持的文件类型，请上传 JPG、PNG 或 WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      );
    }
    
    // 生成唯一的文件名
    const timestamp = Date.now();
    const randomId = nanoid(6);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatars/${userIdentifier}/${timestamp}-${randomId}.${extension}`;

    // 将文件转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到 S3
    const storage = newStorage();
    const result = await storage.uploadFile({
      body: buffer,
      key: fileName,
      contentType: file.type,
      disposition: 'inline'
    });

    // 记录成功上传日志
    console.log(`[上传成功] 用户 ${userIdentifier} IP ${anonymizeIp(clientIp)} 上传文件: ${fileName}`);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        key: result.key,
        filename: result.filename
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: '缺少文件标识' }, { status: 400 });
    }

    // 获取用户信息
    const userIdentifier = (session.user as any).uuid || (session.user as any).id || session.user.email;
    
    // 验证 key 是否属于当前用户
    if (!key.includes(`avatars/${userIdentifier}/`)) {
      return NextResponse.json({ error: '无权删除此文件' }, { status: 403 });
    }

    // TODO: 实现 S3 删除功能
    // 目前先返回成功，后续可以添加实际的删除逻辑

    return NextResponse.json({
      success: true,
      message: '头像已删除'
    });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: '删除失败，请重试' },
      { status: 500 }
    );
  }
}