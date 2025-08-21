"use client";

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Award, BookOpen, FileText, Trophy } from 'lucide-react';
import { useStudyAbroad } from '../StudyAbroadContext';

export default function BackgroundExperienceModule() {
  const { data, updateBackgroundExperience } = useStudyAbroad();
  const formData = data.backgroundExperience;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted-foreground text-xl">
          请填写您的背景经历，帮助我们更好地了解您的优势
        </p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          背景经历
        </h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="research_experience" className="flex items-center gap-2 text-base font-medium text-foreground">
              <BookOpen className="w-5 h-5" />
              科研经历
            </Label>
            <Textarea
              id="research_experience"
              placeholder="请描述您的科研项目、研究方向、成果等"
              value={formData.research_experience}
              onChange={(e) => updateBackgroundExperience({ research_experience: e.target.value })}
              className="min-h-[120px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="internship_experience" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Briefcase className="w-5 h-5" />
              实习经历
            </Label>
            <Textarea
              id="internship_experience"
              placeholder="请描述您的实习公司、职位、工作内容和成果"
              value={formData.internship_experience}
              onChange={(e) => updateBackgroundExperience({ internship_experience: e.target.value })}
              className="min-h-[120px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="competition_awards" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Award className="w-5 h-5" />
              竞赛获奖
            </Label>
            <Textarea
              id="competition_awards"
              placeholder="请列举您参加的竞赛和获得的奖项"
              value={formData.competition_awards}
              onChange={(e) => updateBackgroundExperience({ competition_awards: e.target.value })}
              className="min-h-[100px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="publications" className="flex items-center gap-2 text-base font-medium text-foreground">
              <FileText className="w-5 h-5" />
              论文发表
            </Label>
            <Textarea
              id="publications"
              placeholder="请列举您发表的论文、期刊、会议等"
              value={formData.publications}
              onChange={(e) => updateBackgroundExperience({ publications: e.target.value })}
              className="min-h-[100px] text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="other_achievements" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Trophy className="w-5 h-5" />
              其他成就
            </Label>
            <Textarea
              id="other_achievements"
              placeholder="请描述其他值得一提的成就、经历或特长"
              value={formData.other_achievements}
              onChange={(e) => updateBackgroundExperience({ other_achievements: e.target.value })}
              className="min-h-[100px] text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}