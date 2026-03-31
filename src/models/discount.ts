import { DiscountCode, DiscountCodeUsage } from "@/types/discount";
import { getSupabaseClient } from "@/models/db";

export async function findDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("查找折扣码失败:", JSON.stringify(error));
    return null;
  }

  return data;
}

export async function validateDiscountCode(
  code: string,
  userUuid: string,
  productId: string,
  amount: number
): Promise<{
  valid: boolean;
  message: string;
  discountCode?: DiscountCode;
  discountAmount?: number;
  bonusCredits?: number;
}> {
  const discountCode = await findDiscountCodeByCode(code);
  
  if (!discountCode) {
    return { valid: false, message: "折扣码不存在或已失效" };
  }

  // 检查有效期
  const now = new Date();
  const validFrom = new Date(discountCode.valid_from);
  const validUntil = new Date(discountCode.valid_until);
  
  if (now < validFrom || now > validUntil) {
    return { valid: false, message: "折扣码已过期" };
  }

  // 检查使用次数限制
  if (discountCode.max_uses !== null && discountCode.max_uses !== undefined && discountCode.used_count >= discountCode.max_uses) {
    return { valid: false, message: "折扣码使用次数已达上限" };
  }

  // 检查用户使用限制
  if (discountCode.user_limit !== null && discountCode.user_limit !== undefined && discountCode.user_limit > 0) {
    const userUsageCount = await getUserDiscountCodeUsageCount(discountCode.id, userUuid);
    if (userUsageCount >= discountCode.user_limit) {
      return { valid: false, message: "您已达到此折扣码的使用限制" };
    }
  }

  // 检查产品限制
  if (discountCode.product_ids) {
    const allowedProductIds = JSON.parse(discountCode.product_ids);
    if (!allowedProductIds.includes(productId)) {
      return { valid: false, message: "此折扣码不适用于当前产品" };
    }
  }

  // 检查最小金额限制
  if (discountCode.min_amount && amount < discountCode.min_amount) {
    return { 
      valid: false, 
      message: `订单金额需满足最低¥${(discountCode.min_amount / 100).toFixed(2)}元` 
    };
  }

  // 计算折扣
  let discountAmount = 0;
  let bonusCredits = 0;

  switch (discountCode.type) {
    case 'percentage':
      discountAmount = Math.floor(amount * discountCode.value / 100);
      break;
    case 'fixed_amount':
      discountAmount = Math.min(discountCode.value * 100, amount); // 转换为分
      break;
    case 'bonus_credits':
      bonusCredits = discountCode.value;
      break;
  }

  return {
    valid: true,
    message: "折扣码有效",
    discountCode,
    discountAmount,
    bonusCredits
  };
}

export async function getUserDiscountCodeUsageCount(
  discountCodeId: number,
  userUuid: string
): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("discount_code_usage")
    .select("*", { count: "exact" })
    .eq("discount_code_id", discountCodeId)
    .eq("user_uuid", userUuid);

  if (error) {
    // 无数据不算错误（PGRST116 = no rows）
    if (error.code === "PGRST116") {
      return 0;
    }
    console.error("查询折扣码使用次数失败:", JSON.stringify(error));
    // 其他错误返回最大值，阻止使用，避免绕过限制
    return 999;
  }

  return count || 0;
}

export async function findDiscountUsageByOrderNo(orderNo: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("discount_code_usage")
    .select("id")
    .eq("order_no", orderNo)
    .limit(1);

  if (error) {
    console.error("查询折扣使用记录失败:", JSON.stringify(error));
    return false;
  }

  return (data && data.length > 0) || false;
}

export async function insertDiscountCodeUsage(usage: Omit<DiscountCodeUsage, 'id' | 'used_at'>): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("discount_code_usage")
    .insert(usage);

  if (error) {
    console.error("插入折扣码使用记录失败:", JSON.stringify(error));
    throw error;
  }
}

export async function updateDiscountCodeUsageCount(discountCodeId: number): Promise<void> {
  const supabase = getSupabaseClient();

  // 使用 rpc 原子递增，避免竞态条件
  const { error: rpcError } = await supabase.rpc("increment_discount_used_count", {
    discount_id: discountCodeId,
  });

  if (rpcError) {
    // rpc 不存在时降级为先读后写
    if (rpcError.message?.includes("function") || rpcError.code === "42883") {
      const { data: currentData, error: fetchError } = await supabase
        .from("discount_codes")
        .select("used_count")
        .eq("id", discountCodeId)
        .single();

      if (fetchError) {
        console.error("获取折扣码当前使用次数失败:", JSON.stringify(fetchError));
        throw fetchError;
      }

      const { error } = await supabase
        .from("discount_codes")
        .update({
          used_count: (currentData.used_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", discountCodeId);

      if (error) {
        console.error("更新折扣码使用次数失败:", JSON.stringify(error));
        throw error;
      }
      return;
    }

    console.error("原子递增折扣码使用次数失败:", JSON.stringify(rpcError));
    throw rpcError;
  }
}

export async function getAllDiscountCodes(): Promise<DiscountCode[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取所有折扣码失败:", error);
    throw error;
  }

  return data || [];
}

export async function createDiscountCode(
  discountCode: Omit<DiscountCode, 'id' | 'used_count' | 'created_at' | 'updated_at'>
): Promise<DiscountCode> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("discount_codes")
    .insert({
      ...discountCode,
      used_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("创建折扣码失败:", error);
    throw error;
  }

  return data;
}

export async function updateDiscountCode(
  id: number,
  updates: Partial<Omit<DiscountCode, 'id' | 'created_at'>>
): Promise<DiscountCode> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("discount_codes")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("更新折扣码失败:", error);
    throw error;
  }

  return data;
}

export async function deleteDiscountCode(id: number): Promise<void> {
  const supabase = getSupabaseClient();

  // Check if discount code has been used
  const { data: usageData, error: usageError } = await supabase
    .from("discount_code_usage")
    .select("id")
    .eq("discount_code_id", id)
    .limit(1);

  if (usageError) {
    console.error("检查使用记录失败:", usageError);
    throw usageError;
  }

  if (usageData && usageData.length > 0) {
    throw new Error("不能删除已被使用的折扣码，请改为禁用");
  }

  const { error } = await supabase
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("删除折扣码失败:", error);
    throw error;
  }
}