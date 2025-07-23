"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Users, BookOpen } from 'lucide-react';
import { useRecommendationLetter } from '../RecommendationLetterContext';

export default function RelationshipBackgroundModule() {
  const { data, updateRelationshipBackgroundData } = useRecommendationLetter();
  const formData = data.relationshipBackground;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请详细描述您与被推荐学生的相识过程、关系背景和合作经历。
        </p>
      </div>

      {/* 相识背景信息 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          相识背景
        </h4>
        
        <div className="space-y-8">
          {/* 推荐人与学生的关系 */}
          <div className="space-y-3">
            <Label htmlFor="relationship_with_student" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Users className="w-5 h-5" />
              推荐人与学生的关系 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="relationship_with_student"
              placeholder="请详细描述您与学生的关系，如：课程指导老师、项目合作导师、实习supervisor等。包括在什么情况下认识、主要的互动方式等。"
              value={formData.relationship_with_student}
              onChange={(e) => updateRelationshipBackgroundData({ relationship_with_student: e.target.value })}
              className="min-h-[120px] text-base"
              rows={5}
            />
          </div>

          {/* 相识时间 */}
          <div className="space-y-3">
            <Label htmlFor="known_since" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Clock className="w-5 h-5" />
              相识时间 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="known_since"
              placeholder="例如：2022年春季学期、2023年9月"
              value={formData.known_since}
              onChange={(e) => updateRelationshipBackgroundData({ known_since: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* 学生参与过的课程或项目 */}
          <div className="space-y-3">
            <Label htmlFor="course_or_project" className="flex items-center gap-2 text-base font-medium text-foreground">
              <BookOpen className="w-5 h-5" />
              学生参与过的课程或项目 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="course_or_project"
              placeholder="请详细描述学生参与过的具体课程或项目，包括课程名称、项目内容、学生在其中的角色和表现，以及取得的成绩或成果。"
              value={formData.course_or_project}
              onChange={(e) => updateRelationshipBackgroundData({ course_or_project: e.target.value })}
              className="min-h-[150px] text-base"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 