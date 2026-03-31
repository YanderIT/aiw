"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, TrendingUp, Star, Users } from 'lucide-react';
import { useCoverLetter } from '../CoverLetterContext';

export default function ExperienceHistoryModule() {
  const { data, updateExperienceHistoryData } = useCoverLetter();
  const formData = data.experienceHistory;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请详细描述您的实习和项目经历，突出展示您的能力和成就。
        </p>
      </div>

      {/* Experience History Form */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-8">
          {/* Past Internship */}
          <div className="space-y-3">
            <Label htmlFor="past_internship_1" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Briefcase className="w-5 h-5" />
              重点实习/工作经历 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="past_internship_1"
              placeholder="请详细描述一段重要的实习或工作经历，包括：&#10;- 公司名称和职位&#10;- 主要工作任务和职责&#10;- 具体成果和收获&#10;&#10;例如：在JP Morgan Chase担任Summer Analyst，负责金融建模和行业研究，参与了3个IPO项目的财务分析，提升了Excel建模和数据分析能力..."
              value={formData.past_internship_1}
              onChange={(e) => updateExperienceHistoryData({ past_internship_1: e.target.value })}
              className="min-h-32 text-lg bg-white dark:bg-white"
              rows={8}
            />
          </div>

          {/* Skills from Internship */}
          <div className="space-y-3">
            <Label htmlFor="skills_from_internship" className="flex items-center gap-2 text-base font-medium text-foreground">
              <TrendingUp className="w-5 h-5" />
              从该经历中获得的技能 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="skills_from_internship"
              placeholder="例如：金融建模、数据分析、客户沟通、团队协作等"
              value={formData.skills_from_internship}
              onChange={(e) => updateExperienceHistoryData({ skills_from_internship: e.target.value })}
              className="h-14 text-lg bg-white dark:bg-white"
            />
            <p className="text-sm text-muted-foreground">
              列出您在该经历中学到或提升的关键技能，如专业技能、软技能等
            </p>
          </div>

          {/* Highlight Project */}
          <div className="space-y-3">
            <Label htmlFor="highlight_project" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Star className="w-5 h-5" />
              代表性项目和产出
            </Label>
            <Textarea
              id="highlight_project"
              placeholder="描述一个您参与的代表性项目及其成果，例如：&#10;- 参与某公司IPO项目的估值建模&#10;- 完成某行业的深度研究报告&#10;- 设计并实施某项业务流程优化方案&#10;&#10;请包含项目背景、您的具体贡献和最终结果..."
              value={formData.highlight_project}
              onChange={(e) => updateExperienceHistoryData({ highlight_project: e.target.value })}
              className="min-h-24 text-lg bg-white dark:bg-white"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              详细描述一个能体现您能力的具体项目，包括项目背景、您的贡献和成果
            </p>
          </div>

          {/* Leadership or Teamwork */}
          <div className="space-y-3">
            <Label htmlFor="leadership_or_teamwork" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Users className="w-5 h-5" />
              领导力或团队协作经历
            </Label>
            <Input
              id="leadership_or_teamwork"
              placeholder="例如：担任项目负责人、组织团队活动、跨部门协作等"
              value={formData.leadership_or_teamwork}
              onChange={(e) => updateExperienceHistoryData({ leadership_or_teamwork: e.target.value })}
              className="h-14 text-lg bg-white dark:bg-white"
            />
            <p className="text-sm text-muted-foreground">
              简要描述体现您领导能力或团队合作精神的经历
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 