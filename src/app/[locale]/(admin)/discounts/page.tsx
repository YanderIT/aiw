import { Metadata } from "next";
import DiscountManagement from "./components/discount-management";

export const metadata: Metadata = {
  title: "折扣码管理 - 管理后台",
  description: "管理折扣码、查看使用统计和创建新的优惠活动",
};

export default async function DiscountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">折扣码管理</h1>
          <p className="text-muted-foreground mt-2">
            创建和管理折扣码，查看使用统计
          </p>
        </div>
      </div>

      <DiscountManagement />
    </div>
  );
}