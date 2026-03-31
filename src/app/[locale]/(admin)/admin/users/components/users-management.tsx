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

export default function UsersManagement({
  users,
  userCreditsMap,
}: {
  users: User[];
  userCreditsMap: Record<string, number>;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [newPassword, setNewPassword] = useState("");
  const [creditsChange, setCreditsChange] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditsMap, setCreditsMap] = useState<Record<string, number>>(userCreditsMap);

  const openDialog = (user: User, type: DialogType) => {
    setSelectedUser(user);
    setDialogType(type);
    setNewPassword("");
    setCreditsChange("");
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

  const handleUpdateCredits = async () => {
    if (!selectedUser?.uuid || !creditsChange) return;
    const change = Number(creditsChange);
    if (isNaN(change) || change === 0) {
      toast.error("请输入有效的积分数量（正数增加，负数减少）");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users/update-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_uuid: selectedUser.uuid,
          credits_change: change,
        }),
      });
      const result = await res.json();
      if (result.code === 0) {
        toast.success(
          `已${change > 0 ? "增加" : "减少"} ${selectedUser.email} ${Math.abs(change)} 次积分，当前剩余 ${result.data.left_credits} 次`
        );
        setCreditsMap((prev: Record<string, number>) => ({
          ...prev,
          [selectedUser.uuid!]: result.data.left_credits,
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
                      <span className="font-semibold">
                        {creditsMap[user.uuid!] ?? 0}
                      </span>
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

      {/* 修改积分弹窗 */}
      <Dialog open={dialogType === "credits"} onOpenChange={(open: boolean) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>修改用户剩余次数</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">用户</Label>
              <p className="font-medium">{selectedUser?.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">当前剩余次数</Label>
              <p className="text-2xl font-bold">{creditsMap[selectedUser?.uuid || ""] ?? 0}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits-change">增减数量</Label>
              <Input
                id="credits-change"
                type="number"
                value={creditsChange}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreditsChange(e.target.value)}
                placeholder="正数增加，负数减少（如 5 或 -2）"
              />
              <p className="text-xs text-muted-foreground">
                输入正数增加次数，负数减少次数，有效期1年
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog}>取消</Button>
              <Button onClick={handleUpdateCredits} disabled={isSubmitting || !creditsChange}>
                {isSubmitting ? "修改中..." : "确认修改"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
