"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KeyRound, Coins } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

type DialogType = "password" | "credits" | null;
type ServiceType = "ps_sop" | "recommendation" | "cover_letter" | "resume" | "universal";

const SERVICE_LABELS: Record<ServiceType, string> = {
  ps_sop: "PS/SOP",
  recommendation: "推荐信",
  cover_letter: "Cover Letter",
  resume: "简历",
  universal: "通用",
};

const ALL_SERVICE_TYPES: ServiceType[] = [
  "ps_sop",
  "recommendation",
  "cover_letter",
  "resume",
  "universal",
];

function QuotaSummary({ quotas }: { quotas: Record<ServiceType, number> }) {
  const hasAny = ALL_SERVICE_TYPES.some((t: ServiceType) => (quotas[t] || 0) > 0);
  if (!hasAny) return <span className="text-muted-foreground text-xs">无</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {ALL_SERVICE_TYPES.map((t: ServiceType) => {
        const count = quotas[t] || 0;
        if (count <= 0) return null;
        return (
          <span
            key={t}
            className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium"
          >
            {SERVICE_LABELS[t]}:{count}
          </span>
        );
      })}
    </div>
  );
}

export default function UsersManagement({
  users,
  userQuotasMap,
}: {
  users: User[];
  userQuotasMap: Record<string, Record<ServiceType, number>>;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [newPassword, setNewPassword] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>("ps_sop");
  const [quotaAmount, setQuotaAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotasMap, setQuotasMap] = useState(userQuotasMap);

  const openDialog = (user: User, type: DialogType) => {
    setSelectedUser(user);
    setDialogType(type);
    setNewPassword("");
    setSelectedServiceType("ps_sop");
    setQuotaAmount("");
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  const handleResetPassword = async () => {
    if (!selectedUser?.uuid || !newPassword) return;
    if (newPassword.length < 8) {
      toast.error("密码至少8个字符");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_uuid: selectedUser.uuid,
          new_password: newPassword,
        }),
      });
      const result = await res.json();
      if (result.code === 0) {
        toast.success(`已重置 ${selectedUser.email} 的密码`);
        closeDialog();
      } else {
        toast.error(result.message || "重置失败");
      }
    } catch (error: any) {
      toast.error("重置失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuota = async () => {
    if (!selectedUser?.uuid || !quotaAmount) return;
    const amount = Number(quotaAmount);
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      toast.error("请输入正整数");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users/update-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_uuid: selectedUser.uuid,
          service_type: selectedServiceType,
          amount,
        }),
      });
      const result = await res.json();
      if (result.code === 0) {
        toast.success(
          `已为 ${selectedUser.email} 增加 ${SERVICE_LABELS[selectedServiceType]} ${amount} 次`
        );
        setQuotasMap((prev: Record<string, Record<ServiceType, number>>) => ({
          ...prev,
          [selectedUser.uuid!]: result.data.quotas,
        }));
        closeDialog();
      } else {
        toast.error(result.message || "修改失败");
      }
    } catch (error: any) {
      toast.error("修改失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultQuotas: Record<ServiceType, number> = {
    ps_sop: 0,
    recommendation: 0,
    cover_letter: 0,
    resume: 0,
    universal: 0,
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">All Users</h2>
          <p className="text-muted-foreground text-sm mt-1">
            共 {users.length} 个用户
          </p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UUID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>剩余次数</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                      <p>暂无用户数据</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow key={user.uuid}>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate">
                      {user.uuid}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          className="w-10 h-10 rounded-full"
                          alt=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                      )}
                    </TableCell>
                    <TableCell>
                      <QuotaSummary quotas={quotasMap[user.uuid!] || defaultQuotas} />
                    </TableCell>
                    <TableCell>
                      {moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, "password")}
                        >
                          <KeyRound className="w-3 h-3 mr-1" />
                          重置密码
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, "credits")}
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          修改次数
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 重置密码弹窗 */}
      <Dialog open={dialogType === "password"} onOpenChange={(open: boolean) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>重置用户密码</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">用户</Label>
              <p className="font-medium">{selectedUser?.email}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                placeholder="至少8位，包含字母和数字"
              />
              <p className="text-xs text-muted-foreground">
                重置后该用户的所有会话将失效，需重新登录
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog}>取消</Button>
              <Button onClick={handleResetPassword} disabled={isSubmitting || !newPassword}>
                {isSubmitting ? "重置中..." : "确认重置"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改服务次数弹窗 */}
      <Dialog open={dialogType === "credits"} onOpenChange={(open: boolean) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>修改用户服务次数</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">用户</Label>
              <p className="font-medium">{selectedUser?.email}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">当前剩余次数</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {ALL_SERVICE_TYPES.map((t: ServiceType) => {
                  const userQuotas = quotasMap[selectedUser?.uuid || ""] || defaultQuotas;
                  return (
                    <div key={t} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="text-sm text-muted-foreground">{SERVICE_LABELS[t]}</span>
                      <span className="text-sm font-bold">{userQuotas[t] || 0}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>服务类型</Label>
              <Select
                value={selectedServiceType}
                onValueChange={(v: string) => setSelectedServiceType(v as ServiceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SERVICE_TYPES.map((t: ServiceType) => (
                    <SelectItem key={t} value={t}>
                      {SERVICE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quota-amount">增加次数</Label>
              <Input
                id="quota-amount"
                type="number"
                min="1"
                step="1"
                value={quotaAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuotaAmount(e.target.value)}
                placeholder="输入正整数（如 5）"
              />
              <p className="text-xs text-muted-foreground">
                将为该用户增加指定服务类型的次数，有效期1年
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog}>取消</Button>
              <Button onClick={handleUpdateQuota} disabled={isSubmitting || !quotaAmount}>
                {isSubmitting ? "修改中..." : "确认增加"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
