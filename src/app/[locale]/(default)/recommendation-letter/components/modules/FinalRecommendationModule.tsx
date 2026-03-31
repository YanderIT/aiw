"use client"

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, ThumbsUp, Phone } from 'lucide-react';
import { useRecommendationLetter } from '../RecommendationLetterContext';

export default function FinalRecommendationModule() {
  const { data, updateFinalRecommendationData } = useRecommendationLetter();
  const formData = data.finalRecommendation;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请总结推荐理由，表达您对学生的强烈推荐，并提供您的联系方式。
        </p>
      </div>

      {/* 推荐总结 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          推荐总结
        </h4>
        
        <div className="space-y-8">
          {/* 适合项目的原因 */}
          <div className="space-y-3">
            <Label htmlFor="fit_for_program" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Target className="w-5 h-5" />
              学生为何适合申请该项目 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="fit_for_program"
              placeholder="请说明为什么这位学生特别适合申请该项目或专业，包括其能力与项目要求的匹配度、发展潜力等。"
              value={formData.fit_for_program}
              onChange={(e) => updateFinalRecommendationData({ fit_for_program: e.target.value })}
              className="min-h-[150px] text-base"
              rows={6}
            />
          </div>

          {/* 强烈推荐语句 */}
          <div className="space-y-3">
            <Label htmlFor="final_endorsement" className="flex items-center gap-2 text-base font-medium text-foreground">
              <ThumbsUp className="w-5 h-5" />
              推荐人强烈支持的语句 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="final_endorsement"
              placeholder="请表达您对学生的强烈推荐，如 'I strongly recommend...'、'I highly recommend...'、'I recommend without reservation...' 等，并说明推荐的程度和信心。"
              value={formData.final_endorsement}
              onChange={(e) => updateFinalRecommendationData({ final_endorsement: e.target.value })}
              className="min-h-[120px] text-base"
              rows={5}
            />
          </div>
        </div>
      </div>

      {/* 联系方式（可选） */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Phone className="w-6 h-6 text-primary" />
          联系方式 <span className="text-sm text-muted-foreground">（可选）</span>
        </h4>
        
        <div className="space-y-6">
          {/* 推荐人联系方式 */}
          <div className="space-y-3">
            <Label htmlFor="recommender_contact" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Phone className="w-5 h-5" />
              推荐人的联系方式
            </Label>
            <Textarea
              id="recommender_contact"
              placeholder="如需要，请提供您的联系方式，如邮箱、电话、办公地址等，以便招生委员会在需要时联系您。例如：
Email: john.smith@university.edu
Phone: +1-555-1234
Office: Room 302, Computer Science Building"
              value={formData.recommender_contact}
              onChange={(e) => updateFinalRecommendationData({ recommender_contact: e.target.value })}
              className="min-h-[120px] text-base"
              rows={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 