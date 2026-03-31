"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PayStatus = "loading" | "paid" | "pending" | "failed" | "error";

interface OrderInfo {
  product_name?: string;
  credits?: number;
  amount?: number;
  currency?: string;
  message?: string;
}

export default function PaySuccessClient({
  orderNo,
  locale,
}: {
  orderNo: string;
  locale: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<PayStatus>("loading");
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({});
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 6;

  const verifyPayment = useCallback(async () => {
    try {
      const res = await fetch("/api/xunhu-pay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_no: orderNo }),
      });

      const { code, data, message } = await res.json();

      if (code !== 0) {
        setStatus("error");
        setOrderInfo({ message });
        return;
      }

      if (data.status === "paid") {
        setStatus("paid");
        setOrderInfo(data);
        return;
      }

      if (data.status === "pending") {
        setStatus("pending");
        return;
      }

      setStatus("failed");
      setOrderInfo(data);
    } catch (err: any) {
      setStatus("error");
      setOrderInfo({ message: err.message });
    }
  }, [orderNo]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  useEffect(() => {
    if (status === "pending" && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setRetryCount((c: number) => c + 1);
        verifyPayment();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, retryCount, verifyPayment]);

  const formatAmount = (amount?: number, currency?: string) => {
    if (!amount) return "";
    const yuan = (amount / 100).toFixed(2);
    return currency === "cny" ? `¥${yuan}` : `$${yuan}`;
  };

  const isZh = locale === "zh";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isZh ? "支付结果" : "Payment Result"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-muted-foreground text-center">
                {isZh ? "正在查询支付结果..." : "Verifying payment..."}
              </p>
            </>
          )}

          {status === "pending" && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
              <p className="text-muted-foreground text-center">
                {isZh
                  ? `等待支付确认中...（${retryCount}/${maxRetries}）`
                  : `Waiting for payment confirmation... (${retryCount}/${maxRetries})`}
              </p>
              <p className="text-sm text-muted-foreground">
                {isZh
                  ? "如果您已完成支付，请稍候..."
                  : "If you have completed the payment, please wait..."}
              </p>
            </>
          )}

          {status === "paid" && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-green-600">
                  {isZh ? "支付成功！" : "Payment Successful!"}
                </p>
                {orderInfo.product_name && (
                  <p className="text-muted-foreground">
                    {isZh ? "套餐" : "Package"}:{" "}
                    <span className="font-medium text-foreground">
                      {orderInfo.product_name}
                    </span>
                  </p>
                )}
                {orderInfo.amount !== undefined && (
                  <p className="text-muted-foreground">
                    {isZh ? "金额" : "Amount"}:{" "}
                    <span className="font-medium text-foreground">
                      {formatAmount(orderInfo.amount, orderInfo.currency)}
                    </span>
                  </p>
                )}
                {orderInfo.credits !== undefined && orderInfo.credits > 0 && (
                  <p className="text-muted-foreground">
                    {isZh ? "获得积分" : "Credits"}:{" "}
                    <span className="font-medium text-foreground">
                      +{orderInfo.credits}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={() => router.push(`/${locale}/my-orders`)}
                >
                  {isZh ? "查看订单" : "View Orders"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${locale}/my-credits`)}
                >
                  {isZh ? "查看积分" : "View Credits"}
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-red-600">
                  {isZh ? "支付未完成" : "Payment Not Completed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderInfo.message ||
                    (isZh
                      ? "订单未支付或已取消"
                      : "Order unpaid or cancelled")}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button onClick={() => router.push(`/${locale}/#pricing`)}>
                  {isZh ? "重新购买" : "Try Again"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => verifyPayment()}
                >
                  {isZh ? "重新查询" : "Retry"}
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-yellow-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  {isZh ? "查询异常" : "Verification Error"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderInfo.message ||
                    (isZh ? "请稍后重试" : "Please try again later")}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button onClick={() => verifyPayment()}>
                  {isZh ? "重新查询" : "Retry"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${locale}/my-orders`)}
                >
                  {isZh ? "查看订单" : "View Orders"}
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            {isZh ? "订单号" : "Order No"}: {orderNo}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
