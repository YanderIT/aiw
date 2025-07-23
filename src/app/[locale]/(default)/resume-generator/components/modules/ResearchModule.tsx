"use client";

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
  if (researchProjects.length === 0) {
    addResearch();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xl">
            请填写您的科研经历，包括项目信息、研究内容、贡献和成果等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加科研项目
        </Button>
      </div>
      
      <div className="space-y-8">
        {researchProjects.map((project, index) => (
          <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                科研项目 {index + 1}
              </h3>
              {researchProjects.length > 1 && (
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
              {/* 项目名称和研究单位 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`project_title-${index}`} className="text-base font-medium text-gray-700">
                    项目名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`project_title-${index}`}
                    type="text"
                    placeholder="例如：基于机器学习的图像识别系统研究"
                    value={project.project_title}
                    onChange={(e) => handleInputChange(index, "project_title", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`lab_or_unit-${index}`} className="text-base font-medium text-gray-700">
                    研究单位 / 实验室（可选）
                  </Label>
                  <Input
                    id={`lab_or_unit-${index}`}
                    type="text"
                    placeholder="例如：人工智能实验室"
                    value={project.lab_or_unit}
                    onChange={(e) => handleInputChange(index, "lab_or_unit", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
              </div>

              {/* 研究时间 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`res_start_date-${index}`} className="text-base font-medium text-gray-700">
                    开始时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`res_start_date-${index}`}
                    value={project.res_start_date}
                    onChange={(value) => handleInputChange(index, "res_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`res_end_date-${index}`} className="text-base font-medium text-gray-700">
                    结束时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`res_end_date-${index}`}
                    value={project.res_end_date}
                    onChange={(value) => handleInputChange(index, "res_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-base text-gray-500">如果项目仍在进行中，请填写预计结束时间</p>
                </div>
              </div>

              {/* 研究背景 */}
              <div className="space-y-3">
                <Label htmlFor={`project_background-${index}`} className="text-base font-medium text-gray-700">
                  研究目标 / 背景简介 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`project_background-${index}`}
                  placeholder="请描述研究项目的背景、目标和意义，例如：
该项目旨在开发一套基于深度学习的图像识别系统，以提高医学影像诊断的准确性和效率。项目背景是当前医学影像诊断存在人工判读耗时长、主观性强等问题，希望通过AI技术辅助医生进行更精确的诊断。"
                  value={project.project_background}
                  onChange={(e) => handleInputChange(index, "project_background", e.target.value)}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[120px] resize-none text-lg"
                  rows={5}
                />
                <p className="text-base text-gray-500">请详细描述研究项目的背景、目标和研究意义</p>
              </div>

              {/* 个人贡献 */}
              <div className="space-y-3">
                <Label htmlFor={`your_contributions-${index}`} className="text-base font-medium text-gray-700">
                  你做了什么 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`your_contributions-${index}`}
                  placeholder="请用英文描述您在项目中的具体贡献，每行一个要点，例如：
• Designed and implemented a convolutional neural network architecture for medical image classification
• Collected and preprocessed over 10,000 medical images from multiple hospitals for training dataset
• Optimized model performance achieving 95% accuracy in disease detection compared to 85% baseline
• Collaborated with medical professionals to validate algorithm results and refine diagnostic criteria"
                  value={project.your_contributions}
                  onChange={(e) => handleInputChange(index, "your_contributions", e.target.value)}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[150px] resize-none text-lg"
                  rows={6}
                />
                <p className="text-base text-gray-500">请用英文填写 3-4 条您在项目中的具体贡献，每条以动词开头，用 • 符号分隔</p>
              </div>

              {/* 工具和成果 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`tools_used-${index}`} className="text-base font-medium text-gray-700">
                    用到的方法 / 工具（可选）
                  </Label>
                  <Input
                    id={`tools_used-${index}`}
                    type="text"
                    placeholder="例如：Python, TensorFlow, OpenCV, MATLAB"
                    value={project.tools_used}
                    onChange={(e) => handleInputChange(index, "tools_used", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                  <p className="text-base text-gray-500">请列出使用的编程语言、软件工具或研究方法</p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`outcomes-${index}`} className="text-base font-medium text-gray-700">
                    成果（可选）
                  </Label>
                  <Input
                    id={`outcomes-${index}`}
                    type="text"
                    placeholder="例如：发表论文1篇，申请专利1项，技术报告1份"
                    value={project.outcomes}
                    onChange={(e) => handleInputChange(index, "outcomes", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                  <p className="text-base text-gray-500">请列出研究成果，如论文、专利、报告等</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 