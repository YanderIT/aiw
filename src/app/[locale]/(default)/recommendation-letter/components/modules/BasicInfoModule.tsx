"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, User, Building, GraduationCap } from 'lucide-react';
import { useRecommendationLetter } from '../RecommendationLetterContext';

export default function BasicInfoModule() {
  const { data, updateBasicInfoData } = useRecommendationLetter();
  const formData = data.basicInfo;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xl">
          请填写推荐信的基本信息，包括被推荐学生和推荐人的基本资料。
        </p>
      </div>

      {/* 被推荐学生信息 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" />
          被推荐学生信息
        </h4>
        
        <div className="space-y-6">
          {/* 学生英文全名 */}
          <div className="space-y-3">
            <Label htmlFor="student_full_name" className="flex items-center gap-2 text-base font-medium text-foreground">
              <User className="w-5 h-5" />
              被推荐学生的英文全名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="student_full_name"
              placeholder="例如：Zhang Wei"
              value={formData.student_full_name}
              onChange={(e) => updateBasicInfoData({ student_full_name: e.target.value })}
              className="h-14 text-lg"
            />
          </div>
        </div>
      </div>

      {/* 推荐人信息 */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          推荐人信息
        </h4>
        
        <div className="space-y-6">
          {/* 推荐人英文姓名 */}
          <div className="space-y-3">
            <Label htmlFor="recommender_name" className="flex items-center gap-2 text-base font-medium text-foreground">
              推荐人英文姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recommender_name"
              placeholder="例如：Dr. John Smith"
              value={formData.recommender_name}
              onChange={(e) => updateBasicInfoData({ recommender_name: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* 推荐人职称 */}
          <div className="space-y-3">
            <Label htmlFor="recommender_title" className="flex items-center gap-2 text-base font-medium text-foreground">
              推荐人职称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recommender_title"
              placeholder="例如：Associate Professor, Senior Engineer"
              value={formData.recommender_title}
              onChange={(e) => updateBasicInfoData({ recommender_title: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* 推荐人所在单位 */}
          <div className="space-y-3">
            <Label htmlFor="recommender_institution" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Building className="w-5 h-5" />
              推荐人所在单位 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recommender_institution"
              placeholder="例如：Computer Science Department, Tsinghua University"
              value={formData.recommender_institution}
              onChange={(e) => updateBasicInfoData({ recommender_institution: e.target.value })}
              className="h-14 text-lg"
            />
          </div>

          {/* 推荐信日期 */}
          <div className="space-y-3">
            <Label htmlFor="recommendation_date" className="flex items-center gap-2 text-base font-medium text-foreground">
              <Calendar className="w-5 h-5" />
              推荐信日期 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recommendation_date"
              type="date"
              value={formData.recommendation_date}
              onChange={(e) => updateBasicInfoData({ recommendation_date: e.target.value })}
              className="h-14 text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 