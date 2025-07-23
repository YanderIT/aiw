"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Square, CheckSquare, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from '@/i18n/navigation';
import { GlobalLoading } from "@/components/ui/loading";

// Import context
import { ResumeProvider, useResume } from "./ResumeContext";

// Import module components
import HeaderModule from "./modules/HeaderModule";
import EducationModule from "./modules/EducationModule";
import WorkExperienceModule from "./modules/WorkExperienceModule";
import ResearchModule from "./modules/ResearchModule";
import ActivitiesModule from "./modules/ActivitiesModule";
import AwardsModule from "./modules/AwardsModule";
import SkillsLanguageModule from "./modules/SkillsLanguageModule";

// Import SVG icons
import HeaderIcon from "./icons/HeaderIcon";
import EducationIcon from "./icons/EducationIcon";
import WorkExperienceIcon from "./icons/WorkExperienceIcon";
import ResearchIcon from "./icons/ResearchIcon";
import ActivitiesIcon from "./icons/ActivitiesIcon";
import AwardsIcon from "./icons/AwardsIcon";
import SkillsLanguageIcon from "./icons/SkillsLanguageIcon";

export interface ResumeModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// 确认页面组件
function ConfirmationPage() {
  const t = useTranslations();
  const router = useRouter();
  const { 
    getConfirmationData, 
    getIncompleteSelections, 
    canGenerate, 
    toggleModuleSelection, 
    isModuleRequired,
    generationState,
    setGenerationLoading
  } = useResume();
  
  // 处理生成按钮点击
  const handleGenerate = () => {
    // 设置loading状态
    setGenerationLoading(true);
    // 跳转到结果页面，带上自动生成参数
    router.push('resume-generator/result?autoGenerate=true');
  };
  
  const confirmationData = getConfirmationData();
  const incompleteSelections = getIncompleteSelections();
  const selectedItems = confirmationData.filter(item => item.isChecked);

  // 获取所有可用的模块数据（包括选中和未选中的）
  const allModuleItems = confirmationData;

  // 处理模块ID映射
  const getModuleKey = (moduleId: string) => {
    if (moduleId === 'work-experience') return 'workExperience';
    if (moduleId === 'skills-language') return 'skillsLanguage';
    return moduleId;
  };

  return (
    <>
      <GlobalLoading isVisible={generationState.isGenerating} />
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">确认文书内容</h2>
          <p className="text-muted-foreground">请确认您要包含在文书中的内容，点击复选框可以切换选择</p>
        </div>

      {/* 所有模块的可选择列表 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
          文书模块：
        </h3>
        <ul className="space-y-3">
          {allModuleItems.map((item) => {
            const moduleKey = getModuleKey(item.moduleId);
            const isRequired = isModuleRequired(moduleKey as any);
            return (
              <li key={item.moduleId} className="flex items-center gap-3 group">
                <button
                  className={`p-1 rounded-md transition-all duration-200 ${
                    isRequired
                      ? "text-red-500 cursor-not-allowed"
                      : item.isChecked 
                      ? "text-primary hover:text-primary/80 hover:scale-110" 
                      : "text-muted-foreground hover:text-foreground hover:scale-110"
                  }`}
                  onClick={() => {
                    if (!isRequired) {
                      toggleModuleSelection(moduleKey as any);
                    }
                  }}
                  disabled={isRequired}
                  title={isRequired ? "此模块为必选，无法取消" : undefined}
                >
                  {item.isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-foreground flex-1 ${item.isChecked ? 'font-medium' : ''}`}>
                  {item.title}
                  {isRequired && (
                    <span className="text-xs text-red-500 font-medium ml-2">必选</span>
                  )}
                </span>
                {item.isChecked && item.hasContent && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">已填写</Badge>
                )}
                {item.isChecked && !item.hasContent && (
                  <Badge variant="outline" className="border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400">未填写</Badge>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 选中内容的汇总 */}
      {selectedItems.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            已选择的内容汇总 ({selectedItems.length} 项)：
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {selectedItems.map((item) => (
              <div key={item.moduleId} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 未完成的选择警告 */}
      {incompleteSelections.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            需要完善的内容：
          </h3>
          <div className="space-y-4">
            {incompleteSelections.map((item) => (
              <div key={item.moduleId} className="bg-background rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">{item.title}</span>
                  <Badge variant="outline" className="border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400">未填写</Badge>
                </div>
                {item.missingFields.length > 0 && (
                  <div className="ml-8">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">缺少以下字段：</p>
                    <div className="grid grid-cols-2 gap-1">
                      {item.missingFields.map((field, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm">
                          <div className="w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-800 dark:text-yellow-200">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">
            请返回相应模块完善内容，或取消勾选不需要的模块。
          </p>
        </div>
      )}

      {/* 生成按钮 */}
      <div className="flex justify-center pt-6">
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 px-8 py-3"
          disabled={!canGenerate() || generationState.isGenerating}
          onClick={handleGenerate}
        >
          {generationState.isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              正在生成文书...
            </>
          ) : (
            <>
              生成文书 ({selectedItems.filter(item => item.hasContent).length} 项内容)
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
    </>
  );
}

function ResumeGeneratorContent() {
  const t = useTranslations();
  const [activeModule, setActiveModule] = useState("header");
  const { isModuleSelected, isModuleRequired, toggleModuleSelection, getCompletedModulesCount, getConfirmationData } = useResume();

  const modules: ResumeModule[] = [
    {
      id: "header",
      title: "个人背景",
      icon: HeaderIcon,
      component: HeaderModule,
    },
    {
      id: "education",
      title: "教育经历",
      icon: EducationIcon,
      component: EducationModule,
    },
    {
      id: "work-experience",
      title: "实习/工作经历",
      icon: WorkExperienceIcon,
      component: WorkExperienceModule,
    },
    {
      id: "research",
      title: "学术研究兴趣",
      icon: ResearchIcon,
      component: ResearchModule,
    },
    {
      id: "activities",
      title: "活动经历",
      icon: ActivitiesIcon,
      component: ActivitiesModule,
    },
    {
      id: "awards",
      title: "获奖情况",
      icon: AwardsIcon,
      component: AwardsModule,
    },
    {
      id: "skills-language",
      title: "技能语言",
      icon: SkillsLanguageIcon,
      component: SkillsLanguageModule,
    },
  ];

  // 添加确认页面到模块列表
  const allModules = [
    ...modules,
    {
      id: "confirmation",
      title: "确认页面",
      icon: CheckCircle,
      component: ConfirmationPage,
    }
  ];

  const activeModuleData = allModules.find(module => module.id === activeModule);
  const ActiveComponent = activeModuleData?.component || HeaderModule;

  // 获取选中模块的数量和总数
  const selectedCount = getConfirmationData().filter(item => item.isChecked && item.hasContent).length;
  const totalModules = modules.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">文书生成器</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                分模块填写您的信息，自由选择要包含的内容
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Module Navigation */}
          <div className="col-span-3">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-6">
                文书模块
              </h3>
              <div className="space-y-3">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const moduleKey = module.id === 'work-experience' ? 'workExperience' : 
                                   module.id === 'skills-language' ? 'skillsLanguage' : module.id;
                  const isSelected = isModuleSelected(moduleKey as any);
                  const isRequired = isModuleRequired(moduleKey as any);
                  
                  return (
                    <div key={module.id} className="group">
                      <button
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 relative ${
                          activeModule === module.id
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : isSelected
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                        onClick={() => setActiveModule(module.id)}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{module.title}</div>
                          {isRequired && (
                            <div className="text-xs text-red-500 font-medium"></div>
                          )}
                        </div>
                        
                        {/* 集成的选择按钮 */}
                        <button
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isRequired 
                              ? "bg-gray-100 text-red-300 cursor-not-allowed" 
                              : isSelected 
                              ? "bg-primary text-primary-foreground shadow-sm hover:scale-110" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-110"
                          } ${activeModule === module.id && !isRequired ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isRequired) {
                              toggleModuleSelection(moduleKey as any);
                            }
                          }}
                          disabled={isRequired}
                          title={isRequired ? "此模块为必选，无法取消" : undefined}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </button>
                    </div>
                  );
                })}
                
                {/* 确认页面按钮 */}
                <div className="pt-6 border-t border-border mt-6">
                  <button
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      activeModule === "confirmation"
                        ? "bg-secondary text-secondary-foreground shadow-lg"
                        : "bg-gradient-to-r from-secondary/20 to-secondary/10 text-foreground hover:from-secondary/30 hover:to-secondary/20"
                    }`}
                    onClick={() => setActiveModule("confirmation")}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">确认并生成文书</div>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-60" />
                  </button>
                </div>
              </div>

              {/* Progress Summary */}
              {/* <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">整体进度</span>
                  <span className="text-sm font-semibold text-primary">
                    {selectedCount}/{totalModules}
                  </span>
                </div>
                <Progress 
                  value={(selectedCount / totalModules) * 100} 
                  className="h-2.5"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>已完成模块</span>
                  <span>{Math.round((selectedCount / totalModules) * 100)}%</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm min-h-[600px]">
              <div className="flex items-center gap-4 mb-8">
                {activeModuleData && (
                  <>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeModule === "confirmation" ? "bg-secondary/20" : "bg-primary/20"
                    }`}>
                      <activeModuleData.icon className={`w-5 h-5 ${
                        activeModule === "confirmation" ? "text-secondary" : "text-primary"
                      }`} />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">{activeModuleData.title}</h2>
                  </>
                )}
              </div>
              
              {/* Active Module Component */}
              <div className="min-h-[400px]">
                <ActiveComponent />
              </div>

              {/* Module Navigation Footer - 只在非确认页面显示 */}
              {activeModule !== "confirmation" && (
                <div className="flex justify-between pt-8 mt-8 border-t border-border">
                  <Button
                    variant="outline"
                    className="bg-background hover:bg-muted"
                    onClick={() => {
                      const currentIndex = modules.findIndex(m => m.id === activeModule);
                      if (currentIndex > 0) {
                        setActiveModule(modules[currentIndex - 1].id);
                      }
                    }}
                    disabled={modules.findIndex(m => m.id === activeModule) === 0}
                  >
                    上一步
                  </Button>
                  
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      const currentIndex = modules.findIndex(m => m.id === activeModule);
                      if (currentIndex < modules.length - 1) {
                        setActiveModule(modules[currentIndex + 1].id);
                      } else {
                        // 最后一个模块，跳转到确认页面
                        setActiveModule("confirmation");
                      }
                    }}
                  >
                    {modules.findIndex(m => m.id === activeModule) === modules.length - 1
                      ? "确认内容"
                      : "下一步"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeGeneratorClient() {
  return (
    <ResumeProvider>
      <ResumeGeneratorContent />
    </ResumeProvider>
  );
} 