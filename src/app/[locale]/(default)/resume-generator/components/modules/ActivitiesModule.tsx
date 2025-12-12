"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AITextarea } from "@/components/ui/ai-textarea";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
// import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useResume, ActivitiesData } from "../ResumeContext";
import { useResumeAI } from "@/hooks/useResumeAI";

export default function ActivitiesModule() {
  const { data, updateActivitiesData, addActivity, removeActivity, isEditMode } = useResume();
  const activities = data.activities;
  const { generateContent, isGenerating } = useResumeAI();
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const handleInputChange = (index: number, field: keyof ActivitiesData, value: string) => {
    updateActivitiesData(index, { [field]: value });
  };

  const handleAdd = () => {
    addActivity();
  };

  const handleRemove = (index: number) => {
    if (activities.length > 1) {
      removeActivity(index);
    }
  };

  // 确保至少有一个活动条目
  useEffect(() => {
    if (activities.length === 0) {
      addActivity();
    }
  }, [activities.length, addActivity]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground text-xs">
            请填写您的课外活动、社团参与、志愿者经历等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-8 px-3 text-xs w-fit"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          添加活动经历
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                活动经历 {index + 1}
              </h3>
              {activities.length > 1 && (
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
              {/* 活动名称和角色 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`activity_name-${index}`} className="text-xs font-medium text-foreground">
                    活动名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`activity_name-${index}`}
                    type="text"
                    placeholder="例如：学生会主席团、环保志愿者协会"
                    value={activity.activity_name}
                    onChange={(e) => handleInputChange(index, "activity_name", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`role-${index}`} className="text-xs font-medium text-foreground">
                    你的身份 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`role-${index}`}
                    type="text"
                    placeholder="例如：负责人、志愿者、团队成员"
                    value={activity.role}
                    onChange={(e) => handleInputChange(index, "role", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
              </div>

              {/* 活动地点 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`act_city-${index}`} className="text-xs font-medium text-foreground">
                    城市 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`act_city-${index}`}
                    type="text"
                    placeholder="例如：上海"
                    value={activity.act_city}
                    onChange={(e) => handleInputChange(index, "act_city", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`act_country-${index}`} className="text-xs font-medium text-foreground">
                    国家 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`act_country-${index}`}
                    type="text"
                    placeholder="例如：中国"
                    value={activity.act_country}
                    onChange={(e) => handleInputChange(index, "act_country", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
              </div>

              {/* 活动时间 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`act_start_date-${index}`} className="text-xs font-medium text-foreground">
                    起始时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`act_start_date-${index}`}
                    value={activity.act_start_date}
                    onChange={(value) => handleInputChange(index, "act_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`act_end_date-${index}`} className="text-xs font-medium text-foreground">
                    结束时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`act_end_date-${index}`}
                    value={activity.act_end_date}
                    onChange={(value) => handleInputChange(index, "act_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-[10px] text-muted-foreground">如果活动仍在进行中，请填写预计结束时间</p>
                </div>
              </div>

              {/* 活动描述 */}
              <div className="space-y-2">
                <Label htmlFor={`description-${index}`} className="text-xs font-medium text-foreground">
                  你做了什么 <span className="text-destructive">*</span>
                </Label>
                {isEditMode ? (
                  <Textarea
                    id={`description-${index}`}
                    placeholder="请用英文描述您在活动中的具体工作和贡献"
                    value={activity.description}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    className="min-h-[100px] resize-none text-xs bg-white dark:bg-white"
                    rows={4}
                  />
                ) : (
                  <AITextarea
                    id={`description-${index}`}
                    placeholder="请描述您在活动中的具体工作和贡献"
                    value={activity.description}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    className="min-h-[100px] resize-none text-xs bg-white dark:bg-white"
                    rows={4}
                    aiGenerating={isGenerating && generatingIndex === index}
                    showLanguageHint
                    onAIGenerate={async () => {
                      // Type 3: Activities - Description
                      setGeneratingIndex(index);
                      const context = { activities: [activity] };
                      const generatedContent = await generateContent(context, 3);
                      if (generatedContent) {
                        handleInputChange(index, "description", generatedContent);
                      }
                      setGeneratingIndex(null);
                    }}
                    contextHint={`${activity.activity_name} ${activity.role}`}
                  />
                )}
                <p className="text-[10px] text-muted-foreground">请用英文填写 3-4 条您在活动中的具体工作和贡献，每条以动词开头，用 • 符号分隔</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 