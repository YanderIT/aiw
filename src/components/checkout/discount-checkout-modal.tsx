"use client";

import { useState } from "react";
import { PricingItem } from "@/types/blocks/pricing";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Loader2, Wallet, Check } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useAppContext } from "@/contexts/app";
import DiscountCodeInput from "./discount-code-input";

type PaymentMethod = "wechat" | "alipay";

interface DiscountCheckoutModalProps {
  item: PricingItem;
  children: React.ReactNode;
  cnPay?: boolean;
  extraParams?: Record<string, string>;
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
  cnPay = false,
  extraParams = {},
}: DiscountCheckoutModalProps) {
  const { user, setShowSignModal } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("alipay");

  const useXunhuPay = cnPay || item.currency?.toLowerCase() === "cny";
  const originalAmount = useXunhuPay
    ? item.cn_amount || item.amount
    : item.amount;
  const finalAmount = discountData ? discountData.finalAmount : originalAmount;
  const savings = discountData ? discountData.discountAmount : 0;
  const bonusCredits = discountData ? discountData.bonusCredits : 0;

  const handleCheckout = async () => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      if (useXunhuPay && paymentMethod === "wechat") {
        toast.error("微信支付暂未开通，请选择支付宝支付");
        return;
      }

      const endpoint = useXunhuPay ? "/api/xunhu-pay" : "/api/checkout";
      const params = {
        product_id: item.product_id,
        product_name: item.product_name,
        credits: item.credits,
        interval: item.interval,
        amount: originalAmount,
        currency: useXunhuPay ? "cny" : item.currency,
        valid_months: item.valid_months,
        discount_code: discountData?.code || undefined,
        ...(useXunhuPay ? { payment_method: paymentMethod } : {}),
        ...extraParams,
      };

      setIsLoading(true);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      if (data.free_order) {
        const isPolishing = item.product_id === "polishing-single";
        toast.success(isPolishing ? "支付成功，我们的专业老师将尽快为您处理" : "订单已生效，积分已到账！");
        setIsOpen(false);
        if (isPolishing) {
          window.location.reload();
        } else {
          window.location.href = "/my-orders";
        }
        return;
      }

      if (useXunhuPay && data.payment_url) {
        window.location.href = data.payment_url;
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
    } catch (error) {
      console.log("checkout failed: ", error);
      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscountApplied = (discount: DiscountData) => {
    setDiscountData(discount);

    const messages = [];
    if (discount.discountAmount > 0) {
      messages.push(`saved CNY ${(discount.discountAmount / 100).toFixed(2)}`);
    }
    if (discount.bonusCredits > 0) {
      messages.push(`bonus ${discount.bonusCredits} credits`);
    }

    toast.success(
      messages.length > 0
        ? `discount applied: ${messages.join(", ")}`
        : "discount applied"
    );
  };

  const handleDiscountRemoved = () => {
    setDiscountData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Confirm purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                    <p className="mb-2 font-semibold">
                      {item.features_title || "Included"}
                    </p>
                    <ul className="space-y-1">
                      {item.features.map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <DiscountCodeInput
            productId={item.product_id}
            originalAmount={originalAmount}
            onDiscountApplied={handleDiscountApplied}
            onDiscountRemoved={handleDiscountRemoved}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Original price</span>
                <span>CNY {(originalAmount / 100).toFixed(2)}</span>
              </div>

              {item.original_price && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Reference price</span>
                  <span className="line-through">{item.original_price}</span>
                </div>
              )}

              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-CNY {(savings / 100).toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  CNY {(finalAmount / 100).toFixed(2)}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Credits</span>
                  <span>
                    {(item.credits || 0) + bonusCredits}
                    {bonusCredits > 0 && (
                      <span className="text-green-600">
                        {` (includes ${bonusCredits} bonus)`}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valid for</span>
                  <span>{item.valid_months} month(s)</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span>CNY {(savings / 100).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {useXunhuPay && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">选择支付方式</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wechat")}
                    className={`relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all duration-200 cursor-pointer ${
                      paymentMethod === "wechat"
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        paymentMethod === "wechat"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {paymentMethod === "wechat" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <img src="/imgs/weixinzhifu.svg" alt="微信支付" className="h-6 w-6 shrink-0" />
                    <span className="text-sm font-medium">微信支付</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("alipay")}
                    className={`relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all duration-200 cursor-pointer ${
                      paymentMethod === "alipay"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        paymentMethod === "alipay"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {paymentMethod === "alipay" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <img src="/imgs/zhifubao.svg" alt="支付宝" className="h-6 w-6 shrink-0" />
                    <span className="text-sm font-medium">支付宝</span>
                  </button>
                </div>
              </div>
            )}

            <Button
              className="h-12 w-full text-base font-semibold"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {useXunhuPay ? (
                    <Wallet className="mr-2 h-4 w-4" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  Pay now CNY {(finalAmount / 100).toFixed(2)}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-500">
              支付成功后立即开通服务。
            </p>
            <p className="text-center text-xs text-gray-400">
              购买后如遇系统生成异常，可联系小助手，我们会及时协助处理并补发相应次数，请放心使用。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
