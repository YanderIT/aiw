"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Gift, History, TrendingDown, Percent, Plus } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";

interface DiscountUsage {
  id: number;
  discount_code_id: number;
  discount_amount: number;
  bonus_credits: number;
  used_at: string;
  order_no: string;
  discount_code: {
    code: string;
    name: string;
    type: string;
  };
}

interface DiscountStats {
  totalSavings: number;
  totalUsage: number;
  bonusCreditsEarned: number;
}

export default function DiscountHistory() {
  const [discountUsages, setDiscountUsages] = useState<DiscountUsage[]>([]);
  const [stats, setStats] = useState<DiscountStats>({
    totalSavings: 0,
    totalUsage: 0,
    bonusCreditsEarned: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [testCode, setTestCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadDiscountHistory();
  }, []);

  const loadDiscountHistory = async () => {
    try {
      const response = await fetch("/api/user/discount-history");
      const result = await response.json();

      if (result.code === 0) {
        setDiscountUsages(result.data.usages);
        setStats(result.data.stats);
      } else {
        toast.error("加载折扣记录失败");
      }
    } catch (error) {
      console.error("加载折扣记录失败:", error);
      toast.error("加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  const validateDiscountCode = async () => {
    if (!testCode.trim()) {
      toast.error("请输入折扣码");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("/api/discount/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: testCode.trim(),
          product_id: "newcomer-package", // Use newcomer package as test product
          amount: 6600, // Test amount
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        const { discount_amount, bonus_credits } = result.data;
        toast.success(`折扣码有效！${discount_amount > 0 ? `立减¥${(discount_amount / 100).toFixed(2)}` : ""}${bonus_credits > 0 ? ` + 赠送${bonus_credits}次生成` : ""}`);
      } else {
        toast.error(result.message || "折扣码无效");
      }
    } catch (error) {
      console.error("验证折扣码失败:", error);
      toast.error("验证失败");
    } finally {
      setIsValidating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">累计节省</p>
                <p className="text-2xl font-bold text-green-600">¥{stats.totalSavings}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">使用次数</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <History className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">获得积分</p>
                <p className="text-2xl font-bold">{stats.bonusCreditsEarned}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discount Code Validator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            验证折扣码
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="输入折扣码进行验证"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && validateDiscountCode()}
            />
            <Button
              onClick={validateDiscountCode}
              disabled={isValidating || !testCode.trim()}
              size="sm"
            >
              {isValidating ? "验证中..." : "验证"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            输入任意折扣码检查是否可用和具体优惠内容
          </p>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            使用记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          {discountUsages.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>折扣码</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>节省金额</TableHead>
                    <TableHead>赠送积分</TableHead>
                    <TableHead>订单号</TableHead>
                    <TableHead>使用时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountUsages.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {usage.discount_code.code}
                        </code>
                      </TableCell>
                      <TableCell>{usage.discount_code.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {usage.discount_code.type === "percentage" ? "百分比" :
                           usage.discount_code.type === "fixed_amount" ? "固定金额" : "赠送积分"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {usage.discount_amount > 0 ? (
                          <span className="text-green-600 font-medium">
                            -¥{(usage.discount_amount / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {usage.bonus_credits > 0 ? (
                          <span className="text-purple-600 font-medium">
                            +{usage.bonus_credits}次
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {usage.order_no}
                        </code>
                      </TableCell>
                      <TableCell>
                        {format(new Date(usage.used_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="mx-auto h-12 w-12 opacity-50 mb-4" />
              <p>暂无折扣码使用记录</p>
              <p className="text-sm">购买时使用折扣码后，记录会显示在这里</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            折扣码使用小贴士
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 每个折扣码都有使用限制，请及时使用</p>
            <p>• 部分折扣码仅适用于特定套餐</p>
            <p>• 折扣码使用后会立即生效，无法撤销</p>
            <p>• 关注我们的社交媒体获取最新折扣码</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}