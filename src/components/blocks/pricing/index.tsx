"use client";

import { Check, Percent, Tag } from "lucide-react";
import { Pricing as PricingType } from "@/types/blocks/pricing";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import DiscountCheckoutModal from "@/components/checkout/discount-checkout-modal";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const pricingItems = pricing.items ?? [];

  const groupsWithItems = useMemo(() => {
    if (pricing.groups && pricing.groups.length > 0) {
      const grouped = pricing.groups
        .map((group, index) => {
          const items = pricingItems.filter(
            (item) => item.group && item.group === group.name
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
                  <p className="text-2xl font-bold text-foreground">
                    {title}
                  </p>
                </div>
              ) : null}

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5 lg:gap-8">
                {items.map((item, index) => (
                  <div
                    key={`${key}-${index}`}
                    className={`relative rounded-lg p-6 ${
                      item.is_featured
                        ? "border-primary border-2 bg-card text-card-foreground"
                        : "border-muted border"
                    }`}
                  >
                    {item.label && (
                      <Badge
                        variant="outline"
                        className="absolute -top-2.5 right-3 z-10 border-primary bg-primary px-1.5 text-primary-foreground shadow-sm"
                      >
                        {item.label}
                      </Badge>
                    )}

                    <div className="flex h-full flex-col justify-between gap-5">
                      <div>
                        <div className="mb-4">
                          {item.title && (
                            <h3 className="text-xl font-semibold">
                              {item.title}
                            </h3>
                          )}
                        </div>

                        <div className="mb-4 flex flex-col gap-1">
                          {item.original_price && (
                            <div className="text-lg font-semibold text-muted-foreground line-through">
                              {item.original_price}
                            </div>
                          )}
                          {item.price && (
                            <div className="text-5xl font-semibold">
                              {item.price}
                            </div>
                          )}
                          {item.unit && (
                            <div className="text-sm font-medium text-muted-foreground">
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
                            {item.features.map((feature, featureIndex) => (
                              <li
                                className="flex gap-2 text-sm"
                                key={`feature-${featureIndex}`}
                              >
                                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="text-foreground/90">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2.5 dark:border-amber-800/30 dark:bg-amber-950/20">
                          <Tag className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Have a discount code? Enter it at checkout.
                          </span>
                        </div>

                        {item.cn_amount && item.cn_amount > 0 ? (
                          <div className="flex items-center gap-x-2.5 rounded-md bg-muted/30 px-3 py-2">
                            <span className="text-sm font-medium text-foreground/80">
                              CNY payment
                            </span>
                            <span className="text-foreground/60">-&gt;</span>
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

                        {item.button && (
                          <DiscountCheckoutModal item={item}>
                            <Button className="flex w-full items-center justify-center gap-2 font-semibold shadow-sm transition-all hover:shadow-md">
                              {item.button.icon && (
                                <Icon
                                  name={item.button.icon}
                                  className="size-4"
                                />
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
