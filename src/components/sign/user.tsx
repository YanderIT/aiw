"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/navigation";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { NavItem } from "@/types/blocks/base";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Coins } from "lucide-react";

export default function SignUser({ user }: { user: User }) {
  const t = useTranslations();
  // DISABLED: Credits feature - commented out to prevent API calls
  // const { credits, loading } = useUserCredits();

  const dropdownItems: NavItem[] = [
    {
      title: user.nickname,
    },
    {
      title: t("user.user_center"),
      url: "/my-documents",
    },
    // {
    //   title: t("user.admin_system"),
    //   url: "/admin/users",
    // },
    {
      title: t("user.sign_out"),
      onClick: () => signOut(),
    },
  ];

  // 获取用户名首字母
  const getInitials = (nickname: string) => {
    if (!nickname) return "U";
    return nickname.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      {/* DISABLED: 积分显示 - Credits display hidden
      <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        <Coins className="w-4 h-4" />
        <span className="font-medium">
          {loading ? "..." : credits}
        </span>
      </div>
      */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatar_url} alt={user.nickname} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.nickname)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-4 bg-background min-w-[200px]">
          {/* 用户信息 */}
          <DropdownMenuItem className="flex-col items-start p-3">
            <div className="font-medium">{user.nickname}</div>
            {/* DISABLED: 积分显示 - Credits display hidden
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Coins className="w-4 h-4" />
              <span>剩余次数: {loading ? "加载中..." : credits}</span>
            </div>
            */}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* 菜单项 */}
          {dropdownItems.slice(1).map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem className="cursor-pointer">
                {item.url ? (
                  <Link href={item.url as any} target={item.target} className="w-full">
                    {item.title}
                  </Link>
                ) : (
                  <button onClick={item.onClick} className="w-full text-left">
                    {item.title}
                  </button>
                )}
              </DropdownMenuItem>
              {index !== dropdownItems.slice(1).length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
