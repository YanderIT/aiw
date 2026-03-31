import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { getSupabaseClient } from "@/models/db";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const { user_uuid, new_password } = await req.json();

    if (!user_uuid || !new_password) {
      return respErr("缺少必要参数");
    }

    const validation = validatePasswordStrength(new_password);
    if (!validation.isValid) {
      return respErr(validation.message || "密码不符合要求");
    }

    const supabase = getSupabaseClient();

    // 查找用户的 credential 账号
    const { data: account, error: accountError } = await supabase
      .from("account")
      .select("id")
      .eq("user_id", user_uuid)
      .eq("provider_id", "credential")
      .limit(1)
      .single();

    if (accountError || !account) {
      return respErr("该用户没有邮箱密码登录方式，无法重置密码");
    }

    // 哈希新密码
    const hashedPassword = await hashPassword(new_password);

    // 更新密码
    const { error: updateError } = await supabase
      .from("account")
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq("id", account.id);

    if (updateError) {
      return respErr("更新密码失败");
    }

    // 删除该用户所有 session（强制重新登录）
    await supabase.from("session").delete().eq("user_id", user_uuid);

    return respData({ success: true });
  } catch (error: any) {
    console.error("重置密码失败:", error);
    return respErr("重置密码失败: " + error.message);
  }
}
