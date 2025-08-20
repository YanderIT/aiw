"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Target, Building2, Search, Heart } from 'lucide-react';
import { useCoverLetter } from '../CoverLetterContext';

export default function ApplicationBackgroundModule() {
  const { data, updateApplicationBackgroundData } = useCoverLetter();
  const formData = data.applicationBackground;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的申请背景信息，帮助雇主了解您的申请意图和职业规划。
        </p>
      </div>

      {/* Application Background Form */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-8">
          {/* Current Program */}
          <div className="space-y-3">
            <Label htmlFor="current_program" className="flex items-center gap-2 text-base font-medium text-foreground">
              <GraduationCap className="w-5 h-5" />
              当前身份 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="current_program"
              placeholder="例如：Master's candidate majoring in Finance at NYU"
              value={formData.current_program}
              onChange={(e) => updateApplicationBackgroundData({ current_program: e.target.value })}
              className="h-14 text-lg"
            />
            <p className="text-sm text-muted-foreground">
              请简要描述您的当前状态，如学生身份、专业、学校等
            </p>
          </div>

          {/* Target Position */}
          <div className="space-y-3">
            <Label htmlFor="target_position" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Target className="w-5 h-5" />
              申请岗位名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="target_position"
              placeholder="例如：Investment Banking Analyst"
              value={formData.target_position}
              onChange={(e) => updateApplicationBackgroundData({ target_position: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* Department */}
          <div className="space-y-3">
            <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Building2 className="w-5 h-5" />
              申请岗位所在部门/组别
            </Label>
            <Input
              id="department"
              placeholder="例如：Investment Banking Division"
              value={formData.department}
              onChange={(e) => updateApplicationBackgroundData({ department: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* Application Channel */}
          <div className="space-y-3">
            <Label htmlFor="application_channel" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Search className="w-5 h-5" />
              了解岗位渠道
            </Label>
            <Input
              id="application_channel"
              placeholder="例如：通过官网/校招/内推等方式了解到该岗位"
              value={formData.application_channel}
              onChange={(e) => updateApplicationBackgroundData({ application_channel: e.target.value })}
              className="h-14 text-lg"
            />
            <p className="text-sm text-muted-foreground">
              说明您是如何了解到这个岗位的，如官网、校园招聘、内推等
            </p>
          </div>

          {/* Why This Company */}
          <div className="space-y-3">
            <Label htmlFor="why_this_company" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Heart className="w-5 h-5" />
              对该公司的吸引点
            </Label>
            <Input
              id="why_this_company"
              placeholder="例如：公司文化、培训体系、发展机会等"
              value={formData.why_this_company}
              onChange={(e) => updateApplicationBackgroundData({ why_this_company: e.target.value })}
              className="h-14 text-lg"
            />
            <p className="text-sm text-muted-foreground">
              描述吸引您申请这家公司的原因，如文化、培训、发展前景等
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 