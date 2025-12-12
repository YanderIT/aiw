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
import { useResume, WorkExperienceData } from "../ResumeContext";
import { useResumeAI } from "@/hooks/useResumeAI";

export default function WorkExperienceModule() {
  const { data, updateWorkExperienceData, addWorkExperience, removeWorkExperience, isEditMode } = useResume();
  const workExperiences = data.workExperience;
  const { generateContent, isGenerating } = useResumeAI();
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const handleInputChange = (index: number, field: keyof WorkExperienceData, value: string) => {
    updateWorkExperienceData(index, { [field]: value });
  };

  const handleAdd = () => {
    addWorkExperience();
  };

  const handleRemove = (index: number) => {
    if (workExperiences.length > 1) {
      removeWorkExperience(index);
    }
  };

  // 确保至少有一个工作经历条目
  useEffect(() => {
    if (workExperiences.length === 0) {
      addWorkExperience();
    }
  }, [workExperiences.length, addWorkExperience]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground text-xs">
            请填写您的工作经历，包括公司信息、职位、工作内容等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-8 px-3 text-xs w-fit"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          添加工作经历
        </Button>
      </div>
      
      <div className="space-y-4">
        {workExperiences.map((experience, index) => (
          <div key={index} className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                工作经历 {index + 1}
              </h3>
              {workExperiences.length > 1 && (
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
              {/* 公司和职位信息 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${index}`} className="text-xs font-medium text-foreground">
                    公司名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`company-${index}`}
                    type="text"
                    placeholder="例如：腾讯科技有限公司"
                    value={experience.company}
                    onChange={(e) => handleInputChange(index, "company", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`job_title-${index}`} className="text-xs font-medium text-foreground">
                    职位名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`job_title-${index}`}
                    type="text"
                    placeholder="例如：软件工程师"
                    value={experience.job_title}
                    onChange={(e) => handleInputChange(index, "job_title", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
              </div>

              {/* 工作地点信息 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`work_city-${index}`} className="text-xs font-medium text-foreground">
                    城市 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`work_city-${index}`}
                    type="text"
                    placeholder="例如：深圳"
                    value={experience.work_city}
                    onChange={(e) => handleInputChange(index, "work_city", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`work_country-${index}`} className="text-xs font-medium text-foreground">
                    国家 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`work_country-${index}`}
                    type="text"
                    placeholder="例如：中国"
                    value={experience.work_country}
                    onChange={(e) => handleInputChange(index, "work_country", e.target.value)}
                    className="h-10 text-xs bg-white dark:bg-white"
                  />
                </div>
              </div>

              {/* 工作时间 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`work_start_date-${index}`} className="text-xs font-medium text-foreground">
                    起始时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`work_start_date-${index}`}
                    value={experience.work_start_date}
                    onChange={(value) => handleInputChange(index, "work_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`work_end_date-${index}`} className="text-xs font-medium text-foreground">
                    结束时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`work_end_date-${index}`}
                    value={experience.work_end_date}
                    onChange={(value) => handleInputChange(index, "work_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-[10px] text-muted-foreground">如果仍在职，请填写预计离职时间或当前日期</p>
                </div>
              </div>

              {/* 工作职责 */}
              <div className="space-y-2">
                <Label htmlFor={`responsibilities-${index}`} className="text-xs font-medium text-foreground">
                  具体职责 <span className="text-destructive">*</span>
                </Label>
                {isEditMode ? (
                  <Textarea
                    id={`responsibilities-${index}`}
                    placeholder="请用英文描述您的工作职责，每行一个要点"
                    value={experience.responsibilities}
                    onChange={(e) => handleInputChange(index, "responsibilities", e.target.value)}
                    className="min-h-[100px] resize-none text-xs bg-white dark:bg-white"
                    rows={4}
                  />
                ) : (
                  <AITextarea
                    id={`responsibilities-${index}`}
                    placeholder="请描述您的工作职责，每行一个要点"
                    value={experience.responsibilities}
                    onChange={(e) => handleInputChange(index, "responsibilities", e.target.value)}
                    className="min-h-[100px] resize-none text-xs bg-white dark:bg-white"
                    showLanguageHint
                    rows={4}
                    aiGenerating={isGenerating && generatingIndex === index}
                    onAIGenerate={async () => {
                      // Type 2: Work Experience - Responsibilities
                      setGeneratingIndex(index);
                      const context = { workExperience: [experience] };
                      const generatedContent = await generateContent(context, 2);
                      if (generatedContent) {
                        handleInputChange(index, "responsibilities", generatedContent);
                      }
                      setGeneratingIndex(null);
                    }}
                    contextHint={`${experience.company} ${experience.job_title}`}
                  />
                )}
                <p className="text-[10px] text-muted-foreground">tips: 请用英文填写 3-4 条工作职责，每条以动词开头，用 • 符号开头，结束回车换行</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 