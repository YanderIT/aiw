import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/models/user";
import { verifyPassword } from "@/lib/password";
import { getSupabaseClient } from "@/models/db";
import { v4 as uuidv4 } from "uuid";
import { getIsoTimestr } from "@/lib/time";

export async function POST(request: NextRequest) {
  try {
    // 检查是否启用邮箱密码认证
    if (process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Email password login is disabled" },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "邮箱和密码是必填项" },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // 验证是否是 credentials 登录方式
    if (user.signin_provider !== "credentials") {
      return NextResponse.json(
        { success: false, message: "该账号使用第三方登录，请使用相应的登录方式" },
        { status: 400 }
      );
    }

    // 验证密码（密码存储在 signin_openid 字段）
    if (!user.signin_openid) {
      return NextResponse.json(
        { success: false, message: "账号异常，请联系客服" },
        { status: 500 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.signin_openid);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // 获取客户端信息
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "::1";
    const userAgent = request.headers.get("user-agent") || "";

    // 创建 session
    const sessionToken = uuidv4();
    const now = getIsoTimestr();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const supabase = getSupabaseClient();

    // 插入 session 到数据库
    const { error: sessionError } = await supabase.from("session").insert({
      id: uuidv4(),
      user_id: user.uuid,
      token: sessionToken,
      expires_at: expiresAt,
      ip_address: clientIp,
      user_agent: userAgent,
      created_at: now,
      updated_at: now,
    });

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json(
        { success: false, message: "登录失败，请重试" },
        { status: 500 }
      );
    }

    // 创建响应并设置 cookie
    const response = NextResponse.json({
      success: true,
      message: "登录成功",
      user: {
        uuid: user.uuid,
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
      },
    });

    // 设置 session cookie
    response.cookies.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error: unknown) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "登录失败，请重试" },
      { status: 500 }
    );
  }
}
