import { findAffiliateByOrderNo, insertAffiliate, getAffiliateSummary } from "@/models/affiliate";
import { getAffiliateSettings } from "@/models/affiliate-settings";
import { AffiliateStatus } from "./constant";
import { Order } from "@/types/order";
import { findUserByUuid } from "@/models/user";
import { getIsoTimestr } from "@/lib/time";
import { getOneYearLaterTimestr } from "@/lib/time";
import { ServiceType } from "@/models/service-quota";

export async function updateAffiliateForOrder(order: Order) {
  try {
    const settings = await getAffiliateSettings();
    if (!settings || !settings.is_active) {
      return;
    }

    const user = await findUserByUuid(order.user_uuid);
    if (!user || !user.uuid || !user.invited_by || user.invited_by === user.uuid) {
      return;
    }

    const existingAffiliate = await findAffiliateByOrderNo(order.order_no);
    if (existingAffiliate) {
      return;
    }

    // 检查触发条件
    if (settings.trigger_condition === "first_paid") {
      const { getSupabaseClient } = await import("@/models/db");
      const supabase = getSupabaseClient();
      const { data: existingPaid } = await supabase
        .from("affiliates")
        .select("id")
        .eq("user_uuid", user.uuid)
        .eq("status", AffiliateStatus.Completed)
        .limit(1);

      if (existingPaid && existingPaid.length > 0) {
        return;
      }
    }

    // 检查最低订单金额
    if (settings.min_order_amount > 0 && order.amount < settings.min_order_amount) {
      return;
    }

    // 检查邀请人最大奖励次数
    if (settings.max_rewards_per_user && settings.max_rewards_per_user > 0) {
      const summary = await getAffiliateSummary(user.invited_by);
      if (summary.total_paid >= settings.max_rewards_per_user) {
        return;
      }
    }

    // 计算奖励
    let rewardAmount = settings.reward_value || 0;

    // 实际发放的配额快照
    const actualQuotas = (settings.reward_type === "service_quota" && settings.reward_quotas)
      ? Object.fromEntries(Object.entries(settings.reward_quotas).filter(([_, v]) => v > 0))
      : {};

    // 写入邀请记录（含奖励快照）
    const { getSupabaseClient } = await import("@/models/db");
    const supabase = getSupabaseClient();
    await supabase.from("affiliates").insert({
      user_uuid: user.uuid,
      invited_by: user.invited_by,
      created_at: getIsoTimestr(),
      status: AffiliateStatus.Completed,
      paid_order_no: order.order_no,
      paid_amount: order.amount,
      reward_percent: 0,
      reward_amount: rewardAmount,
      reward_quotas: actualQuotas,
    });

    // 发放服务配额奖励
    if (settings.reward_type === "service_quota" && settings.reward_quotas) {
      const expiredAt = getOneYearLaterTimestr();

      const rows = Object.entries(settings.reward_quotas)
        .filter(([_, count]) => count && Number(count) > 0)
        .map(([serviceType, count]) => ({
          user_uuid: user.invited_by,
          service_type: serviceType,
          remaining: Number(count),
          order_no: `invite_${order.order_no}`,
          expired_at: expiredAt,
        }));

      if (rows.length > 0) {
        const { error } = await supabase.from("service_quotas").insert(rows);
        if (error) {
          console.error("发放邀请奖励配额失败:", error);
        }
      }
    }
  } catch (e) {
    console.log("update affiliate for order failed: ", e);
    throw e;
  }
}
