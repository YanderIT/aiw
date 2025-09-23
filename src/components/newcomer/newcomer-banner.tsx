"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Gift, X } from "lucide-react";

interface NewcomerBannerProps {
  onPurchase: () => void;
  onDismiss: () => void;
}

export default function NewcomerBanner({ onPurchase, onDismiss }: NewcomerBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  // 倒计时逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* 左侧文案 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              🎉 新人专享试用 · 仅 ¥66 <span className="text-gray-600">(原价 ¥168)</span>
            </span>
          </div>
          <div className="hidden md:block text-sm text-gray-700">
            试用过后再放心选择单校 / 多校 / 全能套餐
          </div>
        </div>

        {/* 中间倒计时 */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          <div className="flex gap-1">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
              {formatTime(timeLeft.hours)}
            </span>
            <span className="text-red-600">:</span>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
              {formatTime(timeLeft.minutes)}
            </span>
            <span className="text-red-600">:</span>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {/* 右侧按钮 */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={onPurchase}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            size="sm"
          >
            立即解锁
          </Button>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}