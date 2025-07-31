"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
// import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useResume, ResearchData } from "../ResumeContext";

export default function ResearchModule() {
  const { data, updateResearchData, addResearch, removeResearch } = useResume();
  const researchProjects = data.research;

  const handleInputChange = (index: number, field: keyof ResearchData, value: string) => {
    updateResearchData(index, { [field]: value });
  };

  const handleAdd = () => {
    addResearch();
  };

  const handleRemove = (index: number) => {
    if (researchProjects.length > 1) {
      removeResearch(index);
    }
  };

  // 确保至少有一个科研项目条目
  useEffect(() => {
    if (researchProjects.length === 0) {
      addResearch();
    }
  }, [researchProjects.length, addResearch]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground text-xs">
            请填写您的科研经历，包括项目信息、研究内容、贡献和成果等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-8 px-3 text-xs w-fit"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          添加科研项目
        </Button>
      </div>
      
      <div className="space-y-4">
        {researchProjects.map((project, index) => (
          <div key={index} className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                科研项目 {index + 1}
              </h3>
              {researchProjects.length > 1 && (
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
              {/* 项目名称和研究单位 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project_title-${index}`} className="text-xs font-medium text-foreground">
                    项目名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`project_title-${index}`}
                    type="text"
                    placeholder="例如：基于机器学习的图像识别系统研究"
                    value={project.project_title}
                    onChange={(e) => handleInputChange(index, "project_title", e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`lab_or_unit-${index}`} className="text-xs font-medium text-foreground">
                    研究单位 / 实验室（可选）
                  </Label>
                  <Input
                    id={`lab_or_unit-${index}`}
                    type="text"
                    placeholder="例如：人工智能实验室"
                    value={project.lab_or_unit}
                    onChange={(e) => handleInputChange(index, "lab_or_unit", e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* 研究时间 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`res_start_date-${index}`} className="text-xs font-medium text-foreground">
                    开始时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`res_start_date-${index}`}
                    value={project.res_start_date}
                    onChange={(value) => handleInputChange(index, "res_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`res_end_date-${index}`} className="text-xs font-medium text-foreground">
                    结束时间 <span className="text-destructive">*</span>
                  </Label>
                  <DatePicker
                    id={`res_end_date-${index}`}
                    value={project.res_end_date}
                    onChange={(value) => handleInputChange(index, "res_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-[10px] text-muted-foreground">如果项目仍在进行中，请填写预计结束时间</p>
                </div>
              </div>

              {/* 研究背景 */}
              <div className="space-y-2">
                <Label htmlFor={`project_background-${index}`} className="text-xs font-medium text-foreground">
                  研究目标 / 背景简介 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`project_background-${index}`}
                  placeholder="请描述研究项目的背景、目标和意义"
                  value={project.project_background}
                  onChange={(e) => handleInputChange(index, "project_background", e.target.value)}
                  className="min-h-[80px] resize-none text-xs"
                  rows={3}
                />
                <p className="text-[10px] text-muted-foreground">请详细描述研究项目的背景、目标和研究意义</p>
              </div>

              {/* 个人贡献 */}
              <div className="space-y-2">
                <Label htmlFor={`your_contributions-${index}`} className="text-xs font-medium text-foreground">
                  你做了什么 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`your_contributions-${index}`}
                  placeholder="请用英文描述您在项目中的具体贡献"
                  value={project.your_contributions}
                  onChange={(e) => handleInputChange(index, "your_contributions", e.target.value)}
                  className="min-h-[100px] resize-none text-xs"
                  rows={4}
                />
                <p className="text-[10px] text-muted-foreground">请用英文填写 3-4 条您在项目中的具体贡献，每条以动词开头，用 • 符号分隔</p>
              </div>

              {/* 工具和成果 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tools_used-${index}`} className="text-xs font-medium text-foreground">
                    用到的方法 / 工具（可选）
                  </Label>
                  <Input
                    id={`tools_used-${index}`}
                    type="text"
                    placeholder="例如：Python, TensorFlow, OpenCV, MATLAB"
                    value={project.tools_used}
                    onChange={(e) => handleInputChange(index, "tools_used", e.target.value)}
                    className="h-10 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">请列出使用的编程语言、软件工具或研究方法</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`outcomes-${index}`} className="text-xs font-medium text-foreground">
                    成果（可选）
                  </Label>
                  <Input
                    id={`outcomes-${index}`}
                    type="text"
                    placeholder="例如：发表论文1篇，申请专利1项"
                    value={project.outcomes}
                    onChange={(e) => handleInputChange(index, "outcomes", e.target.value)}
                    className="h-10 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">请列出研究成果，如论文、专利、报告等</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 