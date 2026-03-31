import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

export async function GET(req: NextRequest) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录", 401);
    }

    const documentUuid = req.nextUrl.searchParams.get("document_uuid");
    if (!documentUuid) {
      return respData({ status: "unpaid" });
    }

    const supabase = getSupabaseClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select("order_no, status, paid_at, amount, order_detail")
      .eq("user_uuid", userUuid)
      .eq("product_id", "polishing-single")
      .order("created_at", { ascending: false });

    if (error || !orders || orders.length === 0) {
      return respData({ status: "unpaid" });
    }

    // 仅精确匹配 document_uuid
    const matched = orders.find((o: any) => {
      try {
        const detail = o.order_detail ? JSON.parse(o.order_detail) : null;
        return detail?.document_uuid === documentUuid;
      } catch {
        return false;
      }
    });

    if (matched) {
      return respData({
        status: matched.status,
        order_no: matched.order_no,
        paid_at: matched.paid_at,
      });
    }

    return respData({ status: "unpaid" });
  } catch (error: any) {
    return respErr("查询失败: " + error.message);
  }
}
