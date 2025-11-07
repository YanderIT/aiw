"use client";

import { Check, Tag, Percent } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { useEffect, useMemo, useState } from "react";

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
  const pricingItems = pricing.items ?? [];

  const groupsWithItems = useMemo(() => {
    if (pricing.groups && pricing.groups.length > 0) {
      const grouped = pricing.groups
        .map((group, index) => {
          const items = pricingItems.filter(
            (item) => item.group && item.group === group.name,
          );

          return {
            key: group.name ?? `group-${index}`,
            title: group.title ?? group.label,
            items,
          };
        })
        .filter(({ items }) => items.length > 0);

      const ungrouped = pricingItems.filter((item) => {
        if (!item.group) {
          return true;
        }

        return !pricing.groups?.some((group) => group.name === item.group);
      });

      if (ungrouped.length > 0) {
        grouped.push({
          key: "ungrouped",
          title: undefined,
          items: ungrouped,
        });
      }

      if (grouped.length > 0) {
        return grouped;
      }
    }

    return [
      {
        key: "all",
        title: undefined,
        items: pricingItems,
      },
    ];
  }, [pricing.groups, pricingItems]);

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
    if (pricingItems.length > 0) {
      setProductId(pricingItems[0].product_id);
      setIsLoading(false);
    }
  }, [pricingItems]);

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
        <div className="flex w-full flex-col gap-10">
          {groupsWithItems.map(({ key, title, items }) => (
            <div key={key} className="flex w-full flex-col gap-4">
              {title ? (
                <div className="text-center lg:text-left">
                  <p className="text-base font-semibold text-muted-foreground">
                    {title}
                  </p>
                </div>
              ) : null}
              <div className="grid w-full gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                {items.map((item, index) => {
                  return (
                    <div
                      key={`${key}-${index}`}
                      className={`rounded-lg p-6 ${
                        item.is_featured
                          ? "border-primary border-2 bg-card text-card-foreground"
                          : "border-muted border"
                      }`}
                    >
                      <div className="flex h-full flex-col justify-between gap-5">
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            {item.title && (
                              <h3 className="text-xl font-semibold">
                                {item.title}
                              </h3>
                            )}
                            <div className="flex-1" />
                            {item.label && (
                              <Badge
                                variant="outline"
                                className="border-primary bg-primary px-1.5 text-primary-foreground"
                              >
                                {item.label}
                              </Badge>
                            )}
                          </div>
                          <div className="mb-4">
                            <div className="flex items-end gap-2">
                              {item.original_price && (
                                <span className="text-xl font-semibold text-muted-foreground line-through">
                                  {item.original_price}
                                </span>
                              )}
                              {item.price && (
                                <span className="text-5xl font-semibold">
                                  {item.price}
                                </span>
                              )}
                            </div>
                            {item.unit && (
                              <div className="mt-1 text-sm font-medium text-muted-foreground">
                                {item.unit}
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                          {item.features_title && (
                            <p className="mb-3 mt-6 text-base font-bold text-foreground">
                              {item.features_title}
                            </p>
                          )}
                          {item.features && (
                            <ul className="flex flex-col gap-2.5">
                              {item.features.map((feature, fi) => {
                                return (
                                  <li className="flex gap-2 text-sm" key={`feature-${fi}`}>
                                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <span className="text-foreground/90">{feature}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          {/* Discount Hint Badge */}
                          <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2.5 dark:border-amber-800/30 dark:bg-amber-950/20">
                            <Tag className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                              有折扣码？点击购买时输入更优惠
                            </span>
                          </div>

                          {/* Chinese Payment Option */}
                          {item.cn_amount && item.cn_amount > 0 ? (
                            <div className="flex items-center gap-x-2.5 rounded-md bg-muted/30 px-3 py-2">
                              <span className="text-sm font-medium text-foreground/80">人民币支付</span>
                              <span className="text-foreground/60">👉</span>
                              <DiscountCheckoutModal item={item} cnPay={true}>
                                <div className="inline-block rounded-md p-1.5 transition-all hover:cursor-pointer hover:bg-muted/60">
                                  <img
                                    src="/imgs/cnpay.png"
                                    alt="cnpay"
                                    className="h-8 w-16 rounded"
                                  />
                                </div>
                              </DiscountCheckoutModal>
                            </div>
                          ) : null}

                          {/* Main Purchase Button */}
                          {item.button && (
                            <DiscountCheckoutModal item={item}>
                              <Button
                                className="flex w-full items-center justify-center gap-2 font-semibold shadow-sm transition-all hover:shadow-md"
                                disabled={isLoading}
                              >
                                {item.button.icon && (
                                  <Icon name={item.button.icon} className="size-4" />
                                )}
                                <span>{item.button.title}</span>
                                <Percent className="h-4 w-4" />
                              </Button>
                            </DiscountCheckoutModal>
                          )}

                          {item.tip && (
                            <p className="text-center text-xs text-muted-foreground">
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
          ))}
        </div>
      </div>
    </section>
  );
}
