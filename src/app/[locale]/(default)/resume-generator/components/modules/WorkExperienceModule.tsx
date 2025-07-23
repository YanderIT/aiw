"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
// import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useResume, WorkExperienceData } from "../ResumeContext";

export default function WorkExperienceModule() {
  const { data, updateWorkExperienceData, addWorkExperience, removeWorkExperience } = useResume();
  const workExperiences = data.workExperience;

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
  if (workExperiences.length === 0) {
    addWorkExperience();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xl">
            请填写您的工作经历，包括公司信息、职位、工作内容等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加工作经历
        </Button>
      </div>
      
      <div className="space-y-8">
        {workExperiences.map((experience, index) => (
          <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                工作经历 {index + 1}
              </h3>
              {workExperiences.length > 1 && (
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
              {/* 公司和职位信息 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`company-${index}`} className="text-base font-medium text-gray-700">
                    公司名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`company-${index}`}
                    type="text"
                    placeholder="例如：腾讯科技有限公司"
                    value={experience.company}
                    onChange={(e) => handleInputChange(index, "company", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`job_title-${index}`} className="text-base font-medium text-gray-700">
                    职位名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`job_title-${index}`}
                    type="text"
                    placeholder="例如：软件工程师"
                    value={experience.job_title}
                    onChange={(e) => handleInputChange(index, "job_title", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
              </div>

              {/* 工作地点信息 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`work_city-${index}`} className="text-base font-medium text-gray-700">
                    城市 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`work_city-${index}`}
                    type="text"
                    placeholder="例如：深圳"
                    value={experience.work_city}
                    onChange={(e) => handleInputChange(index, "work_city", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`work_country-${index}`} className="text-base font-medium text-gray-700">
                    国家 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`work_country-${index}`}
                    type="text"
                    placeholder="例如：中国"
                    value={experience.work_country}
                    onChange={(e) => handleInputChange(index, "work_country", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
              </div>

              {/* 工作时间 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`work_start_date-${index}`} className="text-base font-medium text-gray-700">
                    起始时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`work_start_date-${index}`}
                    value={experience.work_start_date}
                    onChange={(value) => handleInputChange(index, "work_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`work_end_date-${index}`} className="text-base font-medium text-gray-700">
                    结束时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`work_end_date-${index}`}
                    value={experience.work_end_date}
                    onChange={(value) => handleInputChange(index, "work_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-base text-gray-500">如果仍在职，请填写预计离职时间或当前日期</p>
                </div>
              </div>

              {/* 工作职责 */}
              <div className="space-y-3">
                <Label htmlFor={`responsibilities-${index}`} className="text-base font-medium text-gray-700">
                  具体职责 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`responsibilities-${index}`}
                  placeholder="请用英文描述您的工作职责，每行一个要点，动词开头，例如：
• Developed and maintained web applications using React and Node.js
• Collaborated with cross-functional teams to deliver high-quality software products
• Implemented automated testing frameworks to improve code quality
• Optimized database queries resulting in 40% performance improvement"
                  value={experience.responsibilities}
                  onChange={(e) => handleInputChange(index, "responsibilities", e.target.value)}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[150px] resize-none text-lg"
                  rows={6}
                />
                <p className="text-base text-gray-500">tips: 请用英文填写 3-4 条工作职责，每条以动词开头，用 • 符号开头，结束回车换行</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 