import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findUserByNickname } from "@/models/user";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";
import { getClientIp } from "@/lib/ip";
import { saveUser } from "@/services/user";
import { User } from "@/types/user";

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

    // 检查邮箱是否已被注册
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password);

    // 创建新用户
    const newUser: User = {
      uuid: getUuid(),
      email: email,
      nickname: finalNickname,
      avatar_url: "",
      signin_type: "email",
      signin_provider: "credentials",
      signin_openid: hashedPassword, // 将密码哈希存储在 signin_openid 字段
      created_at: getIsoTimestr(),
      signin_ip: await getClientIp(),
    };

    // 保存用户
    await saveUser(newUser);

    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: {
        uuid: newUser.uuid,
        email: newUser.email,
        nickname: newUser.nickname,
      }
    });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "注册失败，请重试" },
      { status: 500 }
    );
  }
} 