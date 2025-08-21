"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
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
  Loader2,
  Wand2,
  Eye,
  GitCompare,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useDify } from '@/hooks/useDify';
import { useDifyReviseCoverLetter } from '@/hooks/useDifyReviseCoverLetter';
import Markdown from "@/components/markdown";
import MarkdownEditor from "@/components/blocks/mdeditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import context and modules
import { CoverLetterProvider, useCoverLetter } from "../../../components/CoverLetterContext";
import BasicInfoModule from "../../../components/modules/BasicInfoModule";
import ApplicationBackgroundModule from "../../../components/modules/ApplicationBackgroundModule";
import ExperienceHistoryModule from "../../../components/modules/ExperienceHistoryModule";
import FitAndClosingModule from "../../../components/modules/FitAndClosingModule";

// Import SVG icons
import BasicInfoIcon from "../../../components/icons/BasicInfoIcon";
import ApplicationBackgroundIcon from "../../../components/icons/ApplicationBackgroundIcon";
import ExperienceHistoryIcon from "../../../components/icons/ExperienceHistoryIcon";
import FitAndClosingIcon from "../../../components/icons/FitAndClosingIcon";

// Import revision components
import RevisionModal from "../../../components/RevisionModal";
import FullRevisionModal from "../../../components/FullRevisionModal";
import ParagraphRevision from "../../../components/ParagraphRevision";
import VersionComparison from "../../../components/VersionComparison";

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

interface CoverLetterResultContentProps {
  documentUuid: string;
}

function CoverLetterResultContent({ documentUuid }: CoverLetterResultContentProps) {
  const t = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale || 'zh';
  
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContent, setEditingContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 修改相关状态
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showFullRevisionModal, setShowFullRevisionModal] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [serverRevisionStatus, setServerRevisionStatus] = useState<boolean | null>(null);
  const [revisingParagraphIndex, setRevisingParagraphIndex] = useState<number | null>(null);
  
  // 版本历史状态（从数据库加载）
  const [dbVersions, setDbVersions] = useState<any[]>([]);
  const [currentDbVersionId, setCurrentDbVersionId] = useState<string | null>(null);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  
  const { runWorkflow } = useDify({ functionType: 'cover-letter' });
  const { runRevision, isRevising } = useDifyReviseCoverLetter();
  
  const { 
    data, 
    isModuleSelected, 
    toggleModuleSelection,
    updateBasicInfoData,
    updateApplicationBackgroundData,
    updateExperienceHistoryData,
    updateFitAndClosingData,
    updateGeneratedContent,
    getSelectedData,
    addVersion,
    versions,
    currentVersionId,
    switchVersion,
    hasUsedFreeRevision
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

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      // 准备Dify API输入
      const difyInputs = {
        language: 'English',
        // Basic Info fields
        full_name: data.basicInfo.full_name || '',
        address: data.basicInfo.address || '',
        email: data.basicInfo.email || '',
        phone: data.basicInfo.phone || '',
        date: data.basicInfo.date || '',
        recruiter_name: data.basicInfo.recruiter_name || '',
        recruiter_title: data.basicInfo.recruiter_title || '',
        company_name: data.basicInfo.company_name || '',
        company_address: data.basicInfo.company_address || '',
        // Application Background
        current_program: data.applicationBackground.current_program || '',
        target_position: data.applicationBackground.target_position || '',
        department: data.applicationBackground.department || '',
        application_channel: data.applicationBackground.application_channel || '',
        why_this_company: data.applicationBackground.why_this_company || '',
        // Experience History
        past_internship_1: data.experienceHistory.past_internship_1 || '',
        skills_from_internship: data.experienceHistory.skills_from_internship || '',
        highlight_project: data.experienceHistory.highlight_project || '',
        leadership_or_teamwork: data.experienceHistory.leadership_or_teamwork || '',
        // Fit and Closing
        fit_reason: data.fitAndClosing.fit_reason || '',
        impressed_by_company: data.fitAndClosing.impressed_by_company || '',
        final_expectation: data.fitAndClosing.final_expectation || ''
      };

      const result = await runWorkflow({
        inputs: difyInputs,
        response_mode: 'blocking',
        user: 'cover-letter-user'
      });

      // 提取生成的内容
      const content = (result as any).data?.outputs?.text || 
                     (result as any).outputs?.text || 
                     generateCoverLetter(data); // Fallback to template
      
      setGeneratedContent(content);
      setEditingContent(content);
      
      // 更新数据库中的文档内容
      try {
        const updateResponse = await fetch('/api/documents', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: documentUuid,
            content: content,
            ai_workflow_id: (result as any).workflow_run_id,
            word_count: content.length.toString()
          }),
        });

        if (!updateResponse.ok) {
          console.error('Failed to update document in database');
        }
      } catch (error) {
        console.error('Error updating document:', error);
      }
      
      toast.success("求职信已成功生成！");
    } catch (error) {
      console.error('Generate failed:', error);
      // Fallback to template generation
      const generated = generateCoverLetter(data);
      setGeneratedContent(generated);
      setEditingContent(generated);
      toast.error("AI生成失败，使用模板生成");
    } finally {
      setIsGenerating(false);
    }
  }, [data, runWorkflow, documentUuid]);

  // 从数据库加载文档数据
  useEffect(() => {
    const loadDocumentData = async () => {
      if (!documentUuid) return;
      
      try {
        // 从数据库加载文档数据
        const response = await fetch(`/api/documents/${documentUuid}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data?.form_data) {
            // 更新Context中的数据
            const formData = result.data.form_data;
            if (formData.basicInfo) {
              updateBasicInfoData(formData.basicInfo);
            }
            if (formData.applicationBackground) {
              updateApplicationBackgroundData(formData.applicationBackground);
            }
            if (formData.experienceHistory) {
              updateExperienceHistoryData(formData.experienceHistory);
            }
            if (formData.fitAndClosing) {
              updateFitAndClosingData(formData.fitAndClosing);
            }
          }
          // 如果有内容，加载到生成内容中
          if (result.data?.content) {
            setGeneratedContent(result.data.content);
            setEditingContent(result.data.content);
          }
        }
      } catch (error) {
        console.error('Error loading document:', error);
      }
    };
    
    // 检查文档的修改状态
    const checkRevisionStatus = async () => {
      if (!documentUuid) return;
      
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
    
    // 加载文档数据
    loadDocumentData();
    checkRevisionStatus();
  }, [documentUuid, updateBasicInfoData, updateApplicationBackgroundData, updateExperienceHistoryData, updateFitAndClosingData]);

  // 初始加载时检查是否需要自动生成
  useEffect(() => {
    // 检查URL参数，如果有autoGenerate=true，自动开始生成
    const urlParams = new URLSearchParams(window.location.search);
    const shouldAutoGenerate = urlParams.get('autoGenerate') === 'true';
    
    if (shouldAutoGenerate && !isGenerating && !generatedContent) {
      console.log('Auto-generating cover letter...');
      handleGenerate();
      // 清理URL参数
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isGenerating, generatedContent, handleGenerate]);

  // 监听版本切换
  useEffect(() => {
    if (currentDbVersionId && dbVersions.length > 0) {
      const version = dbVersions.find(v => v.uuid === currentDbVersionId);
      if (version && version.content) {
        setGeneratedContent(version.content);
        setEditingContent(version.content);
      }
    }
  }, [currentDbVersionId, dbVersions]);

  const handleCopy = async () => {
    const contentToCopy = isEditMode ? editingContent : generatedContent;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      toast.success("内容已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  const handleExport = () => {
    const contentToExport = isEditMode ? editingContent : generatedContent;
    const blob = new Blob([contentToExport], { type: 'text/plain' });
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
    const contentToSave = isEditMode ? editingContent : generatedContent;
    // 这里可以实现保存到数据库的逻辑
    localStorage.setItem('saved-cover-letter', contentToSave);
    if (isEditMode) {
      setGeneratedContent(editingContent);
    }
    toast.success("求职信已保存");
  };
  
  const handleMarkdownChange = (value: string) => {
    setEditingContent(value);
  };

  // 加载文档版本历史
  const loadDocumentVersions = useCallback(async (forceVersionId?: string) => {
    if (!documentUuid) return;
    
    setIsLoadingVersions(true);
    try {
      const response = await fetch(`/api/documents/${documentUuid}/versions`);
      if (response.ok) {
        const data = await response.json();
        
        // 解析响应数据
        const versions = data.data?.versions || data.versions || [];
        setDbVersions(versions);
        
        // 如果有版本，设置当前版本
        if (versions && versions.length > 0) {
          // 如果指定了强制版本ID（新创建的修订版本），使用它
          if (forceVersionId) {
            const targetVersion = versions.find((v: any) => v.uuid === forceVersionId);
            if (targetVersion) {
              setCurrentDbVersionId(forceVersionId);
              if (targetVersion.content) {
                setGeneratedContent(targetVersion.content);
                setEditingContent(targetVersion.content);
              }
            }
          } else if (!currentDbVersionId) {
            // 如果还没有设置当前版本ID，默认选择原始版本
            const originalVersion = versions.find((v: any) => v.version_type === 'original');
            const versionToSet = originalVersion || versions[0]; // 如果没有原始版本，使用第一个版本
            setCurrentDbVersionId(versionToSet.uuid);
            
            // 如果版本有内容，更新显示内容
            if (versionToSet.content) {
              setGeneratedContent(versionToSet.content);
              setEditingContent(versionToSet.content);
            }
          } else {
            // 如果已经有当前版本ID，保持不变，只更新内容（用于版本切换）
            const currentVersion = versions.find((v: any) => v.uuid === currentDbVersionId);
            if (currentVersion?.content) {
              setGeneratedContent(currentVersion.content);
              setEditingContent(currentVersion.content);
            }
          }
        }
        
        // 设置修改状态
        if (data.has_used_revision !== undefined) {
          setServerRevisionStatus(data.has_used_revision);
        }
      }
    } catch (error) {
      console.error('Failed to load document versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  }, [documentUuid, currentDbVersionId]);

  useEffect(() => {
    loadDocumentVersions();
  }, [loadDocumentVersions]);

  // 获取当前数据库版本内容
  const getCurrentDbVersion = () => {
    if (currentDbVersionId && dbVersions.length > 0) {
      const version = dbVersions.find(v => v.uuid === currentDbVersionId);
      return version?.content || '';
    }
    return '';
  };

  // 显示内容优先级：数据库版本 > 生成内容 > 占位符
  const displayContent = getCurrentDbVersion() || generatedContent || generateCoverLetter(data);

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
    window.location.href = `/${locale}/cover-letter`;
  };

  const handleFullRevision = async (settings: any) => {
    setShowFullRevisionModal(false);
    setIsGenerating(true);
    
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
        { value: 'professional', label: '更专业' },
        { value: 'enthusiastic', label: '更热情' },
        { value: 'confident', label: '更自信' },
        { value: 'clarity', label: '更清晰' },
      ];
      
      // 将选中的风格值转换为中文标签
      const styleLabels = settings.styles.map((styleValue: string) => {
        const option = STYLE_OPTIONS.find(opt => opt.value === styleValue);
        return option ? option.label : styleValue;
      });
      
      const params = {
        revise_type: (settings.wordControl === 'keep' ? 0 : (settings.wordControl === 'expand' ? 1 : 2)).toString(),
        style: styleLabels.join(';'),
        original_word_count: displayContent.length.toString(),
        word_count: settings.targetWordCount?.toString() || displayContent.length.toString(),
        detail: settings.direction,
        original_context: displayContent,
        whole: '0', // 整篇修改
        language: 'English' // 求职信默认英文 - API要求的格式
      };
      
      const revisedContent = await runRevision(params);
      
      // 创建修改版本并保存到数据库
      if (documentUuid) {
        const response = await fetch(`/api/documents/${documentUuid}/revisions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: revisedContent,
            revision_settings: settings
          })
        });
        
        if (response.ok) {
          const { data: revision } = await response.json();
          
          // 立即更新显示内容
          setGeneratedContent(revisedContent);
          setEditingContent(revisedContent);
          updateGeneratedContent(revisedContent);
          
          // 重新加载版本历史，并强制选择新版本
          if (revision?.uuid) {
            await loadDocumentVersions(revision.uuid);
          } else {
            await loadDocumentVersions();
          }
        } else {
          // 如果保存失败，仍然更新本地内容
          setGeneratedContent(revisedContent);
          setEditingContent(revisedContent);
          updateGeneratedContent(revisedContent);
        }
      }
      
      // 添加本地版本
      addVersion(revisedContent, 'revised');
      
      toast.success('求职信修改成功');
    } catch (error) {
      console.error('Revision failed:', error);
      toast.error('修改失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 段落修改处理
  const handleParagraphRevision = async (params: any) => {
    try {
      // 获取语言设置
      const selectedData = getSelectedData();
      const paramsWithLanguage = {
        ...params,
        language: 'English' // 求职信默认英文 - API要求的格式
      };
      
      const revisedContent = await runRevision(paramsWithLanguage);
      return revisedContent;
    } catch (error) {
      console.error('Paragraph revision failed:', error);
      toast.error('段落重写失败，请重试');
      throw error;
    }
  };

  // 处理段落修改
  const handleParagraphRevise = (index: number, newText: string) => {
    const paragraphs = displayContent.split('\n\n');
    paragraphs[index] = newText;
    const newContent = paragraphs.join('\n\n');
    setEditingContent(newContent);
    setGeneratedContent(newContent);
  };

  // 版本切换处理
  const handleVersionChange = (versionId: string) => {
    setCurrentDbVersionId(versionId);
    const version = dbVersions.find(v => v.uuid === versionId);
    if (version && version.content) {
      setGeneratedContent(version.content);
      setEditingContent(version.content);
    }
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
                    {/* 只读视图：显示填写的内容 */}
                    <div className="space-y-4 pointer-events-none opacity-80">
                      <ActiveComponent />
                    </div>
                  </div>
                )}
              </div>

              {/* Revision Button */}
              <div className="border-t border-border p-6 mt-auto">
                <Button
                  onClick={handleRevisionClick}
                  disabled={isGenerating || (serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision())}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-4 h-14"
                  size="lg"
                >
                  <Wand2 className="w-6 h-6 mr-3" />
                  {(serverRevisionStatus !== null ? serverRevisionStatus : hasUsedFreeRevision()) 
                    ? '已使用修改机会' 
                    : '修改文书'}
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
                    <h3 className="text-xl font-semibold text-foreground">结果</h3>
                    
                    {/* 版本切换器 */}
                    {dbVersions.length > 0 && (
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
                                {version.version_type === 'original' ? '原始版本' : `修改版本 ${version.revision_count || version.version}`}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      导出
                    </Button>
                  </div>
                </div>
              </div>

              {/* Editable Content */}
              <div className="flex-1 p-4 overflow-auto">
                {isGenerating ? (
                  <div className="flex items-center justify-center min-h-[500px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-lg">正在生成求职信...</span>
                  </div>
                ) : isEditMode ? (
                  <div className="min-h-[600px]">
                    <MarkdownEditor
                      value={editingContent}
                      onChange={handleMarkdownChange}
                    />
                  </div>
                ) : (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <Markdown content={generatedContent} />
                  </div>
                )}
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
    </div>
  );
}

interface CoverLetterResultClientProps {
  documentUuid: string;
}

export default function CoverLetterResultClient({ documentUuid }: CoverLetterResultClientProps) {
  return (
    <CoverLetterProvider>
      <CoverLetterResultContent documentUuid={documentUuid} />
    </CoverLetterProvider>
  );
} 