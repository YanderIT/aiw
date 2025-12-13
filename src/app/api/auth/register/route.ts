import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findUserByNickname } from "@/models/user";
import { validatePasswordStrength } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    // 检查是否启用邮箱密码认证
    if (process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Email password registration is disabled" },
        { status: 403 }
      );
    }

    const { email, password, nickname } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "邮箱和密码是必填项" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "邮箱格式无效" },
        { status: 400 }
      );
    }

    // 验证用户名格式（如果提供了用户名）
    const finalNickname = nickname || email.split('@')[0];
    if (finalNickname) {
      // 用户名长度检查
      if (finalNickname.length < 2 || finalNickname.length > 20) {
        return NextResponse.json(
          { success: false, message: "用户名长度必须在2-20个字符之间" },
          { status: 400 }
        );
      }

      // 用户名格式检查：只允许字母、数字、中文、下划线、连字符
      const nicknameRegex = /^[\w\u4e00-\u9fa5-]+$/;
      if (!nicknameRegex.test(finalNickname)) {
        return NextResponse.json(
          { success: false, message: "用户名只能包含字母、数字、中文、下划线和连字符" },
          { status: 400 }
        );
      }

      // 检查用户名是否已被使用
      const existingUserByNickname = await findUserByNickname(finalNickname);
      if (existingUserByNickname) {
        return NextResponse.json(
          { success: false, message: "该用户名已被占用，请尝试其他用户名" },
          { status: 409 }
        );
      }
    }

    // 验证密码强度
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    // 使用 Better Auth 的 signUpEmail API 创建用户
    const result = await auth.api.signUpEmail({
      body: {
        name: finalNickname,
        email: email,
        password: password,
      },
    });

    if (!result || !result.user) {
      return NextResponse.json(
        { success: false, message: "注册失败，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: {
        uuid: result.user.id,
        email: result.user.email,
        nickname: result.user.name,
      }
    });

  } catch (error: unknown) {
    console.error("Registration error:", error);

    // Check if it's a duplicate email error
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, message: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "注册失败，请重试" },
      { status: 500 }
    );
  }
}
