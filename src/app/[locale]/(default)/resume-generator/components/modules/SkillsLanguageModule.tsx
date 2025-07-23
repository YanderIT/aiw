"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResume, SkillsLanguageData } from "../ResumeContext";

export default function SkillsLanguageModule() {
  const { data, updateSkillsLanguageData } = useResume();
  const formData = data.skillsLanguage;

  const handleInputChange = (field: keyof SkillsLanguageData, value: string) => {
    updateSkillsLanguageData({ [field]: value });
  };

  return (
    <div className="space-y-10">
      <div>
        
        <p className="text-gray-600 text-xl">
          请填写您的专业技能、编程语言、外语水平等详细信息。
        </p>
      </div>
      
      <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-0 space-y-8">
        {/* 专业技能 */}
        <div className="space-y-3">
          <Label htmlFor="skills" className="text-base font-medium text-gray-700">
            技能 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="skills"
            placeholder="请列出您的专业技能，用逗号分隔，例如：
Python, SPSS, Excel, R, Machine Learning, Data Analysis, SQL, Tableau, PowerBI, Java, JavaScript, React, Node.js, Git, Docker"
            value={formData.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl min-h-[120px] resize-none text-lg"
            rows={5}
          />
          <p className="text-base text-gray-500">请列出编程语言、软件工具、专业技能等，用逗号分隔</p>
        </div>

        {/* 语言能力 */}
        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">语言能力</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="english_level" className="text-base font-medium text-gray-700">
                英语能力 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="english_level"
                type="text"
                placeholder="例如：IELTS 6.5、TOEFL 95、CET-6"
                value={formData.english_level}
                onChange={(e) => handleInputChange("english_level", e.target.value)}
                className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
              />
              <p className="text-base text-gray-500">请填写考试成绩或水平描述</p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="native_language" className="text-base font-medium text-gray-700">
                母语 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="native_language"
                type="text"
                placeholder="例如：中文、English"
                value={formData.native_language}
                onChange={(e) => handleInputChange("native_language", e.target.value)}
                className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="other_languages" className="text-base font-medium text-gray-700">
              其他语言（可选）
            </Label>
            <Input
              id="other_languages"
              type="text"
              placeholder="例如：Japanese – Basic, French – Intermediate, Korean – Conversational"
              value={formData.other_languages}
              onChange={(e) => handleInputChange("other_languages", e.target.value)}
              className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl h-14 text-lg"
            />
            <p className="text-base text-gray-500">请标注语言名称和熟练程度，用逗号分隔多种语言</p>
          </div>
        </div>

      </div>

      {/* 帮助信息 */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-blue-800 mb-2">💡 填写指南</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-blue-700 mb-2">技能建议：</h5>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• 编程语言：Python, Java, C++, JavaScript</li>
              <li>• 数据分析：Excel, SPSS, R, Tableau, Power BI</li>
              <li>• 专业软件：AutoCAD, Photoshop, Figma</li>
              <li>• 框架工具：React, Django, Git, Docker</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 mb-2">语言水平：</h5>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• 英语考试：IELTS, TOEFL, CET, GRE</li>
              <li>• 水平描述：Native, Fluent, Advanced</li>
              <li>• 其他语言：Basic, Intermediate, Conversational</li>
              <li>• 多语种格式：Japanese – Basic, German – Intermediate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 