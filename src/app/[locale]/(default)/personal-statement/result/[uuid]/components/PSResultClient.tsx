"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Download, 
  Save, 
  RefreshCw, 
  Edit3,
  Eye,
  Loader2,
  CheckCircle,
  FileText,
  Bot,
  Zap,
  Stars,
  Wand2,
  ChevronDown,
  Undo2,
  Redo2
} from "lucide-react";
import Markdown from "@/components/markdown";
import MarkdownEditor from "@/components/blocks/mdeditor";
import { toast } from "sonner";
import { PSProvider, usePS } from "../../../components/PSContext";
import { useDify } from '@/hooks/useDify';
import { useDifyRevisePS } from '@/hooks/useDifyRevisePS';
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevisionModal from "../../../components/RevisionModal";
import FullRevisionModal, { RevisionSettings } from "../../../components/FullRevisionModal";
import ParagraphRevision from "../../../components/ParagraphRevision";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// AI生成Loading组件
const AIGeneratingLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Bot, text: "分析您的SOP内容...", color: "text-blue-500" },
    { icon: Zap, text: "运用AI智能生成技术...", color: "text-yellow-500" },
    { icon: Stars, text: "优化SOP结构和语言...", color: "text-purple-500" },
    { icon: FileText, text: "完成SOP生成...", color: "text-green-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-primary/20 rounded-full animate-spin">
          <div className="absolute top-2 left-2 w-4 h-4 bg-primary rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            return (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  isActive ? 'scale-125' : 'scale-100 opacity-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${step.color}`} />
              </div>
            );
          })}
        </div>
        <p className="text-lg font-medium text-foreground animate-pulse">
          {steps[currentStep].text}
        </p>
        <p className="text-sm text-muted-foreground">
          请稍候，AI正在为您生成专业的个人陈述...
        </p>
      </div>
    </div>
  );
};

function PSResultContent({ documentUuid }: { documentUuid: string }) {
  const params = useParams();
  const locale = params.locale || 'zh';
  
  const { 
    data,
    updateData,
    generationState,
    updateGeneratedContent,
    setGenerationLoading,
    setGenerationError,
    setLanguagePreference,
    loadFromCache,
    getFormData
  } = usePS();

  const { runWorkflow } = useDify({ functionType: 'personal-statement' });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(''); // 仅用于编辑模式
  
  // 修改相关状态
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showFullRevisionModal, setShowFullRevisionModal] = useState(false);
  const [serverRevisionStatus, setServerRevisionStatus] = useState<boolean | null>(null);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [versions, setVersions] = useState<any[]>([]);
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  
  const { runRevision, isRevising } = useDifyRevisePS();
  
  // 使用计算属性获取显示内容 - 根据当前版本选择内容
  const displayContent = currentVersion > 1 && versions.length > 0 
    ? versions.find(v => v.version === currentVersion)?.content || generationState.generatedContent || ''
    : generationState.generatedContent || '';

  // 生成SOP
  const handleGenerate = useCallback(async () => {
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      // 直接使用 data 而不是 getFormData()
      const difyInputs = {
        count: '800',  // 字数要求
        language: generationState.languagePreference || 'English',  // 语言字段
        username: 'User',  // 用户名字段
        target: data.target || '',
        education: data.education || '',
        skill: data.skill || '',
        research: data.research || '',
        workExperience: data.workExperience || '',
        reason: data.reason || ''
      };


      // 确保Loading动画至少显示2秒
      const [result] = await Promise.all([
        runWorkflow({
          inputs: difyInputs,
          response_mode: 'blocking',
          user: 'sop-user'
        }),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);


      // 提取生成的内容 - useDify 已经解包了响应
      // Dify原始响应格式: { workflow_run_id: "...", task_id: "...", data: { outputs: { text: "..." } } }
      let generatedContent = (result as any).data?.outputs?.text || 
                            (result as any).outputs?.text || 
                            '';
      
      // 只有在完全没有内容时才显示错误信息
      if (!generatedContent || generatedContent.trim() === '') {
        generatedContent = "个人陈述生成失败，请重试";
      }
      
      // 确保内容被正确更新
      if (generatedContent && generatedContent !== "SOP生成失败，请重试") {
        updateGeneratedContent(generatedContent);
      }
      
      // 总是关闭加载状态
      setIsInitialLoading(false);
      setGenerationLoading(false);
      
      // 更新数据库中的文档
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
        }
      } catch (updateError) {
        console.error('Error updating document:', updateError);
      }
      
      toast.success("个人陈述已成功生成！");
      // 不要再设置 setHasGenerated(true)，避免循环

    } catch (error) {
      console.error('生成SOP失败:', error);
      const errorMessage = error instanceof Error ? error.message : '生成失败，请重试';
      setGenerationError(errorMessage);
      toast.error(`生成失败: ${errorMessage}`);
    } finally {
      setGenerationLoading(false);
      setIsInitialLoading(false);  // 关闭初始加载状态
    }
  }, [documentUuid, data, generationState.languagePreference, runWorkflow, updateGeneratedContent, setGenerationLoading, setGenerationError]); // eslint-disable-line react-hooks/exhaustive-deps

  // 检查修改状态
  const checkRevisionStatus = async () => {
    try {
      const response = await fetch(`/api/documents/${documentUuid}/revisions`);
      if (response.ok) {
        const result = await response.json();
        setServerRevisionStatus(result.data?.has_used_free_revision || false);
      }
    } catch (error) {
      console.error('Error checking revision status:', error);
    }
  };

  // 加载文档版本
  const loadVersions = async () => {
    try {
      const response = await fetch(`/api/documents/${documentUuid}/versions`);
      if (response.ok) {
        const result = await response.json();
        setVersions(result.data || []);
      }
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  // 页面加载时处理
  useEffect(() => {
    if (!documentUuid) {
      setIsInitialLoading(false);
      return;
    }
    
    const initPage = async () => {
      // 从缓存加载数据
      loadFromCache();
      
      // 检查修改状态和加载版本
      await checkRevisionStatus();
      await loadVersions();
      
      let hasLoadedData = false;
      
      // 从数据库加载文档数据
      try {
        const response = await fetch(`/api/documents/${documentUuid}`);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.data?.form_data) {
            // 更新Context中的数据（排除language字段，它是单独管理的）
            const { language, ...formFields } = result.data.form_data;
            updateData(formFields);
            
            // 如果有语言设置，更新语言偏好
            if (language) {
              setLanguagePreference(language as 'English' | 'Chinese');
            }
            
            hasLoadedData = true;
          }
          
          // 加载已保存的内容
          if (result.data?.content) {
            updateGeneratedContent(result.data.content);
          }
        }
      } catch (error) {
        console.error('Error loading document data:', error);
      }
      
      // 检查是否需要自动生成
      const urlParams = new URLSearchParams(window.location.search);
      const shouldAutoGenerate = urlParams.get('autoGenerate') === 'true';
      
      if (shouldAutoGenerate && !hasGenerated && !generationState.isGenerating && hasLoadedData) {
        // 清理URL参数
        window.history.replaceState({}, '', window.location.pathname);
        // 标记已生成，避免重复
        setHasGenerated(true);
      } else {
        // 如果不是自动生成，短暂延迟后关闭初始加载状态
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
      }
    };
    
    initPage();
  }, [documentUuid]); // 只依赖 documentUuid，避免无限循环

  // 监听数据变化，当数据加载完成且需要生成时触发
  useEffect(() => {
    // 只在标记为true且未在生成中且有数据时触发一次
    if (hasGenerated && !generationState.isGenerating && data.target) {
      setHasGenerated(false); // 立即重置标记，避免重复调用
      handleGenerate();
    }
  }, [hasGenerated, data.target, generationState.isGenerating, handleGenerate]); // 添加所有依赖

  // 编辑模式时同步内容
  useEffect(() => {
    if (isEditMode && generationState.generatedContent) {
      setEditingContent(generationState.generatedContent);
    }
  }, [isEditMode, generationState.generatedContent]);

  const handleCopy = async () => {
    const contentToCopy = isEditMode ? editingContent : displayContent;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      toast.success("内容已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  const handleExport = () => {
    const contentToExport = isEditMode ? editingContent : displayContent;
    const blob = new Blob([contentToExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-statement-${data.target || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("个人陈述已导出");
  };

  const handleSave = async () => {
    const contentToSave = isEditMode ? editingContent : displayContent;
    try {
      const updateResponse = await fetch('/api/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: documentUuid,
          content: contentToSave,
          word_count: contentToSave.length.toString()
        }),
      });

      if (updateResponse.ok) {
        toast.success("个人陈述已保存");
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error("保存失败，请重试");
    }
  };

  const handleMarkdownChange = (value: string) => {
    setEditingContent(value);
    updateGeneratedContent(value);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  // 修改功能处理函数
  const handleRevisionClick = () => {
    if (serverRevisionStatus) {
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
    // 返回编辑页面的逻辑
    window.location.href = `/personal-statement?edit=${documentUuid}`;
  };

  const handleFullRevision = async (settings: RevisionSettings) => {
    setShowFullRevisionModal(false);
    
    // 准备 API 参数
    const styleLabels = settings.styles.map(styleValue => {
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
      const option = STYLE_OPTIONS.find(opt => opt.value === styleValue);
      return option ? option.label : styleValue;
    });

    const params = {
      revise_type: settings.wordControl === 'keep' ? '0' : (settings.wordControl === 'expand' ? '1' : '2'),
      style: styleLabels.join(';'),
      original_word_count: displayContent.length.toString(),
      word_count: settings.targetWordCount?.toString() || displayContent.length.toString(),
      detail: settings.direction,
      original_context: displayContent,
      whole: '0', // 整篇重写
      language: generationState.languagePreference || 'Chinese'
    };

    try {
      const revisedContent = await runRevision(params);
      
      if (revisedContent) {
        // 创建修改版本
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

        if (response.ok) {
          const result = await response.json();
          updateGeneratedContent(revisedContent);
          setCurrentVersion(result.data.version || 2);
          await loadVersions();
          await checkRevisionStatus();
          toast.success("个人陈述修改成功！");
        } else {
          if (response.status === 403) {
            toast.error("您已经使用过免费修改机会");
            setServerRevisionStatus(true);
          } else {
            throw new Error('Failed to save revision');
          }
        }
      }
    } catch (error) {
      console.error('Revision failed:', error);
      toast.error("修改失败，请重试");
    }
  };

  const handleParagraphRevisionAPI = async (params: any) => {
    try {
      const revisedContent = await runRevision({
        ...params,
        language: generationState.languagePreference || 'Chinese'
      });
      return revisedContent;
    } catch (error) {
      console.error('Paragraph revision failed:', error);
      throw error;
    }
  };

  const handleParagraphRevise = (index: number, newText: string) => {
    const paragraphs = displayContent.split('\n\n');
    paragraphs[index] = newText;
    const newContent = paragraphs.join('\n\n');
    updateGeneratedContent(newContent);
  };

  const handleVersionSwitch = (version: number) => {
    setCurrentVersion(version);
    const versionData = versions.find(v => v.version === version);
    if (versionData) {
      updateGeneratedContent(versionData.content);
    }
  };

  // 如果是初始加载或正在生成，显示加载动画
  if (isInitialLoading || generationState.isGenerating) {
    return <AIGeneratingLoader />;
  }

  // 如果有错误，显示错误信息
  if (generationState.error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">生成失败</p>
            <p className="text-sm mt-2">{generationState.error}</p>
          </div>
          <Button onClick={handleRegenerate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重新生成
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 如果没有内容，显示空状态
  if (!displayContent) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-4">暂无内容</p>
          <Button onClick={handleGenerate}>
            生成个人陈述
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 标题和操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            个人陈述 Personal Statement
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            已生成
          </Badge>
          <Badge variant="outline">
            {displayContent.length} 字
          </Badge>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {/* 版本切换 */}
        {versions.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                版本 {currentVersion}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {versions.map((version) => (
                <DropdownMenuItem
                  key={version.version}
                  onClick={() => handleVersionSwitch(version.version)}
                  className={currentVersion === version.version ? 'bg-accent' : ''}
                >
                  版本 {version.version}
                  {version.version === 1 && ' (原始)'}
                  {version.version > 1 && ' (修改版)'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              预览
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" />
              编辑
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          复制
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
        <Button variant="outline" size="sm" onClick={handleRegenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重新生成
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRevisionClick}
          disabled={serverRevisionStatus || isRevising}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          修改
          {serverRevisionStatus && (
            <Badge variant="secondary" className="ml-2">
              已使用
            </Badge>
          )}
        </Button>
      </div>

      {/* 内容显示区 */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isEditMode ? (
            <div className="min-h-[600px]">
              <MarkdownEditor
                value={editingContent}
                onChange={handleMarkdownChange}
              />
            </div>
          ) : (
            <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
              {/* 如果开启了修改功能且未使用过，显示可编辑的段落 */}
              {!serverRevisionStatus && displayContent ? (
                <div className="space-y-4">
                  {displayContent.split('\n\n').map((paragraph: string, index: number) => (
                    <ParagraphRevision
                      key={index}
                      paragraph={paragraph}
                      index={index}
                      onRevise={handleParagraphRevise}
                      isRevising={isRevising}
                      isHighlighted={highlightedParagraph === index}
                      onHighlightChange={(highlight) => setHighlightedParagraph(highlight ? index : null)}
                      onStartRevision={handleParagraphRevisionAPI}
                    />
                  ))}
                </div>
              ) : (
                <Markdown content={displayContent} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 修改相关的模态框 */}
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
    </div>
  );
}

export default function PSResultClient({ documentUuid }: { documentUuid: string }) {
  return (
    <PSProvider>
      <PSResultContent documentUuid={documentUuid} />
    </PSProvider>
  );
}