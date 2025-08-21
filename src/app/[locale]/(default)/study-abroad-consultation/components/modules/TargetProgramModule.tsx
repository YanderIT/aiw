"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Globe, BookOpen, School, Calendar, DollarSign } from 'lucide-react';
import { useStudyAbroad } from '../StudyAbroadContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TargetProgramModule() {
  const { data, updateTargetProgram } = useStudyAbroad();
  const formData = data.targetProgram;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的目标申请项目信息
        </p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          申请目标
        </h4>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="target_degree" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Target className="w-5 h-5" />
                目标学位 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.target_degree}
                onValueChange={(value) => updateTargetProgram({ target_degree: value })}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="请选择目标学位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="硕士">硕士</SelectItem>
                  <SelectItem value="博士">博士</SelectItem>
                  <SelectItem value="本硕连读">本硕连读</SelectItem>
                  <SelectItem value="硕博连读">硕博连读</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="target_country" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Globe className="w-5 h-5" />
                目标国家/地区 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.target_country}
                onValueChange={(value) => updateTargetProgram({ target_country: value })}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="请选择目标国家/地区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="美国">美国</SelectItem>
                  <SelectItem value="英国">英国</SelectItem>
                  <SelectItem value="加拿大">加拿大</SelectItem>
                  <SelectItem value="澳大利亚">澳大利亚</SelectItem>
                  <SelectItem value="新加坡">新加坡</SelectItem>
                  <SelectItem value="香港">香港</SelectItem>
                  <SelectItem value="日本">日本</SelectItem>
                  <SelectItem value="德国">德国</SelectItem>
                  <SelectItem value="法国">法国</SelectItem>
                  <SelectItem value="荷兰">荷兰</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="target_major" className="flex items-center gap-2 text-base font-medium text-foreground">
              <BookOpen className="w-5 h-5" />
              目标专业 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="target_major"
              placeholder="请输入您的目标专业"
              value={formData.target_major}
              onChange={(e) => updateTargetProgram({ target_major: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="target_schools" className="flex items-center gap-2 text-base font-medium text-foreground">
              <School className="w-5 h-5" />
              目标院校 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="target_schools"
              placeholder="请输入您的目标院校，多个学校请用逗号分隔"
              value={formData.target_schools}
              onChange={(e) => updateTargetProgram({ target_schools: e.target.value })}
              className="min-h-[100px] text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="application_year" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Calendar className="w-5 h-5" />
                申请入学时间 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.application_year}
                onValueChange={(value) => updateTargetProgram({ application_year: value })}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="请选择申请入学时间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024 Fall">2024 Fall</SelectItem>
                  <SelectItem value="2025 Spring">2025 Spring</SelectItem>
                  <SelectItem value="2025 Fall">2025 Fall</SelectItem>
                  <SelectItem value="2026 Spring">2026 Spring</SelectItem>
                  <SelectItem value="2026 Fall">2026 Fall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="budget_range" className="flex items-center gap-2 text-base font-medium text-foreground">
                <DollarSign className="w-5 h-5" />
                预算范围
              </Label>
              <Select
                value={formData.budget_range}
                onValueChange={(value) => updateTargetProgram({ budget_range: value })}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="请选择预算范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30万以下/年">30万以下/年</SelectItem>
                  <SelectItem value="30-50万/年">30-50万/年</SelectItem>
                  <SelectItem value="50-80万/年">50-80万/年</SelectItem>
                  <SelectItem value="80万以上/年">80万以上/年</SelectItem>
                  <SelectItem value="无预算限制">无预算限制</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}