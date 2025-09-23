"use client";

import { useState } from "react";
import { PricingItem } from "@/types/blocks/pricing";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useAppContext } from "@/contexts/app";
import DiscountCodeInput from "./discount-code-input";

interface DiscountCheckoutModalProps {
  item: PricingItem;
  children: React.ReactNode;
  cnPay?: boolean;
}

interface DiscountData {
  code: string;
  discountAmount: number;
  bonusCredits: number;
  finalAmount: number;
}

export default function DiscountCheckoutModal({
  item,
  children,
  cnPay = false
}: DiscountCheckoutModalProps) {
  const { user, setShowSignModal } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);

  const originalAmount = cnPay ? (item.cn_amount || item.amount) : item.amount;
  const finalAmount = discountData ? discountData.finalAmount : originalAmount;
  const savings = discountData ? discountData.discountAmount : 0;
  const bonusCredits = discountData ? discountData.bonusCredits : 0;

  const handleCheckout = async () => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      const params = {
        product_id: item.product_id,
        product_name: item.product_name,
        credits: item.credits,
        interval: item.interval,
        amount: originalAmount,
        currency: cnPay ? "cny" : item.currency,
        valid_months: item.valid_months,
        discount_code: discountData?.code || undefined,
      };

      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (e) {
      console.log("checkout failed: ", e);
      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscountApplied = (discount: DiscountData) => {
    setDiscountData(discount);
    toast.success(`折扣码已应用！${discount.discountAmount > 0 ? `立减¥${(discount.discountAmount / 100).toFixed(2)}` : ""}${discount.bonusCredits > 0 ? ` + 赠送${discount.bonusCredits}次生成` : ""}`);
  };

  const handleDiscountRemoved = () => {
    setDiscountData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            确认购买
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{item.title}</span>
                {item.label && (
                  <Badge className="bg-primary text-primary-foreground">
                    {item.label}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">{item.description}</p>

                {item.features && (
                  <div>
                    <p className="font-semibold mb-2">{item.features_title || "包含内容"}</p>
                    <ul className="space-y-1">
                      {item.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Discount Code Input */}
          <DiscountCodeInput
            productId={item.product_id}
            originalAmount={originalAmount}
            onDiscountApplied={handleDiscountApplied}
            onDiscountRemoved={handleDiscountRemoved}
          />

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">价格明细</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>原价</span>
                <span>¥{(originalAmount / 100).toFixed(2)}</span>
              </div>

              {item.original_price && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>市场参考价</span>
                  <span className="line-through">{item.original_price}</span>
                </div>
              )}

              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>折扣优惠</span>
                  <span>-¥{(savings / 100).toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>实付金额</span>
                <span className="text-green-600">¥{(finalAmount / 100).toFixed(2)}</span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>生成次数</span>
                  <span>{item.credits + bonusCredits} 次{bonusCredits > 0 && <span className="text-green-600">（含赠送 {bonusCredits} 次）</span>}</span>
                </div>
                <div className="flex justify-between">
                  <span>有效期</span>
                  <span>{item.valid_months} 个月</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>本次节省</span>
                    <span>¥{(savings / 100).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Chinese Payment Option */}
            {item.cn_amount && item.cn_amount > 0 && cnPay && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">人民币支付方式</p>
                <div className="flex gap-2">
                  <img src="/imgs/cnpay.png" alt="cnpay" className="w-20 h-10 rounded-lg" />
                </div>
              </div>
            )}

            {/* Main Purchase Button */}
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  处理中...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  立即支付 ¥{(finalAmount / 100).toFixed(2)}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              点击支付即表示同意服务条款，支付成功后立即开通服务
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}