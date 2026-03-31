import { getSupabaseClient } from "@/models/db";

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data.value;
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    console.error("更新站点设置失败:", error);
    throw error;
  }
}
