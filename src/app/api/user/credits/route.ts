import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

// DISABLED: Credits API endpoint - commented out to prevent API calls
export async function GET(req: NextRequest) {
  return respErr("积分功能已禁用");

  /* ORIGINAL CODE - DISABLED
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const supabase = getSupabaseClient();

    // 获取用户的有效积分总数
    const { data: credits, error } = await supabase
      .from("credits")
      .select("amount")
      .eq("user_uuid", userUuid)
      .eq("type", "income") // 只计算收入类型的积分
      .gte("expired_at", new Date().toISOString()); // 只计算未过期的积分

    if (error) {
      console.error("查询用户积分失败:", error);
      return respErr("查询积分失败");
    }

    // 计算总积分
    const totalCredits = credits?.reduce((sum, credit) => sum + credit.amount, 0) || 0;

    return respData({
      credits: totalCredits,
      message: "获取积分成功"
    });
  } catch (error: any) {
    console.error("获取用户积分失败:", error);
    return respErr("获取积分失败: " + error.message);
  }
  */
}