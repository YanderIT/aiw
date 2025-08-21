"use client";

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { HelpCircle, Target, Clock, MessageSquare } from 'lucide-react';
import { useStudyAbroad } from '../StudyAbroadContext';

export default function ConsultationNeedsModule() {
  const { data, updateConsultationNeeds } = useStudyAbroad();
  const formData = data.consultationNeeds;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted-foreground text-xl">
          请告诉我们您的咨询需求，以便为您提供更精准的服务
        </p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-primary" />
          咨询需求
        </h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="main_concerns" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Target className="w-5 h-5" />
              主要关注问题 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="main_concerns"
              placeholder="请描述您在留学申请中最关心的问题，例如：选校定位、文书准备、面试指导等"
              value={formData.main_concerns}
              onChange={(e) => updateConsultationNeeds({ main_concerns: e.target.value })}
              className="min-h-[120px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="service_expectations" className="flex items-center gap-2 text-base font-medium text-foreground">
              <MessageSquare className="w-5 h-5" />
              服务期望 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="service_expectations"
              placeholder="请描述您希望获得的服务内容，例如：全程申请指导、文书润色、模拟面试等"
              value={formData.service_expectations}
              onChange={(e) => updateConsultationNeeds({ service_expectations: e.target.value })}
              className="min-h-[120px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="preferred_consultation_time" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Clock className="w-5 h-5" />
              方便咨询时间
            </Label>
            <Input
              id="preferred_consultation_time"
              placeholder="例如：周末下午2-5点，工作日晚上7-9点"
              value={formData.preferred_consultation_time}
              onChange={(e) => updateConsultationNeeds({ preferred_consultation_time: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="additional_notes" className="flex items-center gap-2 text-base font-medium text-foreground">
              <MessageSquare className="w-5 h-5" />
              补充说明
            </Label>
            <Textarea
              id="additional_notes"
              placeholder="如有其他需要说明的情况，请在此补充"
              value={formData.additional_notes}
              onChange={(e) => updateConsultationNeeds({ additional_notes: e.target.value })}
              className="min-h-[100px] text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}