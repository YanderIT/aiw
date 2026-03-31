import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { customAuth } from "@/lib/auth";
import { newStorage } from "@/lib/storage";
import { nanoid } from "nanoid";
import { setSiteSetting } from "@/models/site-settings";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await customAuth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "仅支持 PNG、JPG、WebP、GIF 格式" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomId = nanoid(6);
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileName = `settings/${timestamp}-${randomId}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storage = newStorage();
    const result = await storage.uploadFile({
      body: buffer,
      key: fileName,
      contentType: file.type,
      disposition: "inline",
    });

    await setSiteSetting("wechat_qr_url", result.url);

    return NextResponse.json({
      code: 0,
      message: "ok",
      data: { url: result.url },
    });
  } catch (error: any) {
    console.error("上传二维码失败:", error);
    return NextResponse.json(
      { code: -1, message: "上传失败: " + (error?.message || "未知错误") },
      { status: 500 }
    );
  }
}
