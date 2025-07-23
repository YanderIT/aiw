"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YearPicker } from "@/components/ui/year-picker";
// import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useResume, AwardsData } from "../ResumeContext";

export default function AwardsModule() {
  const { data, updateAwardsData, addAward, removeAward } = useResume();
  const awards = data.awards;

  const handleInputChange = (index: number, field: keyof AwardsData, value: string) => {
    updateAwardsData(index, { [field]: value });
  };

  const handleAdd = () => {
    addAward();
  };

  const handleRemove = (index: number) => {
    if (awards.length > 1) {
      removeAward(index);
    }
  };

  // 确保至少有一个奖项条目
  if (awards.length === 0) {
    addAward();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xl">
            请填写您获得的奖项、荣誉、证书等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加奖项
        </Button>
      </div>
      
      <div className="space-y-8">
        {awards.map((award, index) => (
          <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                获奖情况 {index + 1}
              </h3>
              {awards.length > 1 && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 px-4"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className="space-y-8">
              {/* 奖项基本信息 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`award_name-${index}`} className="text-base font-medium text-gray-700">
                    奖项名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`award_name-${index}`}
                    type="text"
                    placeholder="例如：国家奖学金、优秀学生干部"
                    value={award.award_name}
                    onChange={(e) => handleInputChange(index, "award_name", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`award_year-${index}`} className="text-base font-medium text-gray-700">
                    获奖年份 <span className="text-red-500">*</span>
                  </Label>
                  <YearPicker
                    id={`award_year-${index}`}
                    value={award.award_year}
                    onChange={(value) => handleInputChange(index, "award_year", value)}
                    placeholder="选择获奖年份"
                  />
                </div>
              </div>

              {/* 授予机构和获奖比例 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`award_issuer-${index}`} className="text-base font-medium text-gray-700">
                    授予机构（可选）
                  </Label>
                  <Input
                    id={`award_issuer-${index}`}
                    type="text"
                    placeholder="例如：教育部、清华大学"
                    value={award.award_issuer}
                    onChange={(e) => handleInputChange(index, "award_issuer", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`award_rank-${index}`} className="text-base font-medium text-gray-700">
                    获奖比例（可选）
                  </Label>
                  <Input
                    id={`award_rank-${index}`}
                    type="text"
                    placeholder="例如：Top 5%、前10名"
                    value={award.award_rank}
                    onChange={(e) => handleInputChange(index, "award_rank", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                  <p className="text-base text-gray-500">如知道具体排名或比例，请填写</p>
                </div>
              </div>

              {/* 证书信息 */}
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">证书信息（如有）</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor={`certificate_name-${index}`} className="text-base font-medium text-gray-700">
                      证书名称（可选）
                    </Label>
                    <Input
                      id={`certificate_name-${index}`}
                      type="text"
                      placeholder="例如：英语四级证书、计算机二级证书"
                      value={award.certificate_name}
                      onChange={(e) => handleInputChange(index, "certificate_name", e.target.value)}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor={`certificate_issuer-${index}`} className="text-base font-medium text-gray-700">
                      发证单位（可选）
                    </Label>
                    <Input
                      id={`certificate_issuer-${index}`}
                      type="text"
                      placeholder="例如：教育部考试中心、工信部"
                      value={award.certificate_issuer}
                      onChange={(e) => handleInputChange(index, "certificate_issuer", e.target.value)}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 帮助信息 */}
      <div className="bg-amber-50 rounded-xl p-6">
        <h4 className="font-semibold text-amber-800 mb-2">📌 填写建议</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 奖项请按重要程度排序，优先填写含金量高的奖项</li>
          <li>• 获奖比例能体现奖项含金量，如"Top 5%"比"三等奖"更具体</li>
          <li>• 证书信息可包括专业资格证书、语言证书等</li>
          <li>• 如有多个奖项，建议分别创建多个条目</li>
        </ul>
      </div>
    </div>
  );
} 