import { NextRequest, NextResponse } from "next/server";
import { validatePasswordStrength, hashPassword } from "@/lib/password";
import { verifyPasswordResetCode } from "@/lib/password-reset";
import { findUserByEmail } from "@/models/user";
import { getSupabaseClient } from "@/models/db";
import { getIsoTimestr } from "@/lib/time";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Email password login is disabled" },
        { status: 403 }
      );
    }

    const { email, code, password } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedCode = String(code || "").trim();
    const nextPassword = String(password || "");

    if (!normalizedEmail || !normalizedCode || !nextPassword) {
      return NextResponse.json(
        { success: false, message: "邮箱、验证码和新密码不能为空" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(nextPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message || "密码不符合要求" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "该邮箱未注册" },
        { status: 404 }
      );
    }

    if (user.signin_provider !== "credentials") {
      return NextResponse.json(
        { success: false, message: "该账号使用的是第三方登录，请使用对应登录方式" },
        { status: 400 }
      );
    }

    const verificationResult = await verifyPasswordResetCode(normalizedEmail, normalizedCode);
    if (!verificationResult.ok) {
      const messageMap = {
        not_found: "验证码不存在，请重新获取",
        expired: "验证码已过期，请重新获取",
        invalid: "验证码无效，请重新获取",
        mismatch: "验证码错误",
      } as const;

      return NextResponse.json(
        { success: false, message: messageMap[verificationResult.reason] },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const hashedPassword = await hashPassword(nextPassword);
    const now = getIsoTimestr();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        signin_openid: hashedPassword,
        updated_at: now,
      })
      .eq("uuid", user.uuid);

    if (updateError) {
      throw updateError;
    }

    await supabase
      .from("verification")
      .delete()
      .eq("id", verificationResult.verification.id);

    await supabase
      .from("session")
      .delete()
      .eq("user_id", user.uuid);

    const response = NextResponse.json({
      success: true,
      message: "密码重置成功，请使用新密码登录",
    });
    response.cookies.delete("better-auth.session_token");

    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "密码重置失败，请稍后重试" },
      { status: 500 }
    );
  }
}
