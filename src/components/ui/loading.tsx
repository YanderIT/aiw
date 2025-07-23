"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Script from 'next/script';

// Declare the custom element type for Spline viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
      }, HTMLElement>;
    }
  }
}

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: { container: "w-10 h-10", dot: "w-2 h-2", text: "text-sm" },
    md: { container: "w-16 h-16", dot: "w-2.5 h-2.5", text: "text-base" },
    lg: { container: "w-24 h-24", dot: "w-3.5 h-3.5", text: "text-lg" }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 loading-float", className)}>
      {/* 简洁的loading动画 */}
      <div className={cn("relative", sizeClasses[size].container)}>
        {/* 主圆环 */}
        <div className="absolute inset-0 rounded-full animate-spin" 
             style={{ 
               background: `conic-gradient(from 0deg, transparent 25%, hsl(var(--primary)) 50%, transparent 75%)`,
               animationDuration: "1.2s"
             }} 
        />
        
        {/* 内层背景 */}
        <div className="absolute inset-[2px] rounded-full bg-background" />
        
        {/* 中心三个跳动的点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1.5">
            <div 
              className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size].dot)}
              style={{ 
                animationDelay: "0ms", 
                animationDuration: "1.4s"
              }}
            />
            <div 
              className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size].dot)}
              style={{ 
                animationDelay: "200ms", 
                animationDuration: "1.4s"
              }}
            />
            <div 
              className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size].dot)}
              style={{ 
                animationDelay: "400ms", 
                animationDuration: "1.4s"
              }}
            />
          </div>
        </div>
      </div>
      
      {/* 加载文本 */}
      {text && (
        <p className={cn("text-muted-foreground font-medium tracking-wide animate-pulse", sizeClasses[size].text)}>
          {text}
        </p>
      )}
    </div>
  );
}

export function GlobalLoading({ isVisible }: { isVisible: boolean }) {
  const t = useTranslations("loading");
  
  if (!isVisible) return null;

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.35/build/spline-viewer.js"
        strategy="lazyOnload"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300">
        {/* Spline 3D 背景 */}
        <div className="absolute inset-0 w-full h-full">
          <spline-viewer 
            url="https://prod.spline.design/YFEMfsdvjo6yr8Tu/scene.splinecode"
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        {/* 渐变背景遮罩 - 确保内容可见 */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80 backdrop-blur-sm" />
      
      {/* Loading卡片 */}
      <div className="relative z-10 animate-in zoom-in-95 duration-500 delay-100">
        <div className="relative p-20">
          {/* Loading内容 */}
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <Loading size="lg" text={t("page_loading")} />
            
            {/* 额外的进度提示 */}
            <div className="mt-8 w-64 h-2 bg-muted/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full loading-shimmer" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 浮动装饰点 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-0" style={{animationDuration: "3s"}} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce delay-1000" style={{animationDuration: "3.5s"}} />
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-primary/20 rounded-full animate-bounce delay-2000" style={{animationDuration: "4s"}} />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary/25 rounded-full animate-bounce delay-500" style={{animationDuration: "2.5s"}} />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-primary/35 rounded-full animate-bounce delay-1500" style={{animationDuration: "3.2s"}} />
        <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-primary/25 rounded-full animate-bounce delay-800" style={{animationDuration: "3.8s"}} />
      </div>
    </div>
    </>
  );
} 