import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/models/user";
import {
  canResendPasswordResetCode,
  createPasswordResetVerification,
  findPasswordResetVerification,
  generatePasswordResetCode,
  passwordResetConfig,
} from "@/lib/password-reset";
import { sendEmail } from "@/lib/email";

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

    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, message: "请输入邮箱地址" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "请输入有效的邮箱地址" },
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

    const existingVerification = await findPasswordResetVerification(normalizedEmail);
    if (
      existingVerification?.created_at &&
      !canResendPasswordResetCode(existingVerification.created_at)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `验证码发送过于频繁，请等待 ${passwordResetConfig.resendSeconds} 秒后重试`,
        },
        { status: 429 }
      );
    }

    const code = generatePasswordResetCode();
    await createPasswordResetVerification(normalizedEmail, code);

    await sendEmail({
      to: normalizedEmail,
      subject: "Essmote AI 密码重置验证码",
      text: `您的密码重置验证码是 ${code}，${passwordResetConfig.expiresMinutes} 分钟内有效。`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 12px;">密码重置验证码</h2>
          <p>您好，</p>
          <p>您正在重置 Essmote AI 账号密码。</p>
          <p>您的验证码是：</p>
          <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">${code}</div>
          <p>验证码将在 ${passwordResetConfig.expiresMinutes} 分钟后失效。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "验证码已发送，请查收邮件",
    });
  } catch (error) {
    console.error("Send password reset code error:", error);
    return NextResponse.json(
      { success: false, message: "验证码发送失败，请稍后重试" },
      { status: 500 }
    );
  }
}
