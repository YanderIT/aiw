import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getUserCredits, increaseCredits, CreditsTransType } from "@/services/credit";
import { getOneYearLaterTimestr } from "@/lib/time";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const { user_uuid, credits_change } = await req.json();

    if (!user_uuid || credits_change === undefined || credits_change === 0) {
      return respErr("缺少必要参数");
    }

    const change = Number(credits_change);
    if (isNaN(change)) {
      return respErr("积分数量无效");
    }

    await increaseCredits({
      user_uuid,
      trans_type: CreditsTransType.SystemAdd,
      credits: change,
      expired_at: getOneYearLaterTimestr(),
    });

    const updatedCredits = await getUserCredits(user_uuid);

    return respData({
      left_credits: updatedCredits.left_credits,
      change,
    });
  } catch (error: any) {
    console.error("修改积分失败:", error);
    return respErr("修改积分失败: " + error.message);
  }
}
