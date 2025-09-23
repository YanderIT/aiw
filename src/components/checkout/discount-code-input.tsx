"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Gift, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DiscountCodeInputProps {
  productId: string;
  originalAmount: number;
  onDiscountApplied: (discountData: {
    code: string;
    discountAmount: number;
    bonusCredits: number;
    finalAmount: number;
  }) => void;
  onDiscountRemoved: () => void;
}

export default function DiscountCodeInput({
  productId,
  originalAmount,
  onDiscountApplied,
  onDiscountRemoved
}: DiscountCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [discountData, setDiscountData] = useState<any>(null);

  const validateDiscountCode = async () => {
    if (!code.trim()) {
      toast.error("请输入折扣码");
      return;
    }

    setIsValidating(true);
    
    try {
      const response = await fetch("/api/discount/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          product_id: productId,
          amount: originalAmount
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        const { discount_amount, bonus_credits, final_amount } = result.data;
        
        setDiscountData({
          code: code.trim(),
          discountAmount: discount_amount,
          bonusCredits: bonus_credits,
          finalAmount: final_amount
        });

        onDiscountApplied({
          code: code.trim(),
          discountAmount: discount_amount,
          bonusCredits: bonus_credits,
          finalAmount: final_amount
        });

        toast.success("折扣码验证成功！");
      } else {
        toast.error(result.message || "折扣码无效");
      }
    } catch (error) {
      console.error("验证折扣码失败:", error);
      toast.error("验证失败，请重试");
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscount = () => {
    setCode("");
    setDiscountData(null);
    onDiscountRemoved();
    toast.success("已移除折扣码");
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold">折扣码</h3>
      </div>

      {!discountData ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="请输入折扣码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && validateDiscountCode()}
              disabled={isValidating}
            />
            <Button
              onClick={validateDiscountCode}
              disabled={isValidating || !code.trim()}
              size="sm"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "验证"
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            支持打折优惠或赠送积分，输入后系统会自动验证
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">
                  折扣码：{discountData.code}
                </div>
                <div className="text-sm text-green-600">
                  {discountData.discountAmount > 0 && (
                    <span>立减 ¥{(discountData.discountAmount / 100).toFixed(2)}</span>
                  )}
                  {discountData.bonusCredits > 0 && (
                    <span>
                      {discountData.discountAmount > 0 ? " + " : ""}
                      赠送 {discountData.bonusCredits} 次生成
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={removeDiscount}
              variant="outline"
              size="sm"
            >
              移除
            </Button>
          </div>

          {/* 价格变化显示 */}
          <div className="text-sm">
            <div className="flex justify-between">
              <span>原价：</span>
              <span>¥{(originalAmount / 100).toFixed(2)}</span>
            </div>
            {discountData.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>折扣：</span>
                <span>-¥{(discountData.discountAmount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>实付：</span>
              <span className="text-green-600">
                ¥{(discountData.finalAmount / 100).toFixed(2)}
              </span>
            </div>
            {discountData.bonusCredits > 0 && (
              <div className="text-xs text-gray-600 mt-1">
                支付成功后将额外获得 {discountData.bonusCredits} 次生成机会
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}