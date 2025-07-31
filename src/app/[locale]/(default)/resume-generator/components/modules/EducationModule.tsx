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
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground text-xs">
          请填写您的教育经历，包括学校信息、学位、时间等详细信息。
        </p>
      </div>
      
      <div className="p-4 xl:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0 space-y-4">
        {/* 学校名称 */}
        <div className="space-y-2">
          <Label htmlFor="school_name" className="text-xs font-medium text-foreground">
            学校英文名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="school_name"
            type="text"
            placeholder="例如：Peking University"
            value={formData.school_name}
            onChange={(e) => handleInputChange("school_name", e.target.value)}
            className="h-10 text-xs"
          />
          <p className="text-[10px] text-muted-foreground">请填写学校的完整英文名称</p>
        </div>

        {/* 学校位置信息 */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edu_city" className="text-xs font-medium text-foreground">
              城市 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edu_city"
              type="text"
              placeholder="例如：北京"
              value={formData.edu_city}
              onChange={(e) => handleInputChange("edu_city", e.target.value)}
              className="h-10 text-xs"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edu_country" className="text-xs font-medium text-foreground">
              国家 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edu_country"
              type="text"
              placeholder="例如：中国"
              value={formData.edu_country}
              onChange={(e) => handleInputChange("edu_country", e.target.value)}
              className="h-10 text-xs"
            />
          </div>
        </div>

        {/* 学位信息 */}
        <div className="space-y-2">
          <Label htmlFor="degree" className="text-xs font-medium text-foreground">
            学位 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="degree"
            type="text"
            placeholder="例如：Bachelor of Arts in Psychology"
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className="h-10 text-xs"
          />
          <p className="text-[10px] text-muted-foreground">请用英文填写完整的学位名称</p>
        </div>

        {/* 时间信息 */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edu_start_date" className="text-xs font-medium text-foreground">
              入学时间 <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              id="edu_start_date"
              value={formData.edu_start_date}
              onChange={(value) => handleInputChange("edu_start_date", value)}
              placeholder="选择入学时间"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edu_end_date" className="text-xs font-medium text-foreground">
              毕业时间（预计） <span className="text-destructive">*</span>
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
        <div className="space-y-2">
          <Label htmlFor="gpa_or_rank" className="text-xs font-medium text-foreground">
            GPA 或排名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="gpa_or_rank"
            type="text"
            placeholder="例如：3.8/4.0 或 Top 10%"
            value={formData.gpa_or_rank}
            onChange={(e) => handleInputChange("gpa_or_rank", e.target.value)}
            className="h-10 text-xs"
          />
          <p className="text-[10px] text-muted-foreground">请填写 GPA 分数或年级排名百分比</p>
        </div>

        {/* 相关课程 */}
        <div className="space-y-2">
          <Label htmlFor="relevant_courses" className="text-xs font-medium text-foreground">
            相关课程（可选）
          </Label>
          <Textarea
            id="relevant_courses"
            placeholder="例如：Advanced Statistics, Research Methods, Cognitive Psychology"
            value={formData.relevant_courses}
            onChange={(e) => handleInputChange("relevant_courses", e.target.value)}
            className="min-h-[80px] resize-none text-xs"
            rows={3}
          />
          <p className="text-[10px] text-muted-foreground">请用英文填写 3-5 门相关课程，用逗号分隔</p>
        </div>
      </div>
    </div>
  );
} 