import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import {
  getAffiliateSettings,
  updateAffiliateSettings,
} from "@/models/affiliate-settings";

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

    const settings = await getAffiliateSettings();
    return respData(settings);
  } catch (error: any) {
    return respErr("获取设置失败: " + error.message);
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const body = await req.json();
    const {
      reward_type,
      reward_value,
      reward_quotas,
      trigger_condition,
      min_order_amount,
      max_rewards_per_user,
      is_active,
    } = body;

    if (trigger_condition && !["on_register", "first_paid", "every_paid"].includes(trigger_condition)) {
      return respErr("无效的触发条件");
    }

    const settings = await updateAffiliateSettings({
      ...(reward_type !== undefined && { reward_type }),
      ...(reward_value !== undefined && { reward_value: Number(reward_value) }),
      ...(reward_quotas !== undefined && { reward_quotas }),
      ...(trigger_condition !== undefined && { trigger_condition }),
      ...(min_order_amount !== undefined && { min_order_amount: Number(min_order_amount) }),
      ...(max_rewards_per_user !== undefined && {
        max_rewards_per_user: max_rewards_per_user ? Number(max_rewards_per_user) : null,
      }),
      ...(is_active !== undefined && { is_active }),
    });

    return respData(settings);
  } catch (error: any) {
    return respErr("更新设置失败: " + error.message);
  }
}
