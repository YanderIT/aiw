import { getSupabaseClient } from "@/models/db";

export interface AffiliateSettingsRow {
  id: number;
  reward_type: "credits" | "percentage" | "fixed_amount" | "service_quota";
  reward_value: number;
  reward_quotas: Record<string, number>;
  trigger_condition: "on_register" | "first_paid" | "every_paid";
  min_order_amount: number;
  max_rewards_per_user: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAffiliateSettings(): Promise<AffiliateSettingsRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("affiliate_settings")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("获取邀请奖励设置失败:", error);
    return null;
  }

  return data;
}

export async function updateAffiliateSettings(
  settings: Partial<Omit<AffiliateSettingsRow, "id" | "created_at">>
): Promise<AffiliateSettingsRow | null> {
  const supabase = getSupabaseClient();

  const existing = await getAffiliateSettings();
  if (!existing) {
    const { data, error } = await supabase
      .from("affiliate_settings")
      .insert({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("创建邀请奖励设置失败:", error);
      throw error;
    }
    return data;
  }

  const { data, error } = await supabase
    .from("affiliate_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    console.error("更新邀请奖励设置失败:", error);
    throw error;
  }

  return data;
}
