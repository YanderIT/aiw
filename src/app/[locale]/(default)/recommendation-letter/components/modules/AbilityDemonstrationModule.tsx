"use client"

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Trophy, Heart, FileText } from 'lucide-react';
import { useRecommendationLetter } from '../RecommendationLetterContext';

export default function AbilityDemonstrationModule() {
  const { data, updateAbilityDemonstrationData } = useRecommendationLetter();
  const formData = data.abilityDemonstration;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请详细描述学生的各项能力表现，包括学术能力、项目经验和个人品质等方面。
        </p>
      </div>

      {/* 学术能力 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Star className="w-6 h-6 text-primary" />
          学术能力展示
        </h4>
        
        <div className="space-y-8">
          {/* 学术方面的表现 */}
          <div className="space-y-3">
            <Label htmlFor="academic_strength" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Star className="w-5 h-5" />
              学术方面的表现 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="academic_strength"
              placeholder="请详细描述学生在学术方面的表现，如理解力、逻辑性、创造力、分析能力、研究潜力等。可以包括具体的课程表现、学习态度、思维能力等。"
              value={formData.academic_strength}
              onChange={(e) => updateAbilityDemonstrationData({ academic_strength: e.target.value })}
              className="min-h-[150px] text-base"
              rows={6}
            />
          </div>

          {/* 个人品质 */}
          <div className="space-y-3">
            <Label htmlFor="personal_qualities" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Heart className="w-5 h-5" />
              学生的性格特质 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="personal_qualities"
              placeholder="请描述学生的性格特质，如独立性、沟通能力、领导力、团队合作精神、坚持性、热情、责任心等个人品质。"
              value={formData.personal_qualities}
              onChange={(e) => updateAbilityDemonstrationData({ personal_qualities: e.target.value })}
              className="min-h-[120px] text-base"
              rows={5}
            />
          </div>
        </div>
      </div>

      {/* 项目经验与具体示例 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          项目经验与具体示例 <span className="text-sm text-muted-foreground">（可选）</span>
        </h4>
        
        <div className="space-y-8">
          {/* 项目或竞赛经历 */}
          <div className="space-y-3">
            <Label htmlFor="project_achievement" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Trophy className="w-5 h-5" />
              项目或竞赛经历和结果
            </Label>
            <Textarea
              id="project_achievement"
              placeholder="如果学生有突出的项目或竞赛经历，请在此描述具体内容和取得的成果。"
              value={formData.project_achievement}
              onChange={(e) => updateAbilityDemonstrationData({ project_achievement: e.target.value })}
              className="min-h-[120px] text-base"
              rows={5}
            />
          </div>

          {/* 具体故事示例 */}
          <div className="space-y-3">
            <Label htmlFor="specific_example" className="flex items-center gap-2 text-base font-medium text-foreground">
              <FileText className="w-5 h-5" />
              具体故事/事件示例
            </Label>
            <Textarea
              id="specific_example"
              placeholder="请用一个具体的故事或事件来突出学生的某项能力或特质，这将使推荐信更加生动和有说服力。"
              value={formData.specific_example}
              onChange={(e) => updateAbilityDemonstrationData({ specific_example: e.target.value })}
              className="min-h-[150px] text-base"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 