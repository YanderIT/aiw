"use client";

import { useState, useEffect } from "react";
import { DiscountCode } from "@/types/discount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit2, Trash2, Copy, BarChart3, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";

interface DiscountStats {
  totalCodes: number;
  activeCodes: number;
  totalUsage: number;
  totalSavings: number;
}

export default function DiscountManagement() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [stats, setStats] = useState<DiscountStats>({
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    totalSavings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage" as "percentage" | "fixed_amount" | "bonus_credits",
    value: "",
    minAmount: "",
    maxUses: "",
    userLimit: "1",
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    productIds: "",
    isActive: true,
  });

  useEffect(() => {
    loadDiscountCodes();
    loadStats();
  }, []);

  const loadDiscountCodes = async () => {
    try {
      const response = await fetch("/api/admin/discounts");
      const result = await response.json();

      if (result.code === 0) {
        setDiscountCodes(result.data);
      } else {
        toast.error("加载折扣码失败");
      }
    } catch (error) {
      console.error("加载折扣码失败:", error);
      toast.error("加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/discounts/stats");
      const result = await response.json();

      if (result.code === 0) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("加载统计数据失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        minAmount: formData.minAmount ? parseInt(formData.minAmount) * 100 : null, // Convert to cents
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        userLimit: formData.userLimit ? parseInt(formData.userLimit) : null,
        productIds: formData.productIds ? JSON.stringify(formData.productIds.split(',').map(id => id.trim())) : null,
      };

      const url = editingCode ? `/api/admin/discounts/${editingCode.id}` : "/api/admin/discounts";
      const method = editingCode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.code === 0) {
        toast.success(editingCode ? "折扣码更新成功" : "折扣码创建成功");
        setIsDialogOpen(false);
        resetForm();
        loadDiscountCodes();
        loadStats();
      } else {
        toast.error(result.message || "操作失败");
      }
    } catch (error) {
      console.error("提交失败:", error);
      toast.error("操作失败");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: "",
      minAmount: "",
      maxUses: "",
      userLimit: "1",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      productIds: "",
      isActive: true,
    });
    setEditingCode(null);
  };

  const handleEdit = (discountCode: DiscountCode) => {
    setEditingCode(discountCode);
    setFormData({
      code: discountCode.code,
      name: discountCode.name,
      description: discountCode.description || "",
      type: discountCode.type,
      value: discountCode.value.toString(),
      minAmount: discountCode.min_amount ? (discountCode.min_amount / 100).toString() : "",
      maxUses: discountCode.max_uses?.toString() || "",
      userLimit: discountCode.user_limit?.toString() || "",
      validFrom: new Date(discountCode.valid_from),
      validUntil: new Date(discountCode.valid_until),
      productIds: discountCode.product_ids ? JSON.parse(discountCode.product_ids).join(', ') : "",
      isActive: discountCode.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      const result = await response.json();

      if (result.code === 0) {
        toast.success(isActive ? "折扣码已禁用" : "折扣码已启用");
        loadDiscountCodes();
        loadStats();
      } else {
        toast.error("操作失败");
      }
    } catch (error) {
      console.error("切换状态失败:", error);
      toast.error("操作失败");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已复制到剪贴板");
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总折扣码</p>
                <p className="text-2xl font-bold">{stats.totalCodes}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃折扣码</p>
                <p className="text-2xl font-bold">{stats.activeCodes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总使用次数</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总节省金额</p>
                <p className="text-2xl font-bold">¥{stats.totalSavings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            创建折扣码
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? "编辑折扣码" : "创建新折扣码"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">折扣码*</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">名称*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="新用户欢迎折扣"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="折扣码的详细描述..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">折扣类型*</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">百分比折扣</SelectItem>
                    <SelectItem value="fixed_amount">固定金额折扣</SelectItem>
                    <SelectItem value="bonus_credits">赠送积分</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">
                  {formData.type === "percentage" ? "折扣百分比*" :
                   formData.type === "fixed_amount" ? "折扣金额*（元）" : "赠送积分数*"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === "percentage" ? "20" : formData.type === "fixed_amount" ? "50" : "10"}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">最低消费金额（元）</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  placeholder="200"
                />
              </div>

              <div>
                <Label htmlFor="maxUses">最大使用次数</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>生效日期*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.validFrom, "PPP", { locale: zhCN })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validFrom}
                      onSelect={(date) => date && setFormData({ ...formData, validFrom: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>过期日期*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.validUntil, "PPP", { locale: zhCN })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validUntil}
                      onSelect={(date) => date && setFormData({ ...formData, validUntil: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userLimit">每用户使用限制</Label>
                <Input
                  id="userLimit"
                  type="number"
                  value={formData.userLimit}
                  onChange={(e) => setFormData({ ...formData, userLimit: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>启用折扣码</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="productIds">适用产品ID（逗号分隔，留空表示全部产品）</Label>
              <Input
                id="productIds"
                value={formData.productIds}
                onChange={(e) => setFormData({ ...formData, productIds: e.target.value })}
                placeholder="newcomer-package, multi-school-package"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "保存中..." : editingCode ? "更新" : "创建"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Discount Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>折扣码列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>折扣码</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>折扣值</TableHead>
                  <TableHead>使用情况</TableHead>
                  <TableHead>有效期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{code.code}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(code.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{code.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {code.type === "percentage" ? "百分比" :
                         code.type === "fixed_amount" ? "固定金额" : "赠送积分"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {code.type === "percentage" ? `${code.value}%` :
                       code.type === "fixed_amount" ? `¥${code.value}` : `${code.value}次`}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{code.used_count}/{code.max_uses || "∞"}</div>
                        {code.max_uses && (
                          <div className="text-xs text-muted-foreground">
                            {((code.used_count / code.max_uses) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{format(new Date(code.valid_from), "MM/dd", { locale: zhCN })}</div>
                      <div className="text-muted-foreground">
                        至 {format(new Date(code.valid_until), "MM/dd", { locale: zhCN })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={code.is_active}
                        onCheckedChange={() => handleToggleActive(code.id, code.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(code)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {discountCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              暂无折扣码，点击上方按钮创建第一个折扣码
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}