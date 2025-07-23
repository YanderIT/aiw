"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useResume, EducationData } from "../ResumeContext";

export default function EducationModule() {
  const { data, updateEducationData } = useResume();
  const formData = data.education;

  const handleInputChange = (field: keyof EducationData, value: string) => {
    updateEducationData({ [field]: value });
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-gray-600 text-xl">
          请填写您的教育经历，包括学校信息、学位、时间等详细信息。
        </p>
      </div>
      
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0 space-y-8">
        {/* 学校名称 */}
        <div className="space-y-3">
          <Label htmlFor="school_name" className="text-base font-medium text-gray-700">
            学校英文名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="school_name"
            type="text"
            placeholder="例如：Peking University"
            value={formData.school_name}
            onChange={(e) => handleInputChange("school_name", e.target.value)}
            className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
          />
          <p className="text-base text-gray-500">请填写学校的完整英文名称</p>
        </div>

        {/* 学校位置信息 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="edu_city" className="text-base font-medium text-gray-700">
              城市 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edu_city"
              type="text"
              placeholder="例如：北京"
              value={formData.edu_city}
              onChange={(e) => handleInputChange("edu_city", e.target.value)}
              className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="edu_country" className="text-base font-medium text-gray-700">
              国家 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edu_country"
              type="text"
              placeholder="例如：中国"
              value={formData.edu_country}
              onChange={(e) => handleInputChange("edu_country", e.target.value)}
              className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
            />
          </div>
        </div>

        {/* 学位信息 */}
        <div className="space-y-3">
          <Label htmlFor="degree" className="text-base font-medium text-gray-700">
            学位 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="degree"
            type="text"
            placeholder="例如：Bachelor of Arts in Psychology"
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
          />
          <p className="text-base text-gray-500">请用英文填写完整的学位名称</p>
        </div>

        {/* 时间信息 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="edu_start_date" className="text-base font-medium text-gray-700">
              入学时间 <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              id="edu_start_date"
              value={formData.edu_start_date}
              onChange={(value) => handleInputChange("edu_start_date", value)}
              placeholder="选择入学时间"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="edu_end_date" className="text-base font-medium text-gray-700">
              毕业时间（预计） <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              id="edu_end_date"
              value={formData.edu_end_date}
              onChange={(value) => handleInputChange("edu_end_date", value)}
              placeholder="选择毕业时间"
            />
          </div>
        </div>

        {/* GPA 信息 */}
        <div className="space-y-3">
          <Label htmlFor="gpa_or_rank" className="text-base font-medium text-gray-700">
            GPA 或排名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="gpa_or_rank"
            type="text"
            placeholder="例如：3.8/4.0 或 Top 10%"
            value={formData.gpa_or_rank}
            onChange={(e) => handleInputChange("gpa_or_rank", e.target.value)}
            className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
          />
          <p className="text-base text-gray-500">请填写 GPA 分数或年级排名百分比</p>
        </div>

        {/* 相关课程 */}
        <div className="space-y-3">
          <Label htmlFor="relevant_courses" className="text-base font-medium text-gray-700">
            相关课程（可选）
          </Label>
          <Textarea
            id="relevant_courses"
            placeholder="例如：Advanced Statistics, Research Methods, Cognitive Psychology, Social Psychology, Abnormal Psychology"
            value={formData.relevant_courses}
            onChange={(e) => handleInputChange("relevant_courses", e.target.value)}
            className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[100px] resize-none text-lg"
            rows={4}
          />
          <p className="text-base text-gray-500">请用英文填写 3-5 门相关课程，用逗号分隔</p>
        </div>
      </div>
    </div>
  );
} 