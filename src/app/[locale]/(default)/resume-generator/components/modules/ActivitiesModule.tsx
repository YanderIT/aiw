"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
// import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useResume, ActivitiesData } from "../ResumeContext";

export default function ActivitiesModule() {
  const { data, updateActivitiesData, addActivity, removeActivity } = useResume();
  const activities = data.activities;

  const handleInputChange = (index: number, field: keyof ActivitiesData, value: string) => {
    updateActivitiesData(index, { [field]: value });
  };

  const handleAdd = () => {
    addActivity();
  };

  const handleRemove = (index: number) => {
    if (activities.length > 1) {
      removeActivity(index);
    }
  };

  // 确保至少有一个活动条目
  if (activities.length === 0) {
    addActivity();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xl">
            请填写您的课外活动、社团参与、志愿者经历等详细信息。
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加活动经历
        </Button>
      </div>
      
      <div className="space-y-8">
        {activities.map((activity, index) => (
          <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                活动经历 {index + 1}
              </h3>
              {activities.length > 1 && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 px-4"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className="space-y-8">
              {/* 活动名称和角色 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`activity_name-${index}`} className="text-base font-medium text-gray-700">
                    活动名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`activity_name-${index}`}
                    type="text"
                    placeholder="例如：学生会主席团、环保志愿者协会"
                    value={activity.activity_name}
                    onChange={(e) => handleInputChange(index, "activity_name", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`role-${index}`} className="text-base font-medium text-gray-700">
                    你的身份 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`role-${index}`}
                    type="text"
                    placeholder="例如：负责人、志愿者、团队成员"
                    value={activity.role}
                    onChange={(e) => handleInputChange(index, "role", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
              </div>

              {/* 活动地点 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`act_city-${index}`} className="text-base font-medium text-gray-700">
                    城市 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`act_city-${index}`}
                    type="text"
                    placeholder="例如：上海"
                    value={activity.act_city}
                    onChange={(e) => handleInputChange(index, "act_city", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`act_country-${index}`} className="text-base font-medium text-gray-700">
                    国家 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`act_country-${index}`}
                    type="text"
                    placeholder="例如：中国"
                    value={activity.act_country}
                    onChange={(e) => handleInputChange(index, "act_country", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
                  />
                </div>
              </div>

              {/* 活动时间 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor={`act_start_date-${index}`} className="text-base font-medium text-gray-700">
                    起始时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`act_start_date-${index}`}
                    value={activity.act_start_date}
                    onChange={(value) => handleInputChange(index, "act_start_date", value)}
                    placeholder="选择开始时间"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`act_end_date-${index}`} className="text-base font-medium text-gray-700">
                    结束时间 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id={`act_end_date-${index}`}
                    value={activity.act_end_date}
                    onChange={(value) => handleInputChange(index, "act_end_date", value)}
                    placeholder="选择结束时间"
                  />
                  <p className="text-base text-gray-500">如果活动仍在进行中，请填写预计结束时间</p>
                </div>
              </div>

              {/* 活动描述 */}
              <div className="space-y-3">
                <Label htmlFor={`description-${index}`} className="text-base font-medium text-gray-700">
                  你做了什么 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`description-${index}`}
                  placeholder="请用英文描述您在活动中的具体工作和贡献，每行一个要点，例如：
• Organized and coordinated campus environmental awareness campaigns reaching over 2,000 students
• Led a team of 15 volunteers to conduct weekly beach cleanup activities and waste sorting programs
• Developed social media content and promotional materials resulting in 40% increase in participation
• Collaborated with local government agencies to establish recycling stations across 5 university dormitories"
                  value={activity.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[150px] resize-none text-lg"
                  rows={6}
                />
                <p className="text-base text-gray-500">请用英文填写 3-4 条您在活动中的具体工作和贡献，每条以动词开头，用 • 符号分隔</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 