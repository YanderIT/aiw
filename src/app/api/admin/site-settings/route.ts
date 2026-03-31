import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getSiteSetting, setSiteSetting } from "@/models/site-settings";
import { NextRequest } from "next/server";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) {
      return respErr("缺少 key 参数");
    }

    const value = await getSiteSetting(key);
    return respData({ key, value });
  } catch (error: any) {
    return respErr("获取设置失败: " + error.message);
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return respErr("缺少必要参数");
    }

    await setSiteSetting(key, value);
    return respData({ key, value });
  } catch (error: any) {
    return respErr("更新设置失败: " + error.message);
  }
}
