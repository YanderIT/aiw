import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

export async function GET(req: NextRequest) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const supabase = getSupabaseClient();

    // Get user's discount code usage history with discount code details
    const { data: usageData, error: usageError } = await supabase
      .from("discount_code_usage")
      .select(`
        id,
        discount_code_id,
        discount_amount,
        bonus_credits,
        used_at,
        order_no,
        discount_codes:discount_code_id (
          code,
          name,
          type
        )
      `)
      .eq("user_uuid", userUuid)
      .order("used_at", { ascending: false });

    if (usageError) {
      console.error("获取折扣使用记录失败:", usageError);
      return respErr("获取使用记录失败");
    }

    // Transform data to match expected format
    const usages = (usageData || []).map(usage => ({
      id: usage.id,
      discount_code_id: usage.discount_code_id,
      discount_amount: usage.discount_amount,
      bonus_credits: usage.bonus_credits,
      used_at: usage.used_at,
      order_no: usage.order_no,
      discount_code: usage.discount_codes,
    }));

    // Calculate statistics
    const totalSavings = usages.reduce((sum, usage) => sum + (usage.discount_amount || 0), 0);
    const totalUsage = usages.length;
    const bonusCreditsEarned = usages.reduce((sum, usage) => sum + (usage.bonus_credits || 0), 0);

    const stats = {
      totalSavings: (totalSavings / 100).toFixed(2), // Convert from cents to yuan
      totalUsage,
      bonusCreditsEarned,
    };

    return respData({
      usages,
      stats,
    });
  } catch (error: any) {
    console.error("获取用户折扣记录失败:", error);
    return respErr("获取折扣记录失败: " + error.message);
  }
}