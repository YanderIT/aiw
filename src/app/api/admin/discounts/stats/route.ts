import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

export async function GET(req: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const supabase = getSupabaseClient();

    // Get total and active discount codes
    const { data: allCodes, error: codesError } = await supabase
      .from("discount_codes")
      .select("id, is_active, used_count");

    if (codesError) {
      console.error("获取折扣码统计失败:", codesError);
      return respErr("获取统计数据失败");
    }

    const totalCodes = allCodes?.length || 0;
    const activeCodes = allCodes?.filter(code => code.is_active).length || 0;
    const totalUsage = allCodes?.reduce((sum, code) => sum + (code.used_count || 0), 0) || 0;

    // Get total savings from discount code usage
    const { data: usageData, error: usageError } = await supabase
      .from("discount_code_usage")
      .select("discount_amount");

    if (usageError) {
      console.error("获取使用统计失败:", usageError);
      return respErr("获取统计数据失败");
    }

    const totalSavings = usageData?.reduce((sum, usage) => sum + (usage.discount_amount || 0), 0) || 0;

    const stats = {
      totalCodes,
      activeCodes,
      totalUsage,
      totalSavings: (totalSavings / 100).toFixed(2), // Convert from cents to yuan
    };

    return respData(stats);
  } catch (error: any) {
    console.error("获取折扣码统计失败:", error);
    return respErr("获取统计数据失败: " + error.message);
  }
}