import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const { id } = await params;
    const data = await req.json();

    const supabase = getSupabaseClient();

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Handle specific field updates
    if (data.hasOwnProperty("is_active")) {
      updateData.is_active = data.is_active;
    } else {
      // Full update
      if (data.code) updateData.code = data.code.toUpperCase();
      if (data.name) updateData.name = data.name;
      if (data.hasOwnProperty("description")) updateData.description = data.description;
      if (data.type) updateData.type = data.type;
      if (data.hasOwnProperty("value")) updateData.value = data.value;
      if (data.hasOwnProperty("minAmount")) updateData.min_amount = data.minAmount;
      if (data.hasOwnProperty("maxUses")) updateData.max_uses = data.maxUses;
      if (data.hasOwnProperty("userLimit")) updateData.user_limit = data.userLimit;
      if (data.validFrom) updateData.valid_from = new Date(data.validFrom).toISOString();
      if (data.validUntil) updateData.valid_until = new Date(data.validUntil).toISOString();
      if (data.hasOwnProperty("productIds")) updateData.product_ids = data.productIds;
      if (data.hasOwnProperty("isActive")) updateData.is_active = data.isActive;
    }

    const { data: updatedCode, error } = await supabase
      .from("discount_codes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("更新折扣码失败:", error);
      return respErr("更新失败");
    }

    return respData(updatedCode);
  } catch (error: any) {
    console.error("更新折扣码失败:", error);
    return respErr("更新失败: " + error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const { id } = await params;
    const supabase = getSupabaseClient();

    // Check if discount code has been used
    const { data: usageData, error: usageError } = await supabase
      .from("discount_code_usage")
      .select("id")
      .eq("discount_code_id", id)
      .limit(1);

    if (usageError) {
      console.error("检查使用记录失败:", usageError);
      return respErr("删除失败");
    }

    if (usageData && usageData.length > 0) {
      return respErr("不能删除已被使用的折扣码，请改为禁用");
    }

    // Delete the discount code
    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("删除折扣码失败:", error);
      return respErr("删除失败");
    }

    return respData({ success: true });
  } catch (error: any) {
    console.error("删除折扣码失败:", error);
    return respErr("删除失败: " + error.message);
  }
}