import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getAllDiscountCodes, createDiscountCode } from "@/models/discount";
import { getUserUuid } from "@/services/user";

export async function GET(req: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const discountCodes = await getAllDiscountCodes();
    return respData(discountCodes);
  } catch (error: any) {
    console.error("获取折扣码列表失败:", error);
    return respErr("获取折扣码列表失败: " + error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const data = await req.json();

    // Validate required fields
    if (!data.code || !data.name || !data.type || data.value === undefined) {
      return respErr("缺少必要字段");
    }

    // Validate discount type and value
    if (!["percentage", "fixed_amount", "bonus_credits"].includes(data.type)) {
      return respErr("无效的折扣类型");
    }

    if (data.type === "percentage" && (data.value < 0 || data.value > 100)) {
      return respErr("百分比折扣必须在0-100之间");
    }

    if (data.type === "fixed_amount" && data.value < 0) {
      return respErr("固定金额折扣不能为负数");
    }

    if (data.type === "bonus_credits" && (data.value < 0 || !Number.isInteger(data.value))) {
      return respErr("赠送积分必须为非负整数");
    }

    // Validate dates
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);

    if (validFrom >= validUntil) {
      return respErr("生效日期必须早于过期日期");
    }

    // Prepare discount code data
    const discountCodeData = {
      code: data.code.toUpperCase(),
      name: data.name,
      description: data.description || null,
      type: data.type,
      value: data.value,
      min_amount: data.minAmount || null,
      max_uses: data.maxUses || null,
      user_limit: data.userLimit || null,
      valid_from: validFrom.toISOString(),
      valid_until: validUntil.toISOString(),
      product_ids: data.productIds || null,
      is_active: data.isActive !== false, // Default to true
    };

    const discountCode = await createDiscountCode(discountCodeData);
    return respData(discountCode);
  } catch (error: any) {
    console.error("创建折扣码失败:", error);

    // Handle unique constraint violation
    if (error.message?.includes("duplicate key") || error.code === "23505") {
      return respErr("折扣码已存在，请使用不同的代码");
    }

    return respErr("创建折扣码失败: " + error.message);
  }
}