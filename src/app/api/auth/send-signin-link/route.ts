import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import app from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 检查是否启用 Firebase 邮箱链接登录
    if (process.env.NEXT_PUBLIC_FIREBASE_EMAIL_LINK_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Firebase email link authentication is disabled" },
        { status: 403 }
      );
    }

    const { email, locale } = await request.json();

    if (!email || email.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const auth = getAuth(app);
    
    // 构建正确的回调URL，包含locale参数
    const callbackUrl = locale 
      ? `${request.nextUrl.origin}/${locale}/auth/callback`
      : `${request.nextUrl.origin}/auth/callback`;
    
    const actionCodeSettings = {
      url: callbackUrl,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    return NextResponse.json({
      success: true,
      message: "Sign-in link sent successfully"
    });

  } catch (error: any) {
    console.error("Send signin link error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send sign-in link" },
      { status: 500 }
    );
  }
} 