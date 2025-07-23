import { NextRequest, NextResponse } from "next/server";
import { findUserByNickname } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    // 检查是否启用邮箱密码认证
    if (process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Function is disabled" },
        { status: 403 }
      );
    }

    const { nickname } = await request.json();

    if (!nickname || nickname.trim() === "") {
      return NextResponse.json(
        { success: false, message: "用户名不能为空" },
        { status: 400 }
      );
    }

    const trimmedNickname = nickname.trim();

    // 用户名长度检查
    if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
      return NextResponse.json(
        { 
          success: false, 
          available: false,
          message: "用户名长度必须在2-20个字符之间" 
        },
        { status: 400 }
      );
    }

    // 用户名格式检查：只允许字母、数字、中文、下划线、连字符
    const nicknameRegex = /^[\w\u4e00-\u9fa5-]+$/;
    if (!nicknameRegex.test(trimmedNickname)) {
      return NextResponse.json(
        { 
          success: false, 
          available: false,
          message: "用户名只能包含字母、数字、中文、下划线和连字符" 
        },
        { status: 400 }
      );
    }

    // 检查用户名是否已被使用
    const existingUser = await findUserByNickname(trimmedNickname);
    const isAvailable = !existingUser;

    return NextResponse.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? "用户名可用" : "该用户名已被占用"
    });

  } catch (error: any) {
    console.error("Check nickname error:", error);
    return NextResponse.json(
      { success: false, available: false, message: "检查失败，请重试" },
      { status: 500 }
    );
  }
} 