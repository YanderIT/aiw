import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const supabase = getSupabaseClient();

    let totalCodes = 0;
    let activeCodes = 0;
    let totalUsage = 0;
    let totalSavings = 0;

    // 查询折扣码统计
    const { data: allCodes, error: codesError } = await supabase
      .from("discount_codes")
      .select("id, is_active, used_count");

    if (!codesError && allCodes) {
      totalCodes = allCodes.length;
      activeCodes = allCodes.filter((code: any) => code.is_active).length;
      totalUsage = allCodes.reduce((sum: number, code: any) => sum + (code.used_count || 0), 0);
    } else {
      console.error("获取折扣码统计失败:", codesError);
    }

    // 查询使用记录的总节省金额
    const { data: usageData, error: usageError } = await supabase
      .from("discount_code_usage")
      .select("discount_amount");

    if (!usageError && usageData) {
      totalSavings = usageData.reduce((sum: number, usage: any) => sum + (usage.discount_amount || 0), 0);
    } else {
      console.error("获取使用统计失败:", usageError);
    }

    return respData({
      totalCodes,
      activeCodes,
      totalUsage,
      totalSavings: (totalSavings / 100).toFixed(2),
    });
  } catch (error: any) {
    console.error("获取折扣码统计失败:", error);
    return respErr("获取统计数据失败: " + error.message);
  }
}
