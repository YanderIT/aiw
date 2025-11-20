"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (awards.length === 0) {
      addAward();
    }
  }, [awards.length, addAward]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground text-xs">
            请填写您获得的奖项、荣誉、证书等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-8 px-3 text-xs w-fit"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          添加奖项
        </Button>
      </div>
      
      <div className="space-y-4">
        {awards.map((award, index) => (
          <div key={index} className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                获奖情况 {index + 1}
              </h3>
              {awards.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* 奖项基本信息 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`award_name-${index}`} className="text-xs font-medium text-foreground">
                    奖项名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`award_name-${index}`}
                    type="text"
                    placeholder="例如：国家奖学金、优秀学生干部"
                    value={award.award_name}
                    onChange={(e) => handleInputChange(index, "award_name", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`award_year-${index}`} className="text-xs font-medium text-foreground">
                    获奖年份 <span className="text-destructive">*</span>
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`award_issuer-${index}`} className="text-xs font-medium text-foreground">
                    授予机构（可选）
                  </Label>
                  <Input
                    id={`award_issuer-${index}`}
                    type="text"
                    placeholder="例如：教育部、清华大学"
                    value={award.award_issuer}
                    onChange={(e) => handleInputChange(index, "award_issuer", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`award_rank-${index}`} className="text-xs font-medium text-foreground">
                    获奖比例（可选）
                  </Label>
                  <Input
                    id={`award_rank-${index}`}
                    type="text"
                    placeholder="例如：Top 5%、前10名"
                    value={award.award_rank}
                    onChange={(e) => handleInputChange(index, "award_rank", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                  <p className="text-[10px] text-muted-foreground">如知道具体排名或比例，请填写</p>
                </div>
              </div>

              {/* 证书信息 */}
              <div className="space-y-3">
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3">证书信息（如有）</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`certificate_name-${index}`} className="text-xs font-medium text-foreground">
                      证书名称（可选）
                    </Label>
                    <Input
                      id={`certificate_name-${index}`}
                      type="text"
                      placeholder="例如：英语四级证书、计算机二级证书"
                      value={award.certificate_name}
                      onChange={(e) => handleInputChange(index, "certificate_name", e.target.value)}
                      className="h-10 text-xs bg-white dark:bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`certificate_issuer-${index}`} className="text-xs font-medium text-foreground">
                      发证单位（可选）
                    </Label>
                    <Input
                      id={`certificate_issuer-${index}`}
                      type="text"
                      placeholder="例如：教育部考试中心、工信部"
                      value={award.certificate_issuer}
                      onChange={(e) => handleInputChange(index, "certificate_issuer", e.target.value)}
                      className="h-10 text-xs bg-white dark:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 帮助信息 */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-xs mb-2">📌 填写建议</h4>
        <ul className="text-[10px] text-amber-700 dark:text-amber-300 space-y-1">
          <li>• 奖项请按重要程度排序，优先填写含金量高的奖项</li>
          <li>• 获奖比例能体现奖项含金量，如"Top 5%"比"三等奖"更具体</li>
          <li>• 证书信息可包括专业资格证书、语言证书等</li>
          <li>• 如有多个奖项，建议分别创建多个条目</li>
        </ul>
      </div>
    </div>
  );
} 