"use client";

import { useAppContext } from "@/contexts/app";
import { GlobalLoading } from "./loading";
import { useRouterLoading } from "@/hooks/useRouterLoading";

export function GlobalLoadingWrapper() {
  const { isLoading } = useAppContext();
  
  // 初始化路由loading hook
  useRouterLoading();

  return <GlobalLoading isVisible={isLoading} />;
} 