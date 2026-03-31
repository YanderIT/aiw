"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Gift, Save } from "lucide-react";

interface Settings {
  reward_type: "service_quota";
  reward_value: number;
  reward_quotas: Record<string, number>;
  trigger_condition: "on_register" | "first_paid" | "every_paid";
  min_order_amount: number;
  max_rewards_per_user: number | null;
  is_active: boolean;
}

const SERVICE_LABELS: Record<string, string> = {
  ps_sop: "PS/SOP",
  recommendation: "推荐信",
  cover_letter: "Cover Letter",
  resume: "简历",
  universal: "通用（任意服务）",
};

export default function AffiliateSettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    reward_type: "service_quota",
    reward_value: 0,
    reward_quotas: { ps_sop: 0, recommendation: 0, cover_letter: 0, resume: 0, universal: 0 },
    trigger_condition: "first_paid",
    min_order_amount: 0,
    max_rewards_per_user: null,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/affiliate-settings");
      const result = await res.json();
      if (result.code === 0 && result.data) {
        setSettings({
          reward_type: "service_quota",
          reward_value: result.data.reward_value || 0,
          reward_quotas: result.data.reward_quotas || { ps_sop: 0, recommendation: 0, cover_letter: 0, resume: 0, universal: 0 },
          trigger_condition: result.data.trigger_condition || "first_paid",
          min_order_amount: result.data.min_order_amount || 0,
          max_rewards_per_user: result.data.max_rewards_per_user,
          is_active: result.data.is_active,
        });
      }
    } catch (error: any) {
      toast.error("加载设置失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/affiliate-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          reward_type: "service_quota",
        }),
      });
      const result = await res.json();
      if (result.code === 0) {
        toast.success("设置已保存");
      } else {
        toast.error(result.message || "保存失败");
      }
    } catch (error: any) {
      toast.error("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuota = (type: string, value: string) => {
    setSettings((prev: Settings) => ({
      ...prev,
      reward_quotas: {
        ...prev.reward_quotas,
        [type]: Math.max(0, parseInt(value) || 0),
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>邀请奖励规则</CardTitle>
                <CardDescription>设置邀请人在被邀请人下单后获得的服务次数奖励</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="is-active" className="text-sm">
                {settings.is_active ? "已启用" : "已禁用"}
              </Label>
              <Switch
                id="is-active"
                checked={settings.is_active}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, is_active: checked })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 奖励服务次数配置 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">奖励服务次数</Label>
            <p className="text-xs text-muted-foreground">
              被邀请人完成付款后，邀请人将获得以下服务次数奖励
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {Object.entries(SERVICE_LABELS).map(([type, label]: [string, string]) => (
                <div key={type} className="flex items-center gap-3">
                  <Label className="w-32 text-sm shrink-0">{label}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={settings.reward_quotas[type] || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuota(type, e.target.value)}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">次</span>
                </div>
              ))}
            </div>
          </div>

          {/* 触发条件 */}
          <div className="space-y-2">
            <Label>触发条件</Label>
            <Select
              value={settings.trigger_condition}
              onValueChange={(value: string) =>
                setSettings({ ...settings, trigger_condition: value as Settings["trigger_condition"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_paid">被邀请人首次付款时</SelectItem>
                <SelectItem value="every_paid">被邀请人每次付款时</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 最大奖励次数 */}
          <div className="space-y-2">
            <Label>每个邀请人最大奖励次数</Label>
            <Input
              type="number"
              value={settings.max_rewards_per_user ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSettings({
                  ...settings,
                  max_rewards_per_user: e.target.value ? Number(e.target.value) : null,
                })
              }
              min={0}
              placeholder="留空表示无限制"
            />
            <p className="text-xs text-muted-foreground">留空或 0 表示不限制</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-32">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  );
}
