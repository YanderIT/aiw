"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Clock } from "lucide-react";

interface NewcomerFloatingCardProps {
  onPurchase: () => void;
}

export default function NewcomerFloatingCard({ onPurchase }: NewcomerFloatingCardProps) {
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
    <Card className="fixed bottom-6 right-6 w-64 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 shadow-lg z-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">🎉 新人专享包</span>
          </div>

          {/* 价格 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">¥66</div>
            <div className="text-sm text-gray-500 line-through">原价 ¥168</div>
          </div>

          {/* 小倒计时 */}
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-red-600" />
            <div className="flex gap-1 text-sm">
              <span className="bg-red-600 text-white px-1 py-0.5 rounded font-mono">
                {formatTime(timeLeft.hours)}
              </span>
              <span className="text-red-600">:</span>
              <span className="bg-red-600 text-white px-1 py-0.5 rounded font-mono">
                {formatTime(timeLeft.minutes)}
              </span>
              <span className="text-red-600">:</span>
              <span className="bg-red-600 text-white px-1 py-0.5 rounded font-mono">
                {formatTime(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* 按钮 */}
          <Button 
            onClick={onPurchase}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            size="sm"
          >
            立即解锁
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}