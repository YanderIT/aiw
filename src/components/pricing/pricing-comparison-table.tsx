"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Gift, Percent, Tag } from "lucide-react";
import DiscountCheckoutModal from "@/components/checkout/discount-checkout-modal";
import { PricingItem } from "@/types/blocks/pricing";

interface PricingPackage {
  name: string;
  content: string;
  originalPrice: string;
  currentPrice: string;
  discount: string;
  savings: string;
  times: number;
  averagePrice?: string;
  isRecommended?: boolean;
  isNewUser?: boolean;
  pricingItem: PricingItem;
}

const pricingData: PricingPackage[] = [
  {
    name: "新人专享包",
    content: "PS/SOP×1 + 简历×1",
    originalPrice: "¥168",
    currentPrice: "¥66",
    discount: "3.9折",
    savings: "¥102",
    times: 2,
    averagePrice: "¥33/次",
    isNewUser: true,
    pricingItem: {
      title: "新人专享包",
      product_id: "newcomer-package",
      product_name: "新人专享包",
      amount: 6600,
      cn_amount: 6600,
      currency: "cny",
      credits: 2,
      interval: "one-time",
      valid_months: 3,
      price: "¥66",
      original_price: "¥168",
      label: "🎉 新人专享",
      description: "首次使用没把握？先来试试新人专享包吧！用过满意，再放心升级其他套餐，0 风险更安心。",
      features: ["PS/SOP × 1", "简历 × 1", "专业AI生成", "多次修改调整", "3个月有效期"]
    }
  },
  {
    name: "单校直通套装",
    content: "标配：PS/SOP×1 + 推荐×2 + 简历×1；赠送 PS/SOP×1",
    originalPrice: "¥345",
    currentPrice: "¥199",
    discount: "5.8折",
    savings: "¥146",
    times: 5,
    averagePrice: "¥39.8/次",
    pricingItem: {
      title: "单校直通套装",
      product_id: "single-school-package",
      product_name: "单校直通套装",
      amount: 19900,
      cn_amount: 19900,
      currency: "cny",
      credits: 5,
      interval: "one-time",
      valid_months: 6,
      price: "¥199",
      original_price: "¥345",
      description: "标配1篇PS/SOP，额外赠送1篇PS/SOP（用于应对临时更换项目）",
      features: ["PS/SOP × 1（标配）", "推荐信 × 2", "简历 × 1", "PS/SOP × 1（赠送）", "6个月有效期"]
    }
  },
  {
    name: "多校申请包",
    content: "PS/SOP×6 + 推荐×2 + 简历×2",
    originalPrice: "¥810",
    currentPrice: "¥399",
    discount: "4.9折",
    savings: "¥411",
    times: 10,
    averagePrice: "¥39.9/次",
    isRecommended: true,
    pricingItem: {
      title: "多校申请包",
      product_id: "multi-school-package",
      product_name: "多校申请包",
      amount: 39900,
      cn_amount: 39900,
      currency: "cny",
      credits: 10,
      interval: "one-time",
      valid_months: 12,
      price: "¥399",
      original_price: "¥810",
      label: "⭐ 热门推荐",
      description: "适合申请4-5所学校，含赠送1次PS生成",
      features: ["PS/SOP × 6（含赠1次）", "推荐信 × 2", "简历 × 2", "12个月有效期", "适合申请5-6所学校"]
    }
  },
  {
    name: "灵活通用包（10）",
    content: "任意内容×10",
    originalPrice: "¥990*",
    currentPrice: "¥419",
    discount: "4.2折",
    savings: "¥571",
    times: 10,
    averagePrice: "¥41.9/次",
    pricingItem: {
      title: "灵活通用包（10次）",
      product_id: "flexible-package-10",
      product_name: "灵活通用包（10次）",
      amount: 41900,
      cn_amount: 41900,
      currency: "cny",
      credits: 10,
      interval: "one-time",
      valid_months: 12,
      price: "¥419",
      original_price: "¥990",
      description: "任意内容组合，灵活使用",
      features: ["任意内容组合 × 10", "PS/SOP/推荐信/简历/Cover Letter", "灵活分配使用", "12个月有效期", "最大使用自由度"]
    }
  },
  {
    name: "全能组合包（20）",
    content: "任意内容×20",
    originalPrice: "¥1980*",
    currentPrice: "¥819",
    discount: "4.1折",
    savings: "¥1161",
    times: 20,
    averagePrice: "¥40.95/次",
    pricingItem: {
      title: "全能组合包（20次）",
      product_id: "all-in-one-package-20",
      product_name: "全能组合包（20次）",
      amount: 81900,
      cn_amount: 81900,
      currency: "cny",
      credits: 20,
      interval: "one-time",
      valid_months: 12,
      price: "¥819",
      original_price: "¥1980",
      description: "最大容量，超值优惠",
      features: ["任意内容组合 × 20", "PS/SOP/推荐信/简历/Cover Letter", "灵活分配使用", "12个月有效期", "最高性价比选择"]
    }
  }
];

interface PricingComparisonTableProps {
  className?: string;
}

export default function PricingComparisonTable({ className }: PricingComparisonTableProps) {
  return (
    <div className={`w-full py-8 ${className || ""}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Tag className="w-8 h-8 text-primary" />
            套餐价格对比
          </h2>
          <p className="text-gray-600">选择最适合您的文书生成套餐，享受超值优惠</p>
          <div className="flex items-center justify-center gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
            <Percent className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">
              所有套餐均支持折扣码，购买时输入更优惠
            </span>
          </div>
        </div>

        {/* 移动端卡片布局 */}
        <div className="block md:hidden space-y-4">
          {pricingData.map((pkg, index) => (
            <Card key={index} className={`relative overflow-visible ${pkg.isRecommended ? 'border-2 border-blue-500' : pkg.isNewUser ? 'border-2 border-green-500' : ''}`}>
              {pkg.isRecommended && (
                <Badge className="absolute -top-2.5 right-3 z-10 bg-blue-500 text-white px-2.5 py-0.5 text-xs shadow-sm">
                  <Star className="w-3 h-3 mr-1" />
                  热门推荐
                </Badge>
              )}
              {pkg.isNewUser && (
                <Badge className="absolute -top-2.5 right-3 z-10 bg-green-500 text-white px-2.5 py-0.5 text-xs shadow-sm">
                  <Gift className="w-3 h-3 mr-1" />
                  新人专享
                </Badge>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">{pkg.content}</div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">{pkg.originalPrice}</span>
                  <span className="text-2xl font-bold text-green-600">{pkg.currentPrice}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="destructive">{pkg.discount}</Badge>
                  <span className="text-green-600">省 {pkg.savings}</span>
                  <span className="text-gray-600">{pkg.times} 次</span>
                </div>
                
                {pkg.averagePrice && (
                  <div className="text-sm text-gray-600">
                    平均单价：{pkg.averagePrice}
                  </div>
                )}
                
                <DiscountCheckoutModal item={pkg.pricingItem}>
                  <Button
                    className="w-full mt-4 flex items-center justify-center gap-2"
                    variant={pkg.isRecommended ? "default" : "outline"}
                  >
                    <Percent className="w-4 h-4" />
                    立即购买
                  </Button>
                </DiscountCheckoutModal>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 桌面端表格布局 */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-semibold">名称</th>
                <th className="text-left p-4 font-semibold">内容</th>
                <th className="text-left p-4 font-semibold">等效原价</th>
                <th className="text-left p-4 font-semibold">现价</th>
                <th className="text-left p-4 font-semibold">折扣</th>
                <th className="text-left p-4 font-semibold">省</th>
                <th className="text-left p-4 font-semibold">次数</th>
                <th className="text-left p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((pkg, index) => (
                <tr
                  key={index}
                  className={`relative border-b hover:bg-gray-50 transition-all duration-200 ${
                    pkg.isRecommended ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                    pkg.isNewUser ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pkg.name}</span>
                    </div>
                    {pkg.averagePrice && (
                      <div className="text-sm text-gray-500 mt-1">
                        平均{pkg.averagePrice}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm">{pkg.content}</td>
                  <td className="p-4">
                    <span className="text-gray-500 line-through">{pkg.originalPrice}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xl font-bold text-green-600">{pkg.currentPrice}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="destructive">{pkg.discount}</Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-green-600 font-medium">{pkg.savings}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{pkg.times}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DiscountCheckoutModal item={pkg.pricingItem}>
                        <Button
                          variant={pkg.isRecommended ? "default" : "outline"}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Percent className="w-3 h-3" />
                          立即购买
                        </Button>
                      </DiscountCheckoutModal>
                      {pkg.isRecommended && (
                        <Badge className="bg-blue-500 text-white text-xs whitespace-nowrap">
                          <Star className="w-3 h-3 mr-0.5" />
                          推荐
                        </Badge>
                      )}
                      {pkg.isNewUser && (
                        <Badge className="bg-green-500 text-white text-xs whitespace-nowrap">
                          <Gift className="w-3 h-3 mr-0.5" />
                          新人
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        {/* 说明文字 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* 灵活通用包和全能组合包的原价按最贵的PS/SOP计算</p>
          <p>所有套餐均支持多次修改调整，确保满意为止</p>
          <p className="mt-2 text-xs text-gray-400">购买后如遇系统生成异常，可联系小助手，我们会及时协助处理并补发相应次数，请放心使用。</p>
        </div>
      </div>
    </div>
  );
}