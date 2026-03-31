"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Shield, Star } from "lucide-react";
import { useAppContext } from "@/contexts/app";

interface NewcomerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export default function NewcomerPopup({ isOpen, onClose, onPurchase }: NewcomerPopupProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  // 倒计时逻辑 - 这里可以根据实际需求调整
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-center">
            <Gift className="w-6 h-6 text-green-600" />
            🎉 新人专享试用
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* 价格对比 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg text-gray-500 line-through">原价 ¥168</span>
              <span className="text-3xl font-bold text-green-600">现价 ¥66</span>
            </div>
            <Badge variant="destructive" className="text-lg px-3 py-1">
              限时 3.9 折 · 仅限 1 次
            </Badge>
          </div>

          {/* 倒计时 */}
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-700">限时优惠剩余时间</span>
            </div>
            <div className="flex justify-center gap-2">
              <div className="bg-red-600 text-white px-3 py-2 rounded text-xl font-mono">
                {formatTime(timeLeft.hours)}
              </div>
              <span className="text-red-600 text-xl font-bold">:</span>
              <div className="bg-red-600 text-white px-3 py-2 rounded text-xl font-mono">
                {formatTime(timeLeft.minutes)}
              </div>
              <span className="text-red-600 text-xl font-bold">:</span>
              <div className="bg-red-600 text-white px-3 py-2 rounded text-xl font-mono">
                {formatTime(timeLeft.seconds)}
              </div>
            </div>
          </div>

          {/* 说明文案 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium mb-2">首次使用没把握？先来试试新人专享包吧！</p>
                <p className="text-sm">
                  只需 ¥66，就能获得 <strong>1 篇 PS/SOP + 1 份简历</strong>。
                  用过满意，再放心升级多校申请包 / 全能组合包，<strong className="text-green-600">0 风险更安心</strong>。
                </p>
              </div>
            </div>
          </div>

          {/* 包含内容 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">包含内容：</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-green-600" />
                PS/SOP × 1
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-green-600" />
                简历 × 1
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-green-600" />
                专业AI生成
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-green-600" />
                3个月有效期
              </div>
            </div>
          </div>

          {/* 按钮区域 */}
          <div className="space-y-3">
            <Button 
              onClick={onPurchase}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 font-bold"
              size="lg"
            >
              立即解锁 ¥66
            </Button>
            <p className="text-xs text-center text-gray-500">
              每账号限购 1 次 · 新人专享
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}