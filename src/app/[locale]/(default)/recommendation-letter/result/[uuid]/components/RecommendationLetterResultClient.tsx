"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Edit3,
  Eye,
  Edit,
  Loader2,
  Bot,
  Zap,
  Stars,
  GitCompare,
  Wand2
} from "lucide-react";
import Markdown from "@/components/markdown";
import { toast } from "sonner";
import MarkdownEditor from "@/components/blocks/mdeditor";

// Import context and modules
import { RecommendationLetterProvider, useRecommendationLetter } from "../../../components/RecommendationLetterContext";
import BasicInfoModule from "../../../components/modules/BasicInfoModule";
import RelationshipBackgroundModule from "../../../components/modules/RelationshipBackgroundModule";
import AbilityDemonstrationModule from "../../../components/modules/AbilityDemonstrationModule";
import FinalRecommendationModule from "../../../components/modules/FinalRecommendationModule";

// Import SVG icons
import BasicInfoIcon from "../../../components/icons/BasicInfoIcon";
import RelationshipBackgroundIcon from "../../../components/icons/RelationshipBackgroundIcon";
import AbilityDemonstrationIcon from "../../../components/icons/AbilityDemonstrationIcon";
import FinalRecommendationIcon from "../../../components/icons/FinalRecommendationIcon";

// Import Dify Hooks
import { useDify } from '@/hooks/useDify';
import { useDifyRevise } from '@/hooks/useDifyRevise';

// Import revision components
import RevisionModal from "../../../components/RevisionModal";
import FullRevisionModal from "../../../components/FullRevisionModal";
import ParagraphRevision from "../../../components/ParagraphRevision";
import VersionComparison from "../../../components/VersionComparison";

export interface RecommendationLetterModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// AI生成Loading组件
const AIGeneratingLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
  const steps = [
    { icon: Bot, text: "分析您的推荐信内容...", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Zap, text: "运用AI智能生成技术...", color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
    { icon: Stars, text: "优化推荐信结构和语言...", color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { icon: FileText, text: "完成推荐信生成...", color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 生成粒子效果
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 relative overflow-hidden">
      {/* 背景粒子 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
      
      {/* 主要动画区域 */}
      <div className="relative">
        {/* 外圈发光旋转 */}
        <div className="w-40 h-40 border-4 border-primary/20 rounded-full animate-spin loading-glow">
          <div className="absolute top-2 left-2 w-5 h-5 bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-lg"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
        </div>
        
        {/* 中圈脉动 */}
        <div className="absolute inset-6 border-2 border-primary/30 rounded-full animate-pulse"></div>
        
        {/* 中心图标区域 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/20 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary animate-pulse drop-shadow-lg" />
            </div>
          </div>
        </div>
        
        {/* 内圈反向旋转 */}
        <div className="absolute inset-8 border-2 border-primary/40 rounded-full animate-spin-reverse">
          <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full shadow-lg"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
        </div>
        
        {/* 装饰性光环 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-spin" style={{animationDuration: '3s'}}></div>
      </div>

      {/* 步骤指示器 */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 transform ${
                  isActive 
                    ? `${step.bgColor} ${step.color} scale-110 shadow-lg` 
                    : isCompleted 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 scale-105" 
                      : "bg-muted text-muted-foreground hover:scale-105"
                }`}
              >
                <Icon className={`w-7 h-7 ${isActive ? 'animate-pulse' : ''} ${isCompleted ? 'animate-bounce' : ''}`} />
                {isActive && (
                  <div className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-ping"></div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="h-20 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className={`text-xl font-semibold transition-all duration-500 ${steps[currentStep].color} animate-in fade-in zoom-in-95`}>
              {steps[currentStep].text}
            </p>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-2000 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-base font-medium">AI正在为您精心打造专业推荐信</span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground/80">
          这通常需要15-30秒，请耐心等待
        </p>
        
        {/* 跳动的点 */}
        <div className="flex items-center justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

// 生成默认占位符内容
const generatePlaceholderContent = () => {
  return "请填写推荐信信息后点击「重新生成推荐信」按钮来生成专业的推荐信内容。";
};

interface RecommendationLetterResultContentProps {
  documentUuid: string;
}

function RecommendationLetterResultContent({ documentUuid }: RecommendationLetterResultContentProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale || 'zh';
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  
  // 调试日志
  console.log('RecommendationLetterResultContent - documentUuid:', documentUuid);
  
  const { 
    data, 
    generationState,
    isModuleSelected, 
    toggleModuleSelection,
    updateBasicInfoData,
    updateRelationshipBackgroundData,
    updateAbilityDemonstrationData,
    updateFinalRecommendationData,
    getSelectedData,
    setGenerationLoading,
    setGenerationError,
    updateGeneratedContent,
    startWorkflowStatusPolling,
    setWorkflowIds,
    loadFromCache,
    // 保留 hasUsedFreeRevision 因为它用于本地缓存备用
    hasUsedFreeRevision
  } = useRecommendationLetter();
  
  // 修改相关状态
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showFullRevisionModal, setShowFullRevisionModal] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [serverRevisionStatus, setServerRevisionStatus] = useState<boolean | null>(null);
  
  // 版本历史状态（从数据库加载）
  const [dbVersions, setDbVersions] = useState<any[]>([]);
  const [currentDbVersionId, setCurrentDbVersionId] = useState<string | null>(null);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [hasLoadedVersions, setHasLoadedVersions] = useState(false);
  
  // 段落高亮状态
  const [highlightedParagraphIndex, setHighlightedParagraphIndex] = useState<number | null>(null);

  // Dify Hooks for API calls
  const { runWorkflow } = useDify({ functionType: 'recommendation-letter' });
  const { runRevision, isRevising } = useDifyRevise();

  // 使用数据库版本内容或 Context 中的生成内容，如果没有则使用占位符
  const getCurrentDbVersion = () => {
    if (currentDbVersionId && dbVersions.length > 0) {
      const version = dbVersions.find(v => v.uuid === currentDbVersionId);
      return version?.content || generationState.generatedContent || generatePlaceholderContent();
    }
    return generationState.generatedContent || generatePlaceholderContent();
  };
  
  const displayContent = getCurrentDbVersion();
  


  const modules: RecommendationLetterModule[] = [
    {
      id: "basicInfo",
      title: "基本信息",
      icon: BasicInfoIcon,
      component: BasicInfoModule,
    },
    {
      id: "relationshipBackground",
      title: "相识背景",
      icon: RelationshipBackgroundIcon,
      component: RelationshipBackgroundModule,
    },
    {
      id: "abilityDemonstration",
      title: "能力展示",
      icon: AbilityDemonstrationIcon,
      component: AbilityDemonstrationModule,
    },
    {
      id: "finalRecommendation",
      title: "总结推荐",
      icon: FinalRecommendationIcon,
      component: FinalRecommendationModule,
    },
  ];

  // 加载文档版本历史 - 移到外部作为普通函数
  const loadDocumentVersions = async () => {
    // 如果没有 documentUuid，不要尝试加载
    if (!documentUuid) {
      return;
    }
    
    setIsLoadingVersions(true);
    try {
      const response = await fetch(`/api/documents/${documentUuid}/versions`);
      if (response.ok) {
        const { data } = await response.json();
        setDbVersions(data.versions || []);
        
        // 如果有版本，设置当前版本
        if (data.versions && data.versions.length > 0) {
          // 如果还没有设置当前版本ID，默认选择原始版本
          if (!currentDbVersionId) {
            // 查找原始版本
            const originalVersion = data.versions.find((v: any) => v.version_type === 'original');
            const versionToSet = originalVersion || data.versions[0]; // 如果没有原始版本，使用第一个版本
            setCurrentDbVersionId(versionToSet.uuid);
            
            // 更新本地内容为选中版本的内容
            if (versionToSet.content) {
              updateGeneratedContent(versionToSet.content);
              setHasLoadedVersions(true); // 标记已加载
            }
          } else {
            // 如果已经有当前版本ID，保持不变，只更新内容
            const currentVersion = data.versions.find((v: any) => v.uuid === currentDbVersionId);
            if (currentVersion?.content) {
              updateGeneratedContent(currentVersion.content);
              setHasLoadedVersions(true); // 标记已加载
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading document versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    console.log('handleGenerate called');
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      // 获取选中模块的数据
      const selectedData = getSelectedData();
      console.log('Selected data for generation:', selectedData);

      // 确保 Loading 动画至少显示 2 秒
      const [result] = await Promise.all([
        runWorkflow({
          inputs: selectedData,
          response_mode: 'blocking',
          user: 'recommendation-letter-user'
        }),
        new Promise(resolve => setTimeout(resolve, 2000)) // 最少显示 2 秒
      ]);

      console.log('API response:', result);

      // 从返回结果中提取生成的推荐信内容
      // API返回结构: { code: 0, message: "ok", data: { data: { outputs: { text: "..." } } } }
      const generatedContent = (result as any).data?.data?.outputs?.text || 
                             (result as any).data?.outputs?.text || 
                             (result as any).outputs?.text || 
                             "推荐信生成失败，请重试";

      updateGeneratedContent(generatedContent);
      
      // 更新数据库中的文档内容
      try {
        const updateResponse = await fetch('/api/documents', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: documentUuid,
            content: generatedContent,
            ai_workflow_id: (result as any).workflow_run_id,
            word_count: generatedContent.length.toString()
          }),
        });

        if (!updateResponse.ok) {
          console.error('Failed to update document in database');
        } else {
          // 更新成功后，重新加载版本历史
          await loadDocumentVersions();
        }
      } catch (updateError) {
        console.error('Error updating document:', updateError);
      }
      
      toast.success("推荐信已生成！");

    } catch (error) {
      console.error('生成推荐信失败:', error);
      const errorMessage = error instanceof Error ? error.message : '生成失败，请重试';
      
      setGenerationError(errorMessage);
      toast.error(`API 调用失败: ${errorMessage}`);
      
    } finally {
      setGenerationLoading(false);
    }
  }, [getSelectedData, runWorkflow, updateGeneratedContent, setGenerationLoading, setGenerationError, documentUuid]);

  // 页面加载时的初始化逻辑
  useEffect(() => {
    // 先尝试从缓存加载数据
    loadFromCache();
    
    // 检查文档的修改状态
    const checkRevisionStatus = async () => {
      // 如果没有 documentUuid，不要尝试检查
      if (!documentUuid) {
        return;
      }
      
      try {
        const response = await fetch(`/api/documents/${documentUuid}/revisions`);
        if (response.ok) {
          const { data } = await response.json();
          setServerRevisionStatus(data.has_used_free_revision);
        }
      } catch (error) {
        console.error('Error checking revision status:', error);
      }
    };
    
    checkRevisionStatus();
  }, [documentUuid]); // 当documentUuid变化时重新执行
  
  // 单独的 useEffect 来加载版本历史，避免无限循环
  useEffect(() => {
    // 如果没有 documentUuid，不要尝试加载
    if (!documentUuid) {
      return;
    }
    
    let isCancelled = false;
    
    const loadVersions = async () => {
      setIsLoadingVersions(true);
      try {
        const response = await fetch(`/api/documents/${documentUuid}/versions`);
        if (!isCancelled && response.ok) {
          const { data } = await response.json();
          setDbVersions(data.versions || []);
          
          // 如果有版本，设置当前版本
          if (data.versions && data.versions.length > 0) {
            // 如果还没有设置当前版本ID，默认选择原始版本
            if (!currentDbVersionId) {
              // 查找原始版本
              const originalVersion = data.versions.find((v: any) => v.version_type === 'original');
              const versionToSet = originalVersion || data.versions[0]; // 如果没有原始版本，使用第一个版本
              setCurrentDbVersionId(versionToSet.uuid);
              
              // 只在第一次加载时更新内容，避免循环
              if (!hasLoadedVersions && versionToSet.content) {
                updateGeneratedContent(versionToSet.content);
                setHasLoadedVersions(true);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading document versions:', error);
      } finally {
        if (!isCancelled) {
          setIsLoadingVersions(false);
        }
      }
    };
    
    loadVersions();
    
    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [documentUuid]); // 只依赖 documentUuid
  
  // 监听数据加载完成后自动生成
  useEffect(() => {
    // 检查URL参数，如果有autoGenerate=true，自动开始生成
    const urlParams = new URLSearchParams(window.location.search);
    const shouldAutoGenerate = urlParams.get('autoGenerate') === 'true';
    
    // 确保有数据后再自动生成
    // 检查是否有选中的模块，而不是检查具体的字段
    const hasSelectedModules = Object.values(data.moduleSelection).some(selected => selected);
    // 检查是否有基本信息数据
    const hasBasicInfo = data.basicInfo.student_full_name || data.basicInfo.recommender_name;
    
    console.log('Auto-generate check:', {
      shouldAutoGenerate,
      isGenerating: generationState.isGenerating,
      hasGeneratedContent: !!generationState.generatedContent,
      hasSelectedModules,
      hasBasicInfo,
      moduleSelection: data.moduleSelection,
      basicInfo: data.basicInfo
    });
    
    if (shouldAutoGenerate && !generationState.isGenerating && !generationState.generatedContent && hasSelectedModules && hasBasicInfo) {
      console.log('Auto-generating recommendation letter...');
      // 自动开始生成
      handleGenerate();
      // 清理URL参数
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [data.moduleSelection, data.basicInfo, generationState.isGenerating, generationState.generatedContent, handleGenerate]);
  
  // 处理生成状态和内容
  useEffect(() => {
    // 如果正在生成中，且有workflow ID，开始轮询
    if (generationState.isGenerating && generationState.workflowRunId) {
      startWorkflowStatusPolling();
    }
    
    // 如果没有生成内容且不在生成中，生成占位符内容
    if (!generationState.generatedContent && !generationState.isGenerating) {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldAutoGenerate = urlParams.get('autoGenerate') === 'true';
      
      console.log('Placeholder check:', {
        hasGeneratedContent: !!generationState.generatedContent,
        isGenerating: generationState.isGenerating,
        shouldAutoGenerate
      });
      
      if (!shouldAutoGenerate) {
        const generated = generatePlaceholderContent();
        updateGeneratedContent(generated);
      }
    }
  }, [generationState, updateGeneratedContent, startWorkflowStatusPolling]);

  // 监听生成状态变化，显示成功提示
  useEffect(() => {
    if (generationState.workflowStatus === 'succeeded' && generationState.generatedContent) {
      toast.success('推荐信生成成功！');
    } else if (generationState.workflowStatus === 'failed') {
      toast.error('推荐信生成失败，请重试');
    }
  }, [generationState.workflowStatus, generationState.generatedContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayContent);
      toast.success("内容已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  const handleExport = () => {
    const blob = new Blob([displayContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendation-letter-${data.basicInfo.student_full_name || 'student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("推荐信已导出");
  };

  const handleSave = () => {
    // 这里可以实现保存到数据库的逻辑
    localStorage.setItem('saved-recommendation-letter', displayContent);
    toast.success("推荐信已保存");
  };

  const handleMarkdownChange = (value: string) => {
    updateGeneratedContent(value);
  };
  
  // 修改功能处理函数
  const handleRevisionClick = () => {
    // 优先使用服务器数据，如果没有则使用本地缓存
    const hasUsed = serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision();
    if (hasUsed) {
      toast.error("您已经使用过免费修改机会");
      return;
    }
    setShowRevisionModal(true);
  };
  
  const handleContinueRevision = () => {
    setShowRevisionModal(false);
    setShowFullRevisionModal(true);
  };
  
  const handleBackToEdit = () => {
    setShowRevisionModal(false);
    // 返回编辑页面
    window.location.href = `/${locale}/recommendation-letter`;
  };
  
  const handleFullRevision = async (settings: any) => {
    setShowFullRevisionModal(false);
    setGenerationLoading(true);
    
    try {
      // 获取语言设置
      const selectedData = getSelectedData();
      
      // 风格选项定义（与 FullRevisionModal 中的一致）
      const STYLE_OPTIONS = [
        { value: 'concise', label: '更精炼' },
        { value: 'formal', label: '更正式' },
        { value: 'logical', label: '更有逻辑' },
        { value: 'emotional', label: '更感性' },
        { value: 'persuasive', label: '更有说服力' },
        { value: 'academic', label: '更学术' },
        { value: 'approachable', label: '更亲切' },
        { value: 'humanized', label: '更人性化' },
        { value: 'clarity', label: '更清晰' },
      ];
      
      // 将风格值转换为中文标签
      const styleLabels = settings.styles?.map((styleValue: string) => {
        const option = STYLE_OPTIONS.find(opt => opt.value === styleValue);
        return option ? option.label : styleValue;
      }) || [];
      
      // 调用 DIFY API 进行全文重写
      const params = {
        revise_type: (settings.wordControl === 'keep' ? 0 : (settings.wordControl === 'expand' ? 1 : 2)).toString(),
        style: styleLabels.join(';'), // 使用分号拼接中文标签
        original_word_count: displayContent.length.toString(),
        word_count: (settings.targetWordCount || displayContent.length).toString(),
        detail: settings.direction || '',
        original_context: displayContent,
        whole: '0', // 整篇重写
        language: selectedData.language || 'zh' // 添加语言参数
      };
      
      const revisedContent = await runRevision(params);
      
      // 创建修改版本并保存到数据库
      const response = await fetch(`/api/documents/${documentUuid}/revisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: revisedContent,
          revision_settings: settings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create revision');
      }

      const { data: revision } = await response.json();
      
      // 不再添加到本地状态，而是重新加载版本历史
      
      // 更新服务器修改状态
      setServerRevisionStatus(true);
      
      // 先设置新版本ID，再加载版本历史
      if (revision.uuid) {
        setCurrentDbVersionId(revision.uuid);
      }
      
      // 重新加载版本历史
      await loadDocumentVersions();
      
      toast.success("推荐信已成功修改！");
    } catch (error) {
      toast.error("修改失败，请重试");
      setGenerationError("修改失败");
    } finally {
      setGenerationLoading(false);
    }
  };
  
  const handleParagraphRevise = async (index: number, newText: string) => {
    // 处理段落修改
    const paragraphs = displayContent.split('\n\n');
    paragraphs[index] = newText;
    const newContent = paragraphs.join('\n\n');
    
    try {
      // 创建修改版本并保存到数据库
      const response = await fetch(`/api/documents/${documentUuid}/revisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          revision_settings: {
            type: 'paragraph',
            paragraphIndex: index
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save paragraph revision');
      }

      const { data: revision } = await response.json();
      
      // 更新服务器修改状态
      setServerRevisionStatus(true);
      
      // 先设置新版本ID，再加载版本历史
      if (revision.uuid) {
        setCurrentDbVersionId(revision.uuid);
      }
      
      // 重新加载版本历史
      await loadDocumentVersions();
      
      toast.success("段落已成功修改！");
    } catch (error) {
      console.error('Error saving paragraph revision:', error);
      toast.error("保存段落修改失败");
      // 如果保存失败，仍然更新本地内容
      updateGeneratedContent(newContent);
    }
  };
  
  // 段落重写 API 调用
  const handleParagraphRevisionAPI = async (params: any) => {
    try {
      // 获取语言设置
      const selectedData = getSelectedData();
      
      // 添加语言参数
      const paramsWithLanguage = {
        ...params,
        language: selectedData.language || 'zh'
      };
      
      const revisedContent = await runRevision(paramsWithLanguage);
      return revisedContent;
    } catch (error) {
      console.error('Paragraph revision failed:', error);
      toast.error('段落重写失败，请重试');
      throw error;
    }
  };

  const getModuleKey = (moduleId: string) => {
    if (moduleId === 'relationshipBackground') return 'relationshipBackground';
    if (moduleId === 'abilityDemonstration') return 'abilityDemonstration';
    if (moduleId === 'finalRecommendation') return 'finalRecommendation';
    return moduleId;
  };

  const currentModule = modules.find(m => m.id === activeTab);
  const ActiveComponent = currentModule?.component || BasicInfoModule;

  return (<>
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
                <h1 className="text-3xl font-bold text-foreground">推荐信生成结果</h1>
                <p className="text-muted-foreground text-base">
                  编辑内容并导出您的推荐信
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {generationState.isGenerating ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  正在生成
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已生成
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Sidebar - Module Navigation (Read-only) */}
          <div className="col-span-2 lg:col-span-3 xl:col-span-2">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-sm h-full">
              <h3 className="font-semibold text-sm lg:text-base text-muted-foreground uppercase tracking-wide mb-3 lg:mb-4">
                内容模块
              </h3>
              <div className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const moduleKey = getModuleKey(module.id);
                  const isSelected = isModuleSelected(moduleKey as any);
                  const isActive = activeTab === module.id;
                  
                  return (
                    <div key={module.id} className="group">
                      <button
                        className={`w-full flex items-center gap-2 lg:gap-2.5 xl:gap-3 p-2.5 lg:p-3 xl:p-4 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary/10 border-2 border-primary" 
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => setActiveTab(module.id)}
                      >
                        <div className={`p-1.5 lg:p-2 rounded ${
                          isSelected 
                            ? "text-primary" 
                            : "text-muted-foreground"
                        }`}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                          ) : (
                            <Square className="w-4 h-4 lg:w-5 lg:h-5" />
                          )}
                        </div>
                        <Icon className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span className={`text-xs lg:text-sm xl:text-base font-medium flex-1 text-left whitespace-nowrap ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {module.title}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* 提示信息 */}
              <div className="mt-4 lg:mt-6 p-2.5 lg:p-3 bg-muted/30 rounded-lg">
                <p className="text-xs lg:text-sm text-muted-foreground">
                  点击模块名称查看对应内容
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section - Form Content */}
          <div className="col-span-4 lg:col-span-3 xl:col-span-4">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm h-full flex flex-col">
              {/* Active Module Content (Read-only view) */}
              <div className="flex-1 p-6 overflow-y-auto">
                {currentModule && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <currentModule.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold text-foreground">
                        {currentModule.title}
                      </h3>
                    </div>
                    {/* 只读视图：显示填写的内容 */}
                    <div className="space-y-4 pointer-events-none opacity-80">
                      <ActiveComponent />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate/Modify Button */}
              <div className="border-t border-border p-6">
                {generationState.generatedContent && generationState.generatedContent !== generatePlaceholderContent() ? (
                  <Button
                    onClick={handleRevisionClick}
                    disabled={generationState.isGenerating || (serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision())}
                    className="w-full bg-primary hover:bg-primary/90 text-base py-3"
                    size="lg"
                  >
                    <Wand2 className="w-5 h-5 mr-3" />
                    修改
                    {(serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision()) && (
                      <Badge variant="secondary" className="ml-2">
                        已使用
                      </Badge>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={generationState.isGenerating}
                    className="w-full bg-primary hover:bg-primary/90 text-base py-3"
                    size="lg"
                  >
                    {generationState.isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        正在生成...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3" />
                        {generationState.generatedContent ? '重新生成推荐信' : '生成推荐信'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Generated Content */}
          <div className="col-span-6">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl shadow-sm h-full flex flex-col">
              {/* Header with Actions */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">结果</h3>
                    
                    {/* 版本切换器 */}
                    {dbVersions.length > 1 && (
                      <div className="flex items-center gap-2 ml-4">
                        <Label className="text-sm text-muted-foreground">版本：</Label>
                        <Select
                          value={currentDbVersionId || ''}
                          onValueChange={(value) => setCurrentDbVersionId(value)}
                          disabled={isLoadingVersions}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="选择版本" />
                          </SelectTrigger>
                          <SelectContent>
                            {dbVersions.map((version) => (
                              <SelectItem key={version.uuid} value={version.uuid}>
                                {version.version_type === 'original' ? '原始版本' : `修改版本 ${version.revision_count}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {dbVersions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowVersionComparison(!showVersionComparison)}
                            disabled={isLoadingVersions}
                          >
                            <GitCompare className="w-4 h-4 mr-1" />
                            对比
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {/* <Button
                      variant="outline"
                      size="default"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      disabled={generationState.isGenerating}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      {isPreviewMode ? (
                        <>
                          <Edit className="w-5 h-5 mr-2" />
                          编辑
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5 mr-2" />
                          预览
                        </>
                      )}
                    </Button> */}
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleCopy}
                      disabled={generationState.isGenerating}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      复制
                    </Button>
                    
 
                     
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleExport}
                      disabled={generationState.isGenerating}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="default"
                      onClick={handleSave}
                      disabled={generationState.isGenerating}
                      className="bg-background hover:bg-muted text-base px-4 py-2"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save
                    </Button> */}
                  </div>
                </div>
              </div>

              {/* Editable Content */}
              <div className="flex-1 p-4">
                {generationState.isGenerating ? (
                  <AIGeneratingLoader />
                ) : isPreviewMode ? (
                  <div className="w-full h-full min-h-[500px] overflow-y-auto prose prose-slate dark:prose-invert max-w-none">
                    {/* 如果开启了修改功能，显示可编辑的段落 */}
                    {!(serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision()) && generationState.generatedContent ? (
                      <div className="space-y-4">
                        {displayContent.split('\n\n').map((paragraph: string, index: number) => (
                          <ParagraphRevision
                            key={index}
                            paragraph={paragraph}
                            index={index}
                            onRevise={handleParagraphRevise}
                            isHighlighted={highlightedParagraphIndex === index}
                            onHighlightChange={(shouldHighlight) => {
                              setHighlightedParagraphIndex(shouldHighlight ? index : null);
                            }}
                            onStartRevision={handleParagraphRevisionAPI}
                            isRevising={isRevising}
                          />
                        ))}
                      </div>
                    ) : (
                      <Markdown content={displayContent} />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[500px]">
                    <MarkdownEditor
                      value={displayContent}
                      onChange={handleMarkdownChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* 修改相关弹窗 */}
    <RevisionModal
      isOpen={showRevisionModal}
      onClose={() => setShowRevisionModal(false)}
      onContinueRevision={handleContinueRevision}
      onBackToEdit={handleBackToEdit}
    />
    
    <FullRevisionModal
      isOpen={showFullRevisionModal}
      onClose={() => setShowFullRevisionModal(false)}
      onConfirm={handleFullRevision}
      currentWordCount={displayContent.length}
    />
    
    {/* 版本对比弹窗 */}
    {showVersionComparison && dbVersions.length > 1 && (
      <VersionComparison
        isOpen={showVersionComparison}
        onClose={() => setShowVersionComparison(false)}
        originalContent={dbVersions.find(v => v.version_type === 'original')?.content || ''}
        revisedContent={dbVersions.find(v => v.version_type === 'revised')?.content || displayContent}
      />
    )}
  </>);
}

interface RecommendationLetterResultClientProps {
  documentUuid: string;
}

export default function RecommendationLetterResultClient({ documentUuid }: RecommendationLetterResultClientProps) {
  return (
    <RecommendationLetterProvider>
      <RecommendationLetterResultContent documentUuid={documentUuid} />
    </RecommendationLetterProvider>
  );
} 