"use client";

import { Check, Tag, Percent } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import DiscountCheckoutModal from "@/components/checkout/discount-checkout-modal";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const { user, setShowSignModal } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
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
        amount: cn_pay ? item.cn_amount : item.amount,
        currency: cn_pay ? "cny" : item.currency,
        valid_months: item.valid_months,
      };

      setIsLoading(true);
      setProductId(item.product_id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);

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
      setProductId(null);
    }
  };

  useEffect(() => {
    if (pricing.items) {
      setProductId(pricing.items[0].product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  return (
    <section id={pricing.name} className="py-16">
      <div className="container max-w-[2200px] px-8">
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            {pricing.description}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <div
            className="w-full mt-0 grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-4"
          >
            {pricing.items?.map((item, index) => {

              return (
                <div
                  key={index}
                  className={`rounded-lg p-6 ${
                    item.is_featured
                      ? "border-primary border-2 bg-card text-card-foreground"
                      : "border-muted border"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {item.title && (
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                        )}
                        <div className="flex-1"></div>
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 text-primary-foreground"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2 mb-4">
                        {item.original_price && (
                          <span className="text-xl text-muted-foreground font-semibold line-through">
                            {item.original_price}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-5xl font-semibold">
                            {item.price}
                          </span>
                        )}
                        {item.unit && (
                          <span className="block font-semibold">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.features_title && (
                        <p className="mb-3 mt-6 font-semibold">
                          {item.features_title}
                        </p>
                      )}
                      {item.features && (
                        <ul className="flex flex-col gap-3">
                          {item.features.map((feature, fi) => {
                            return (
                              <li className="flex gap-2" key={`feature-${fi}`}>
                                <Check className="mt-1 size-4 shrink-0" />
                                {feature}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Discount Hint Badge */}
                      <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700 font-medium">
                          有折扣码？点击购买时输入更优惠
                        </span>
                      </div>

                      {/* Chinese Payment Option */}
                      {item.cn_amount && item.cn_amount > 0 ? (
                        <div className="flex items-center gap-x-2 mt-2">
                          <span className="text-sm">人民币支付 👉</span>
                          <DiscountCheckoutModal item={item} cnPay={true}>
                            <div className="inline-block p-2 hover:cursor-pointer hover:bg-base-200 rounded-md">
                              <img
                                src="/imgs/cnpay.png"
                                alt="cnpay"
                                className="w-20 h-10 rounded-lg"
                              />
                            </div>
                          </DiscountCheckoutModal>
                        </div>
                      ) : null}

                      {/* Main Purchase Button */}
                      {item.button && (
                        <DiscountCheckoutModal item={item}>
                          <Button
                            className="w-full flex items-center justify-center gap-2 font-semibold"
                            disabled={isLoading}
                          >
                            {item.button.icon && (
                              <Icon name={item.button.icon} className="size-4" />
                            )}
                            <span>{item.button.title}</span>
                            <Percent className="w-4 h-4" />
                          </Button>
                        </DiscountCheckoutModal>
                      )}

                      {item.tip && (
                        <p className="text-muted-foreground text-sm mt-2">
                          {item.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
