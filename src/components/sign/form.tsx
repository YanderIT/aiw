"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiGithub, SiGoogle } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

export default function SignForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: "",
  });

  // 检查是否启用邮箱密码登录
  const isCredentialsEnabled = process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED === "true";

  // 防抖检查用户名
  const debounceCheckNickname = useCallback(
    (nickname: string) => {
      const checkNickname = setTimeout(async () => {
        if (!nickname || nickname.trim().length < 2) {
          setNicknameStatus({
            isChecking: false,
            isAvailable: null,
            message: "",
          });
          return;
        }

        setNicknameStatus(prev => ({ ...prev, isChecking: true }));

        try {
          const response = await fetch("/api/auth/check-nickname", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nickname: nickname.trim() }),
          });

          const result = await response.json();

          setNicknameStatus({
            isChecking: false,
            isAvailable: result.available,
            message: result.message,
          });
        } catch (error) {
          console.error("Check nickname error:", error);
          setNicknameStatus({
            isChecking: false,
            isAvailable: null,
            message: "检查失败",
          });
        }
      }, 500); // 500ms 防抖

      return checkNickname;
    },
    []
  );

  // 监听用户名变化
  useEffect(() => {
    if (isRegistering && isCredentialsEnabled && nickname) {
      const timeoutId = debounceCheckNickname(nickname);
      return () => clearTimeout(timeoutId);
    }
  }, [nickname, isRegistering, isCredentialsEnabled, debounceCheckNickname]);


  // 邮箱密码登录
  const handleCredentialsSignIn = async () => {
    // 验证邮箱和密码
    if (!email || email.trim() === "") {
      toast.error(t("sign_modal.email_required"));
      return;
    }

    if (!password || password.trim() === "") {
      toast.error("请输入密码");
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("sign_modal.email_invalid"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("登录成功");
        // 登录成功后刷新页面
        window.location.reload();
      } else {
        toast.error(result.message || "邮箱或密码错误");
      }
    } catch (error: unknown) {
      console.error("Credentials signin error:", error);
      toast.error("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 用户注册
  const handleRegister = async () => {
    // 验证输入
    if (!email || email.trim() === "") {
      toast.error(t("sign_modal.email_required"));
      return;
    }

    if (!password || password.trim() === "") {
      toast.error("请输入密码");
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("sign_modal.email_invalid"));
      return;
    }

    // 验证用户名
    if (nickname && nickname.trim() && nicknameStatus.isAvailable === false) {
      toast.error("请选择一个可用的用户名");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          nickname: nickname || email.split('@')[0] 
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("注册成功！请登录");
        setIsRegistering(false);
        // 清空密码字段，保留邮箱
        setPassword("");
        setNickname("");
        setNicknameStatus({
          isChecking: false,
          isAvailable: null,
          message: "",
        });
      } else {
        toast.error(result.message || "注册失败");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 判断是否显示分隔线
  const hasOtherAuthMethods = (
    process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true"
  );
  const hasEmailAuth = isCredentialsEnabled;
  const showDivider = hasOtherAuthMethods && hasEmailAuth;

  return (
    <Card className={cn("border-0 shadow-none", className)} {...props}>
      <CardHeader className="p-0">
        <div className="flex flex-col space-y-2 text-center">
          {process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" && (
            <Button
              variant="outline"
              className="w-full h-12 flex items-center gap-2"
              onClick={() => {
                authClient.signIn.social({ provider: "github" });
              }}
            >
              <SiGithub className="w-4 h-4" />
              {t("sign_modal.github_sign_in")}
            </Button>
          )}

          {process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" && (
            <Button
              variant="outline"
              className="w-full h-12 flex items-center gap-2"
              onClick={() => {
                authClient.signIn.social({ provider: "google" });
              }}
            >
              <SiGoogle className="w-4 h-4" />
              {t("sign_modal.google_sign_in")}
            </Button>
          )}
        </div>
        {showDivider && (
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("sign_modal.or_continue_with")}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {isCredentialsEnabled && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("sign_modal.email_label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {isCredentialsEnabled && (
              <>
                {isRegistering && (
                  <div className="grid gap-2">
                    <Label htmlFor="nickname">
                      昵称（可选）
                      {nicknameStatus.isChecking && (
                        <span className="text-blue-500 text-xs ml-2">检查中...</span>
                      )}
                      {nicknameStatus.isAvailable === true && (
                        <span className="text-green-500 text-xs ml-2">✓ 可用</span>
                      )}
                      {nicknameStatus.isAvailable === false && (
                        <span className="text-red-500 text-xs ml-2">✗ 已占用</span>
                      )}
                    </Label>
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="输入昵称（2-20个字符）"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className={cn(
                        nicknameStatus.isAvailable === false && "border-red-500",
                        nicknameStatus.isAvailable === true && "border-green-500"
                      )}
                    />
                    {nicknameStatus.message && (
                      <p className={cn(
                        "text-xs",
                        nicknameStatus.isAvailable === false && "text-red-500",
                        nicknameStatus.isAvailable === true && "text-green-500"
                      )}>
                        {nicknameStatus.message}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isRegistering ? "至少8位，包含字母和数字" : "请输入密码"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {isCredentialsEnabled && (
              <>
                <Button 
                  onClick={isRegistering ? handleRegister : handleCredentialsSignIn} 
                  className="w-full h-12" 
                  disabled={isLoading || (isRegistering && nicknameStatus.isAvailable === false)}
                >
                  {isLoading ? (isRegistering ? "注册中..." : "登录中...") : (isRegistering ? "注册账户" : "邮箱密码登录")}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setPassword("");
                    setNickname("");
                    setNicknameStatus({
                      isChecking: false,
                      isAvailable: null,
                      message: "",
                    });
                  }}
                >
                  {isRegistering ? "已有账户？立即登录" : "没有账户？立即注册"}
                </Button>
              </>
            )}

          </>
        )}
        <p className="px-8 pt-4 text-center text-sm text-muted-foreground">
          {t("sign_modal.agreement_prefix")}{" "}
          <Link
            href="/terms-of-service"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("sign_modal.terms")}
          </Link>{" "}
          {t("sign_modal.and")}{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("sign_modal.privacy")}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
