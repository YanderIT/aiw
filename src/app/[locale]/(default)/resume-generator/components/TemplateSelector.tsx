"use client";

import React from "react";
import { useResume } from "./ResumeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeColorPicker } from "./templates/shared/ThemeColorPicker";

export const TemplateSelector = () => {
  const { data, updateSelectedTemplate, updateThemeColor } = useResume();

  const templates = [
    { 
      id: "kakuna", 
      name: "Kakuna", 
      description: "Clean and centered layout with clear section headers",
      preview: "📄 Classic centered format perfect for traditional applications"
    },
    { 
      id: "ditto", 
      name: "Ditto", 
      description: "Modern sidebar design with contact info and skills on the left",
      preview: "📋 Professional two-column layout with sidebar emphasis"
    },
    // { 
    //   id: "gengar", 
    //   name: "Gengar", 
    //   description: "Elegant design with accent colors and modern typography",
    //   preview: "✨ Coming soon - Modern colorful design"
    // },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">选择简历模板</h3>
        <p className="text-gray-600">
          选择一个适合您需求的专业简历模板。所有模板都会自动适配您已填写的内容。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.selectedTemplate === template.id 
                ? "ring-2 ring-green-500 bg-green-50" 
                : "hover:border-green-300"
            }`}
            onClick={() => updateSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {template.name}
                {data.selectedTemplate === template.id && (
                  <span className="text-green-600 text-sm">✓ 已选择</span>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-600">
                {template.preview}
              </div>
              
              {template.id === "gengar" && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded p-2">
                  即将推出 - 目前会使用 Kakuna 模板
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 主题颜色选择器 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <ThemeColorPicker 
          currentTheme={data.themeColor} 
          onThemeChange={updateThemeColor} 
        />
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 模板说明</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <strong>Kakuna 模板：</strong>
            <ul className="mt-1 space-y-1">
              <li>• 经典居中布局，适合传统行业</li>
              <li>• 清晰的分段结构，易于阅读</li>
              <li>• 简洁专业，适合学术和商务用途</li>
            </ul>
          </div>
          <div>
            <strong>Ditto 模板：</strong>
            <ul className="mt-1 space-y-1">
              <li>• 现代双栏设计，信息展示更丰富</li>
              <li>• 侧边栏突出技能和联系方式</li>
              <li>• 适合技术和创意行业</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};