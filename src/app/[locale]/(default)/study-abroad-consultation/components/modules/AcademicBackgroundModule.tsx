"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, School, BookOpen, Calendar, Languages } from 'lucide-react';
import { useStudyAbroad } from '../StudyAbroadContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AcademicBackgroundModule() {
  const { data, updateAcademicBackground } = useStudyAbroad();
  const formData = data.academicBackground;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的学术背景信息
        </p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" />
          学术背景
        </h4>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="current_degree" className="flex items-center gap-2 text-base font-medium text-foreground">
                <GraduationCap className="w-5 h-5" />
                当前学历 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.current_degree}
                onValueChange={(value) => updateAcademicBackground({ current_degree: value })}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="请选择当前学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="高中">高中</SelectItem>
                  <SelectItem value="本科在读">本科在读</SelectItem>
                  <SelectItem value="本科毕业">本科毕业</SelectItem>
                  <SelectItem value="硕士在读">硕士在读</SelectItem>
                  <SelectItem value="硕士毕业">硕士毕业</SelectItem>
                  <SelectItem value="博士在读">博士在读</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="current_school" className="flex items-center gap-2 text-base font-medium text-foreground">
                <School className="w-5 h-5" />
                当前学校 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="current_school"
                placeholder="请输入您的学校名称"
                value={formData.current_school}
                onChange={(e) => updateAcademicBackground({ current_school: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="major" className="flex items-center gap-2 text-base font-medium text-foreground">
                <BookOpen className="w-5 h-5" />
                专业 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="major"
                placeholder="请输入您的专业"
                value={formData.major}
                onChange={(e) => updateAcademicBackground({ major: e.target.value })}
                className="h-14 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="gpa" className="flex items-center gap-2 text-base font-medium text-foreground">
                GPA/均分 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gpa"
                placeholder="例如：3.8/4.0 或 85/100"
                value={formData.gpa}
                onChange={(e) => updateAcademicBackground({ gpa: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="graduation_date" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Calendar className="w-5 h-5" />
                预计毕业时间 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="graduation_date"
                type="month"
                value={formData.graduation_date}
                onChange={(e) => updateAcademicBackground({ graduation_date: e.target.value })}
                className="h-14 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="language_scores" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Languages className="w-5 h-5" />
                语言成绩
              </Label>
              <Input
                id="language_scores"
                placeholder="例如：TOEFL 105, GRE 325"
                value={formData.language_scores}
                onChange={(e) => updateAcademicBackground({ language_scores: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}