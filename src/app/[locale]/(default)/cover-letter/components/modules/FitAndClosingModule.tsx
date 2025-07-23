"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Eye, HandHeart } from 'lucide-react';
import { useCoverLetter } from '../CoverLetterContext';

export default function FitAndClosingModule() {
  const { data, updateFitAndClosingData } = useCoverLetter();
  const formData = data.fitAndClosing;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请说明您与岗位的匹配度，并表达您的求职意愿和期望。
        </p>
      </div>

      {/* Fit and Closing Form */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="space-y-8">
          {/* Fit Reason */}
          <div className="space-y-3">
            <Label htmlFor="fit_reason" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Target className="w-5 h-5" />
              为什么您适合这个岗位 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="fit_reason"
              placeholder="请结合您的背景、经历和能力，说明为什么您适合这个岗位：&#10;&#10;- 教育背景如何与岗位要求匹配&#10;- 实习经历如何体现您的相关能力&#10;- 个人技能如何满足岗位需求&#10;- 职业目标如何与公司发展方向一致&#10;&#10;例如：我的金融学背景和在投行的实习经历让我具备了扎实的财务分析能力，而我在项目中展现的团队合作精神和学习能力也符合贵公司对分析师的要求..."
              value={formData.fit_reason}
              onChange={(e) => updateFitAndClosingData({ fit_reason: e.target.value })}
              className="min-h-32 text-lg"
              rows={8}
            />
          </div>

          {/* Impressed by Company */}
          <div className="space-y-3">
            <Label htmlFor="impressed_by_company" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Eye className="w-5 h-5" />
              对这家公司的认可或观察
            </Label>
            <Input
              id="impressed_by_company"
              placeholder="例如：公司近期的增长表现、市场地位、创新能力等"
              value={formData.impressed_by_company}
              onChange={(e) => updateFitAndClosingData({ impressed_by_company: e.target.value })}
              className="h-14 text-lg"
            />
            <p className="text-sm text-muted-foreground">
              表达您对这家公司的了解和认可，如近期成长、行业地位、业务创新等
            </p>
          </div>

          {/* Final Expectation */}
          <div className="space-y-3">
            <Label htmlFor="final_expectation" className="flex items-center gap-2 text-base font-medium text-foreground">
              <HandHeart className="w-5 h-5" />
              希望获得面试机会的愿望与感谢
            </Label>
            <Textarea
              id="final_expectation"
              placeholder="请表达您希望获得面试机会的愿望，并对招聘方表示感谢：&#10;&#10;例如：我非常希望能有机会进一步讨论我如何为贵公司贡献价值。感谢您抽出宝贵时间阅读我的求职信，期待您的回复。&#10;&#10;或者：我期待能够在面试中更详细地分享我的经历和想法。感谢您的考虑，希望能够尽快收到您的回复。"
              value={formData.final_expectation}
              onChange={(e) => updateFitAndClosingData({ final_expectation: e.target.value })}
              className="min-h-24 text-lg"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              以专业而真诚的语调表达面试期望和感谢之意
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 