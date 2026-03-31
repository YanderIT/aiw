"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

interface InviteProps {
  summary: any;
  rewardType?: string;
  rewardValue?: number;
  rewardQuotas?: Record<string, number>;
}

export default function Invite({
  summary,
  rewardType = "service_quota",
  rewardValue = 0,
  rewardQuotas = {},
}: InviteProps) {
  const t = useTranslations();
  const { user, setUser } = useAppContext();
  const [generating, setGenerating] = useState(false);

  // 没有邀请码时自动生成
  useEffect(() => {
    if (user && user.uuid && !user.invite_code && !generating) {
      generateInviteCode();
    }
  }, [user]);

  const generateInviteCode = async () => {
    setGenerating(true);
    try {
      const resp = await fetch("/api/update-invite-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) return;

      const { code, data } = await resp.json();
      if (code === 0 && data) {
        setUser(data);
      }
    } catch (e) {
      console.log("generate invite code failed", e);
    } finally {
      setGenerating(false);
    }
  };

  const serviceLabels: Record<string, string> = {
    ps_sop: "PS/SOP",
    recommendation: "推荐信",
    cover_letter: "Cover Letter",
    resume: "简历",
    universal: "通用",
  };

  const rewardDisplay = `${summary.total_paid} 次奖励`;

  const rewardTip = () => {
    const quotaEntries = Object.entries(rewardQuotas).filter(([_, v]) => v > 0);
    if (quotaEntries.length === 0) {
      return "分享邀请码给朋友，朋友下单后您可获得服务次数奖励。";
    }
    const quotaText = quotaEntries
      .map(([type, count]) => `${serviceLabels[type] || type} × ${count}`)
      .join("、");
    return `分享邀请码给朋友，朋友下单后您可获得：${quotaText}`;
  };

  return (
    <div className="flex flex-wrap gap-6">
      <Card className="flex-1 p-6">
        <h2 className="text-sm text-gray-500 mb-4">
          {t("my_invites.invite_code")}
        </h2>
        {user && user.uuid && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {generating ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <span className="text-3xl font-bold font-mono tracking-wider">
                  {user.invite_code || "生成中..."}
                </span>
              )}
            </div>
            {user.invite_code && (
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_WEB_URL}/i/${user.invite_code}`}
                onCopy={() => toast.success("已复制邀请链接")}
              >
                <Button size="sm">{t("my_invites.copy_invite_link")}</Button>
              </CopyToClipboard>
            )}
          </div>
        )}
        <p className="text-sm text-gray-500">{rewardTip()}</p>
      </Card>

      <Card className="flex-1 p-6">
        <h2 className="text-sm text-gray-500 mb-6">
          {t("my_invites.invite_balance")}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-3xl font-bold">{summary.total_invited}</p>
            <p className="text-sm text-gray-500">
              {t("my_invites.total_invite_count")}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary.total_paid}</p>
            <p className="text-sm text-gray-500">
              {t("my_invites.total_paid_count")}
            </p>
          </div>
        </div>

        {summary.total_paid > 0 && summary.total_quotas && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              已获得奖励
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {Object.entries(summary.total_quotas as Record<string, number>)
                .filter(([_, v]) => v > 0)
                .map(([type, count]) => `${serviceLabels[type] || type}×${count}`)
                .join("、") || "服务次数奖励"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
