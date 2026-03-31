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
    
    // 检查用户是否已经购买过新人专享包
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_uuid", userUuid)
      .eq("product_id", "newcomer-package")
      .eq("status", "paid");

    if (error) {
      console.error("查询订单失败:", error);
      return respErr("查询失败");
    }

    // 如果已经购买过新人专享包，则不符合条件
    const eligible = !orders || orders.length === 0;

    return respData({
      eligible,
      message: eligible ? "符合新人专享资格" : "已购买过新人专享包"
    });
  } catch (error: any) {
    console.error("检查新人资格失败:", error);
    return respErr("检查新人资格失败: " + error.message);
  }
}