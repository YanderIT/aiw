"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Square, CheckSquare, ArrowRight, AlertTriangle, RefreshCw, Code2, Wand2 } from "lucide-react";
import { toast } from 'sonner';
import { GlobalLoading } from "@/components/ui/loading";
import { apiRequest } from '@/lib/api-client';

// Import context
import { CoverLetterProvider, useCoverLetter } from "./CoverLetterContext";

// Import module components
import BasicInfoModule from "./modules/BasicInfoModule";
import ApplicationBackgroundModule from "./modules/ApplicationBackgroundModule";
import ExperienceHistoryModule from "./modules/ExperienceHistoryModule";
import FitAndClosingModule from "./modules/FitAndClosingModule";

// Import SVG icons
import BasicInfoIcon from "./icons/BasicInfoIcon";
import ApplicationBackgroundIcon from "./icons/ApplicationBackgroundIcon";
import ExperienceHistoryIcon from "./icons/ExperienceHistoryIcon";
import FitAndClosingIcon from "./icons/FitAndClosingIcon";

export interface CoverLetterModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// 确认页面组件
function ConfirmationPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'zh';
  const { 
    getConfirmationData, 
    getIncompleteSelections, 
    canGenerate, 
    toggleModuleSelection,
    getSelectedData,
    generationState,
    setGenerationLoading,
    setGenerationError,
    saveToCache
  } = useCoverLetter();
  
  const confirmationData = getConfirmationData();
  const incompleteSelections = getIncompleteSelections();
  const selectedItems = confirmationData.filter(item => item.isChecked);

  // 获取所有可用的模块数据（包括选中和未选中的）
  const allModuleItems = confirmationData;

  // 处理模块ID映射
  const getModuleKey = (moduleId: string) => {
    if (moduleId === 'applicationBackground') return 'applicationBackground';
    if (moduleId === 'experienceHistory') return 'experienceHistory';
    if (moduleId === 'fitAndClosing') return 'fitAndClosing';
    return moduleId;
  };

  const handleGenerate = async () => {
    if (!canGenerate()) {
      toast.error('请完善必填信息后再生成求职信');
      return;
    }

    setGenerationLoading(true);
    setGenerationError(null);

    try {
      // 确保数据已保存到缓存
      saveToCache();
      
      // 先创建文档记录
      const selectedData = getSelectedData();
      const { data: document } = await apiRequest('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: 'cover_letter',
          title: `${selectedData.full_name || '用户'} - 求职信`,
          form_data: selectedData,
          language: 'zh'
        }),
      });

      if (!document) {
        throw new Error('Failed to create document');
      }
      
      // 跳转到结果页面，带上文档ID
      router.push(`/${locale}/cover-letter/result/${document.uuid}?autoGenerate=true`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('创建文档失败，请重试');
      setGenerationLoading(false);
      setGenerationError('创建文档失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">确认求职信内容</h2>
        <p className="text-muted-foreground">请确认您要包含在求职信中的内容，点击复选框可以切换选择</p>
      </div>

      {/* 所有模块的可选择列表 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
          求职信模块：
        </h3>
        <ul className="space-y-3">
          {allModuleItems.map((item) => {
            const moduleKey = getModuleKey(item.moduleId);
            return (
              <li key={item.moduleId} className="flex items-center gap-3 group">
                <button
                  className={`p-1 rounded-md transition-all duration-200 hover:scale-110 ${
                    item.isChecked 
                      ? "text-primary hover:text-primary/80" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => toggleModuleSelection(moduleKey as any)}
                >
                  {item.isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-foreground flex-1 ${item.isChecked ? 'font-medium' : ''}`}>
                  {item.title}
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

      {/* 错误提示 */}
      {generationState.error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-200">
            {generationState.error}
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
              正在生成求职信...
            </>
          ) : (
            <>
              生成求职信 ({selectedItems.filter(item => item.hasContent).length} 项内容)
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function CoverLetterGeneratorContent() {
  const t = useTranslations();
  const [activeModule, setActiveModule] = useState("basicInfo");
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const { isModuleSelected, toggleModuleSelection, getCompletedModulesCount, getConfirmationData, generationState, fillMockData, saveToCache } = useCoverLetter();
  
  // Auto-show dev mode in development environment
  const isDevEnvironment = process.env.NODE_ENV === 'development';

  // 检测键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D 显示开发模式
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDevMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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

  // 计算进度
  const totalModules = modules.length;
  const completedModules = getCompletedModulesCount();
  const progress = (completedModules / totalModules) * 100;

  const currentModuleIndex = modules.findIndex(m => m.id === activeModule);
  const currentModule = modules[currentModuleIndex];

  const goToNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setActiveModule(modules[currentModuleIndex + 1].id);
    } else {
      setActiveModule("confirmation");
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      setActiveModule(modules[currentModuleIndex - 1].id);
    }
  };

  // 将确认页面包含在模块数组中，保持布局一致性
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
  const ActiveComponent = activeModuleData?.component || BasicInfoModule;

  return (
    <>
      <GlobalLoading isVisible={generationState.isGenerating} />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">求职信生成器</h1>
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
              
              {/* 开发模式控制 - 在开发环境中默认显示 */}
              {(showDevMode || isDevEnvironment) && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">开发者工具</span>
                    </div>
                    {!isDevEnvironment && (
                      <button
                        onClick={() => setShowDevMode(false)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  {/* 在开发环境中直接显示填充按钮 */}
                  {isDevEnvironment ? (
                    <Button
                      onClick={() => {
                        fillMockData();
                        toast.success('测试数据已填充');
                        saveToCache();
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full gap-2 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700"
                    >
                      <Wand2 className="w-3 h-3" />
                      一键填充测试数据
                    </Button>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">开发模式</span>
                        <button
                          onClick={() => setIsDevelopmentMode(!isDevelopmentMode)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isDevelopmentMode ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`${
                              isDevelopmentMode ? 'translate-x-5' : 'translate-x-1'
                            } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>
                      
                      {/* 一键填充按钮 */}
                      {isDevelopmentMode && (
                        <Button
                          onClick={() => {
                            fillMockData();
                            toast.success('测试数据已填充');
                            saveToCache();
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Wand2 className="w-3 h-3" />
                          一键填充测试数据
                        </Button>
                      )}
                    </>
                  )}
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isDevEnvironment 
                      ? '开发环境：点击按钮填充测试数据' 
                      : '提示：使用 Ctrl/Cmd + Shift + D 可以快速切换开发者工具'}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const moduleKey = module.id === 'applicationBackground' ? 'applicationBackground' : 
                                   module.id === 'experienceHistory' ? 'experienceHistory' : 
                                   module.id === 'fitAndClosing' ? 'fitAndClosing' : module.id;
                  const isSelected = isModuleSelected(moduleKey as any);
                  
                  return (
                    <div key={module.id} className="group">
                      <div
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 relative cursor-pointer ${
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
                        </div>
                        
                        {/* 集成的选择按钮 */}
                        <button
                          className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          } ${activeModule === module.id ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModuleSelection(moduleKey as any);
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
                      <div className="font-medium text-sm">确认并生成求职信</div>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-60" />
                  </button>
                </div>
              </div>
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
                    onClick={goToPreviousModule}
                    disabled={currentModuleIndex === 0}
                  >
                    上一步
                  </Button>
                  
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={goToNextModule}
                  >
                    {currentModuleIndex === modules.length - 1 ? "确认内容" : "下一步"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function CoverLetterGeneratorClient() {
  return (
    <CoverLetterProvider>
      <CoverLetterGeneratorContent />
    </CoverLetterProvider>
  );
} 