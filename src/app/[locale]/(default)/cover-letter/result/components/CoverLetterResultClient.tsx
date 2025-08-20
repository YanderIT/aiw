"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { 
  CheckCircle, 
  Square, 
  CheckSquare, 
  Copy, 
  Download, 
  Save, 
  RefreshCw, 
  FileText,
  Sparkles,
  Edit3
} from "lucide-react";
import { toast } from "sonner";

// Import context and modules
import { CoverLetterProvider, useCoverLetter } from "../../components/CoverLetterContext";
import BasicInfoModule from "../../components/modules/BasicInfoModule";
import ApplicationBackgroundModule from "../../components/modules/ApplicationBackgroundModule";
import ExperienceHistoryModule from "../../components/modules/ExperienceHistoryModule";
import FitAndClosingModule from "../../components/modules/FitAndClosingModule";

// Import SVG icons
import BasicInfoIcon from "../../components/icons/BasicInfoIcon";
import ApplicationBackgroundIcon from "../../components/icons/ApplicationBackgroundIcon";
import ExperienceHistoryIcon from "../../components/icons/ExperienceHistoryIcon";
import FitAndClosingIcon from "../../components/icons/FitAndClosingIcon";

export interface CoverLetterModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// 生成求职信内容
const generateCoverLetter = (data: any) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `${data.basicInfo.full_name || '[Your Name]'}
${data.basicInfo.address || '[Your Address]'}
${data.basicInfo.email || '[Your Email]'}
${data.basicInfo.phone || '[Your Phone]'}

${data.basicInfo.date || today}

${data.basicInfo.recruiter_name || '[Hiring Manager Name]'}
${data.basicInfo.recruiter_title || '[Title]'}
${data.basicInfo.company_name || '[Company Name]'}
${data.basicInfo.company_address || '[Company Address]'}

Dear ${data.basicInfo.recruiter_name ? `${data.basicInfo.recruiter_name}` : 'Hiring Manager'},

${data.applicationBackground.current_program ? `I am currently ${data.applicationBackground.current_program}, and I am writing to express my strong interest in the ${data.applicationBackground.target_position || '[Position Name]'} position` : `I am writing to express my strong interest in the ${data.applicationBackground.target_position || '[Position Name]'} position`}${data.applicationBackground.department ? ` in the ${data.applicationBackground.department} department` : ''} at ${data.basicInfo.company_name || '[Company Name]'}. ${data.applicationBackground.application_channel ? `I learned about this opportunity through ${data.applicationBackground.application_channel}.` : ''}

${data.applicationBackground.why_this_company ? `What particularly draws me to ${data.basicInfo.company_name || '[Company Name]'} is ${data.applicationBackground.why_this_company}` : ''}

${data.experienceHistory.past_internship_1 ? `In my previous experience, ${data.experienceHistory.past_internship_1}.` : ''} ${data.experienceHistory.skills_from_internship ? `Through this experience, I have developed ${data.experienceHistory.skills_from_internship}, which I believe will be valuable in this role.` : ''}

${data.experienceHistory.highlight_project ? `One of my most significant accomplishments was ${data.experienceHistory.highlight_project}.` : ''} ${data.experienceHistory.leadership_or_teamwork ? `Additionally, ${data.experienceHistory.leadership_or_teamwork}` : ''}

${data.fitAndClosing.fit_reason ? `I am particularly well-suited for this position because ${data.fitAndClosing.fit_reason}.` : ''} ${data.fitAndClosing.impressed_by_company ? `I am impressed by ${data.fitAndClosing.impressed_by_company}` : ''}

${data.fitAndClosing.final_expectation ? `${data.fitAndClosing.final_expectation}` : 'I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team.'} Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${data.basicInfo.full_name || '[Your Name]'}`;
};

function CoverLetterResultContent() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    data, 
    isModuleSelected, 
    toggleModuleSelection,
    updateBasicInfoData,
    updateApplicationBackgroundData,
    updateExperienceHistoryData,
    updateFitAndClosingData
  } = useCoverLetter();

  const modules: CoverLetterModule[] = [
    {
      id: "basicInfo",
      title: "基本信息",
      icon: BasicInfoIcon,
      component: BasicInfoModule,
    },
    {
      id: "applicationBackground",
      title: "申请背景",
      icon: ApplicationBackgroundIcon,
      component: ApplicationBackgroundModule,
    },
    {
      id: "experienceHistory",
      title: "实习与经历",
      icon: ExperienceHistoryIcon,
      component: ExperienceHistoryModule,
    },
    {
      id: "fitAndClosing",
      title: "匹配度与结尾",
      icon: FitAndClosingIcon,
      component: FitAndClosingModule,
    },
  ];

  // 初始生成求职信
  useEffect(() => {
    const generated = generateCoverLetter(data);
    setGeneratedContent(generated);
  }, [data]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generated = generateCoverLetter(data);
      setGeneratedContent(generated);
      toast.success("求职信已重新生成！");
    } catch (error) {
      toast.error("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success("内容已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  const handleExport = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${data.basicInfo.full_name || 'applicant'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("求职信已导出");
  };

  const handleSave = () => {
    // 这里可以实现保存到数据库的逻辑
    localStorage.setItem('saved-cover-letter', generatedContent);
    toast.success("求职信已保存");
  };

  const getModuleKey = (moduleId: string) => {
    if (moduleId === 'applicationBackground') return 'applicationBackground';
    if (moduleId === 'experienceHistory') return 'experienceHistory';
    if (moduleId === 'fitAndClosing') return 'fitAndClosing';
    return moduleId;
  };

  const currentModule = modules.find(m => m.id === activeTab);
  const ActiveComponent = currentModule?.component || BasicInfoModule;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">求职信生成结果</h1>
                <p className="text-muted-foreground text-base">
                  编辑内容并导出您的求职信
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                已生成
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Sidebar - Module Navigation */}
          <div className="col-span-2">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-base text-muted-foreground uppercase tracking-wide mb-4">
                内容模块
              </h3>
              <div className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const moduleKey = getModuleKey(module.id);
                  const isSelected = isModuleSelected(moduleKey as any);
                  
                  return (
                    <div key={module.id} className="group">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                        <button
                          className={`p-2 rounded transition-all duration-200 hover:scale-110 ${
                            isSelected 
                              ? "text-primary" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => toggleModuleSelection(moduleKey as any)}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                        <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-base font-medium text-foreground flex-1">
                          {module.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Section - Tabs and Form */}
          <div className="col-span-4">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm flex flex-col min-h-[calc(100vh-200px)]">
              {/* Tab Headers */}
              <div className="border-b border-border p-4">
                <div className="flex flex-wrap gap-2">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    const moduleKey = getModuleKey(module.id);
                    const isSelected = isModuleSelected(moduleKey as any);
                    
                    if (!isSelected) return null;
                    
                    return (
                      <button
                        key={module.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          activeTab === module.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => setActiveTab(module.id)}
                      >
                        <Icon className="w-5 h-5" />
                        {module.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Module Content */}
              <div className="flex-1 p-6 overflow-y-auto min-h-0">
                {currentModule && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <currentModule.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold text-foreground">
                        {currentModule.title}
                      </h3>
                    </div>
                    <ActiveComponent />
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="border-t border-border p-6 mt-auto">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-4 h-14"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                      正在生成...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      重新生成求职信
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Generated Content */}
          <div className="col-span-6">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm flex flex-col min-h-[calc(100vh-200px)]">
              {/* Header with Actions */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">生成的求职信</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleCopy}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      复制
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleExport}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleSave}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Editable Content */}
              <div className="flex-1 p-4">
                <Textarea
                  ref={textareaRef}
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full h-full min-h-[500px] resize-none border-0 bg-transparent text-lg leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="生成的求职信将在这里显示..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoverLetterResultClient() {
  return (
    <CoverLetterProvider>
      <CoverLetterResultContent />
    </CoverLetterProvider>
  );
} 