"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

export default function AuthCallbackPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(t("auth_callback.verifying"));
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const handleSignInCallback = async () => {
      const email = window.localStorage.getItem("emailForSignIn");
      const href = window.location.href;

      // 设置调试信息
      setDebugInfo(`Current URL: ${href}\nStored email: ${email || 'None'}`);

      if (!email) {
        setMessage(t("auth_callback.no_email"));
        toast.error(t("auth_callback.no_email_toast"));
        setTimeout(() => router.push("/auth/signin"), 3000);
        return;
      }

      try {
        setMessage("正在验证邮箱链接...");
        
        const response = await fetch("/api/auth/verify-signin-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, href }),
        });

        const result = await response.json();
        
        console.log("Verify signin link result:", result);
        setDebugInfo(prev => `${prev}\nAPI Response: ${JSON.stringify(result, null, 2)}`);

        if (result.success) {
          setMessage("邮箱验证成功，正在登录...");
          window.localStorage.removeItem("emailForSignIn");
          
          // Sign in to NextAuth
          const signInResult = await signIn("credentials", {
            idToken: result.idToken,
            redirect: false,
          });
          
          console.log("NextAuth signIn result:", signInResult);
          setDebugInfo(prev => `${prev}\nNextAuth result: ${JSON.stringify(signInResult, null, 2)}`);
          
          if (signInResult?.ok) {
            setMessage("登录成功，正在跳转...");
            toast.success(t("auth_callback.login_success"));
            // 等待一秒后跳转，让用户看到成功消息
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } else {
            setMessage("NextAuth 登录失败");
            const errorMsg = signInResult?.error || "未知错误";
            console.error("NextAuth login failed:", signInResult);
            toast.error("NextAuth 登录失败: " + errorMsg);
            setDebugInfo(prev => `${prev}\nNextAuth Error: ${errorMsg}`);
          }
        } else {
          setMessage(t("auth_callback.login_failed"));
          toast.error(result.message || t("auth_callback.login_failed"));
          setTimeout(() => router.push("/auth/signin"), 3000);
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setMessage(t("auth_callback.login_failed"));
        toast.error("网络错误: " + error.message);
        setDebugInfo(prev => `${prev}\nError: ${error.message}`);
        setTimeout(() => router.push("/auth/signin"), 3000);
      }
    };

    handleSignInCallback();
  }, [router, t]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <p className="text-lg mb-4">{message}</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">调试信息</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {debugInfo}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
} 