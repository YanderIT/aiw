import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { validateDiscountCode } from "@/models/discount";
import { getUserUuid } from "@/services/user";

export async function POST(req: NextRequest) {
  try {
    const { code, product_id, amount } = await req.json();

    if (!code || !product_id || !amount) {
      return respErr("缺少必要参数");
    }

    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录");
    }

    const validation = await validateDiscountCode(code, userUuid, product_id, amount);
    
    if (!validation.valid) {
      return respErr(validation.message);
    }

    const finalAmount = amount - (validation.discountAmount || 0);

    return respData({
      valid: true,
      message: validation.message,
      discount_amount: validation.discountAmount || 0,
      bonus_credits: validation.bonusCredits || 0,
      final_amount: finalAmount,
      discount_code: validation.discountCode
    });
  } catch (error: any) {
    console.error("折扣码验证失败:", error);
    return respErr("折扣码验证失败: " + error.message);
  }
}