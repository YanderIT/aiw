import { getUserCredits, decreaseCredits, CreditsTransType, CreditsAmount } from "@/services/credit";

export async function checkAndDeductCredits(
  userUuid: string
): Promise<{ ok: boolean; message?: string }> {
  try {
    const credits = await getUserCredits(userUuid);

    if (credits.left_credits < CreditsAmount.DocGenCost) {
      return {
        ok: false,
        message: "积分不足，请先购买套餐",
      };
    }

    await decreaseCredits({
      user_uuid: userUuid,
      trans_type: CreditsTransType.DocGen,
      credits: CreditsAmount.DocGenCost,
    });

    return { ok: true };
  } catch (e: any) {
    console.error("积分扣除失败:", e?.message);
    return { ok: false, message: "积分扣除失败，请重试" };
  }
}
