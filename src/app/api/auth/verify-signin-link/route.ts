import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import app from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

// 网络连接测试函数
async function testNetworkConnectivity() {
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5秒超时
    });
    return response.ok;
  } catch (error) {
    console.log("Network connectivity test failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查是否启用 Firebase 邮箱链接登录
    if (process.env.NEXT_PUBLIC_FIREBASE_EMAIL_LINK_AUTH_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Firebase email link authentication is disabled" },
        { status: 403 }
      );
    }

    const { email, href } = await request.json();

    console.log("Verify signin link request:", { email, href });

    if (!email || !href) {
      return NextResponse.json(
        { success: false, message: "Email and href are required" },
        { status: 400 }
      );
    }

    // 测试网络连接
    const networkOk = await testNetworkConnectivity();
    if (!networkOk) {
      console.log("Network connectivity issue detected");
      return NextResponse.json(
        { 
          success: false, 
          message: "网络连接问题，请检查网络连接后重试",
          code: 'network_error'
        },
        { status: 503 }
      );
    }

    const auth = getAuth(app);

    // 检查是否是有效的登录链接
    if (!isSignInWithEmailLink(auth, href)) {
      console.log("Invalid sign-in link:", href);
      return NextResponse.json(
        { success: false, message: "Invalid sign-in link" },
        { status: 400 }
      );
    }

    console.log("Attempting to sign in with email link...");
    const result = await signInWithEmailLink(auth, email, href);
    const user = result.user;
    
    console.log("Firebase sign-in successful:", { uid: user.uid, email: user.email });
    
    const idToken = await user.getIdToken();
    console.log("ID token generated successfully");

    return NextResponse.json({
      success: true,
      idToken,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    });

  } catch (error: any) {
    console.error("Verify signin link error:", error);
    
    // 更详细的错误处理
    let errorMessage = "Failed to verify sign-in link";
    let errorCode = 'unknown';
    
    if (error.code === 'auth/invalid-action-code') {
      errorMessage = "登录链接已过期或无效，请重新发送";
      errorCode = 'expired_link';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "邮箱地址无效";
      errorCode = 'invalid_email';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "该用户账户已被禁用";
      errorCode = 'user_disabled';
    } else if (error.message?.includes('ETIMEDOUT') || error.message?.includes('timeout')) {
      errorMessage = "网络连接超时，请重试";
      errorCode = 'timeout';
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED')) {
      errorMessage = "网络连接失败，请检查网络设置";
      errorCode = 'network_error';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        code: errorCode
      },
      { status: 500 }
    );
  }
} 