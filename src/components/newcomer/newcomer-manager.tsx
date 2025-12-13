"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useAppContext } from "@/contexts/app";
import NewcomerPopup from "./newcomer-popup";
import NewcomerBanner from "./newcomer-banner";
import NewcomerFloatingCard from "./newcomer-floating-card";

const NEWCOMER_POPUP_DISMISSED_KEY = "newcomer_popup_dismissed";
const NEWCOMER_BANNER_DISMISSED_KEY = "newcomer_banner_dismissed";

export default function NewcomerManager() {
  const { data: session } = useSession();
  const { user } = useAppContext();
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showFloatingCard, setShowFloatingCard] = useState(false);
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  // 检查用户是否有资格使用新人专享包
  const checkNewcomerEligibility = async () => {
    if (!user || !session) return false;

    try {
      // 检查用户是否已经购买过新人专享包
      const response = await fetch("/api/orders/check-newcomer-eligibility", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { eligible } = await response.json();
        return eligible;
      }
    } catch (error) {
      console.error("检查新人资格失败:", error);
    }

    return false;
  };

  useEffect(() => {
    if (session && user && !hasCheckedEligibility) {
      checkNewcomerEligibility().then((eligible) => {
        setIsEligible(eligible);
        setHasCheckedEligibility(true);

        if (eligible) {
          // 检查是否已经关闭过弹窗
          const popupDismissed = localStorage.getItem(NEWCOMER_POPUP_DISMISSED_KEY);
          const bannerDismissed = localStorage.getItem(NEWCOMER_BANNER_DISMISSED_KEY);

          if (!popupDismissed) {
            // 首次显示弹窗
            setShowPopup(true);
          } else if (!bannerDismissed) {
            // 弹窗已关闭，显示横幅
            setShowBanner(true);
            setShowFloatingCard(true);
          } else {
            // 横幅也已关闭，只显示悬浮卡片
            setShowFloatingCard(true);
          }
        }
      });
    }
  }, [session, user, hasCheckedEligibility]);

  const handlePurchase = () => {
    // 跳转到定价页面或直接打开购买流程
    const newcomerItem = {
      product_id: "newcomer-package",
      product_name: "新人专享包",
      amount: 6600,
      cn_amount: 6600,
      currency: "cny",
      credits: 2,
      valid_months: 3,
      interval: "one-time"
    };

    // 调用现有的购买流程
    handleCheckout(newcomerItem);
  };

  const handleCheckout = async (item: any) => {
    try {
      const params = {
        product_id: item.product_id,
        product_name: item.product_name,
        credits: item.credits,
        interval: item.interval,
        amount: item.amount,
        currency: item.currency,
        valid_months: item.valid_months,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        // 需要登录
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        console.error(message);
        return;
      }

      const { public_key, session_id } = data;
      
      // 动态导入 Stripe
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(public_key);
      if (!stripe) {
        console.error("Stripe 加载失败");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (e) {
      console.error("购买失败:", e);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.setItem(NEWCOMER_POPUP_DISMISSED_KEY, "true");
    
    // 关闭弹窗后显示横幅和悬浮卡片
    setShowBanner(true);
    setShowFloatingCard(true);
  };

  const handleBannerDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(NEWCOMER_BANNER_DISMISSED_KEY, "true");
    
    // 横幅关闭后继续显示悬浮卡片
    setShowFloatingCard(true);
  };

  // 如果用户不符合条件，不显示任何内容
  if (!isEligible) {
    return null;
  }

  return (
    <>
      {showPopup && (
        <NewcomerPopup
          isOpen={showPopup}
          onClose={handlePopupClose}
          onPurchase={handlePurchase}
        />
      )}
      
      {showBanner && (
        <NewcomerBanner
          onPurchase={handlePurchase}
          onDismiss={handleBannerDismiss}
        />
      )}
      
      {showFloatingCard && (
        <NewcomerFloatingCard
          onPurchase={handlePurchase}
        />
      )}
    </>
  );
}