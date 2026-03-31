"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppContext } from "@/contexts/app";

export function useRouterLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useAppContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // 如果正在导航中，隐藏loading
    if (isNavigatingRef.current) {
      setIsLoading(false);
      isNavigatingRef.current = false;
    }
  }, [pathname, searchParams, setIsLoading]);

  const startLoading = () => {
    isNavigatingRef.current = true;
    setIsLoading(true);
    
    // 防止loading显示时间过长，最多显示5秒
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      isNavigatingRef.current = false;
    }, 5000);
  };

  // 监听链接点击事件
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const currentOrigin = window.location.origin;
        const linkUrl = new URL(link.href, currentOrigin);
        
        // 只对同域内链接显示loading
        if (linkUrl.origin === currentOrigin) {
          const currentPath = window.location.pathname;
          const targetPath = linkUrl.pathname;
          
          // 只在路径不同时显示loading
          if (currentPath !== targetPath) {
            startLoading();
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { startLoading };
} 