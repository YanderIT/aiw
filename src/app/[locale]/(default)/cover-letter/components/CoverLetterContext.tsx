"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'next/navigation';

// 定义各个模块的数据结构
export interface BasicInfoData {
  full_name: string;
  address: string;
  email: string;
  phone: string;
  date: string;
  recruiter_name: string;
  recruiter_title: string;
  company_name: string;
  company_address: string;
}

export interface ApplicationBackgroundData {
  current_program: string;
  target_position: string;
  department: string;
  application_channel: string;
  why_this_company: string;
}

export interface ExperienceHistoryData {
  past_internship_1: string;
  skills_from_internship: string;
  highlight_project: string;
  leadership_or_teamwork: string;
}

export interface FitAndClosingData {
  fit_reason: string;
  impressed_by_company: string;
  final_expectation: string;
}

// 模块选择状态
export interface ModuleSelection {
  basicInfo: boolean;
  applicationBackground: boolean;
  experienceHistory: boolean;
  fitAndClosing: boolean;
}

export interface CoverLetterData {
  basicInfo: BasicInfoData;
  applicationBackground: ApplicationBackgroundData;
  experienceHistory: ExperienceHistoryData;
  fitAndClosing: FitAndClosingData;
  moduleSelection: ModuleSelection;
}

// 确认页面需要的数据结构
export interface ConfirmationItem {
  moduleId: string;
  title: string;
  isChecked: boolean;
  hasContent: boolean;
  isEmpty: boolean;
  missingFields: string[];
}

// 生成状态和内容
export interface GenerationState {
  isGenerating: boolean;
  generatedContent: string;
  lastGeneratedAt: number | null;
  error: string | null;
  workflowRunId: string | null;
  taskId: string | null;
  workflowStatus: 'running' | 'succeeded' | 'failed' | 'stopped' | null;
}

// 定义每个模块的必填字段
const REQUIRED_FIELDS = {
  basicInfo: {
    full_name: '申请人英文姓名',
    email: '邮箱地址', 
    phone: '电话号码',
    date: '写信日期',
    company_name: '公司或机构名称'
  },
  applicationBackground: {
    current_program: '当前身份',
    target_position: '申请岗位名称'
  },
  experienceHistory: {
    past_internship_1: '重点实习/工作经历',
    skills_from_internship: '从该经历中获得的技能'
  },
  fitAndClosing: {
    fit_reason: '为什么适合这个岗位'
  }
} as const;

interface CoverLetterContextType {
  data: CoverLetterData;
  generationState: GenerationState;
  updateBasicInfoData: (data: Partial<BasicInfoData>) => void;
  updateApplicationBackgroundData: (data: Partial<ApplicationBackgroundData>) => void;
  updateExperienceHistoryData: (data: Partial<ExperienceHistoryData>) => void;
  updateFitAndClosingData: (data: Partial<FitAndClosingData>) => void;
  toggleModuleSelection: (moduleId: keyof ModuleSelection) => void;
  isModuleSelected: (moduleId: keyof ModuleSelection) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  getCompletedModulesCount: () => number;
  getConfirmationData: () => ConfirmationItem[];
  getIncompleteSelections: () => ConfirmationItem[];
  canGenerate: () => boolean;
  saveToCache: () => void;
  loadFromCache: () => void;
  getMissingFields: (moduleId: string) => string[];
  // 生成相关方法
  updateGeneratedContent: (content: string) => void;
  setGenerationError: (error: string | null) => void;
  setGenerationLoading: (loading: boolean) => void;
  getSelectedData: () => any; // 获取选中模块的数据
  // workflow 执行状态相关方法
  setWorkflowIds: (workflowRunId: string, taskId: string) => void;
  updateWorkflowStatus: (status: 'running' | 'succeeded' | 'failed' | 'stopped') => void;
  getWorkflowStatus: () => Promise<void>;
  startWorkflowStatusPolling: () => void;
  stopWorkflowStatusPolling: () => void;
}

const defaultCoverLetterData: CoverLetterData = {
  basicInfo: {
    full_name: '',
    address: '',
    email: '',
    phone: '',
    date: '',
    recruiter_name: '',
    recruiter_title: '',
    company_name: '',
    company_address: ''
  },
  applicationBackground: {
    current_program: '',
    target_position: '',
    department: '',
    application_channel: '',
    why_this_company: ''
  },
  experienceHistory: {
    past_internship_1: '',
    skills_from_internship: '',
    highlight_project: '',
    leadership_or_teamwork: ''
  },
  fitAndClosing: {
    fit_reason: '',
    impressed_by_company: '',
    final_expectation: ''
  },
  moduleSelection: {
    basicInfo: true,
    applicationBackground: true,
    experienceHistory: true,
    fitAndClosing: true
  }
};

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

export function CoverLetterProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const locale = params.locale as string;
  // 根据locale确定语言
  const language = locale === 'zh' ? 'Chinese' : 'English';
  
  const [data, setData] = useState<CoverLetterData>(defaultCoverLetterData);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    generatedContent: '',
    lastGeneratedAt: null,
    error: null,
    workflowRunId: null,
    taskId: null,
    workflowStatus: null
  });
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem('coverLetter_form_data');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
      }
      
      // 加载生成的内容
      const cachedContent = localStorage.getItem('coverLetter_generated_content');
      const cachedTime = localStorage.getItem('coverLetter_generated_at');
      
      if (cachedContent) {
        setGenerationState(prev => ({
          ...prev,
          generatedContent: cachedContent,
          lastGeneratedAt: cachedTime ? parseInt(cachedTime) : null
        }));
      }
    } catch (error) {
      console.error('Error loading cover letter data from cache:', error);
    }
  };

  const saveToCache = () => {
    try {
      localStorage.setItem('coverLetter_form_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cover letter data to cache:', error);
    }
  };

  useEffect(() => {
    loadFromCache();
  }, []);

  useEffect(() => {
    saveToCache();
  }, [data]);

  const hasModuleContent = (moduleId: string): boolean => {
    const moduleData = data[moduleId as keyof CoverLetterData];
    if (typeof moduleData === 'object' && moduleData !== null && moduleId !== 'moduleSelection') {
      return Object.values(moduleData).some(value => 
        typeof value === 'string' && value.trim() !== ''
      );
    }
    return false;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    const requiredFields = REQUIRED_FIELDS[moduleId as keyof typeof REQUIRED_FIELDS];
    if (!requiredFields) return false;

    const moduleData = data[moduleId as keyof CoverLetterData];
    if (typeof moduleData !== 'object' || moduleData === null || moduleId === 'moduleSelection') return false;

    return Object.keys(requiredFields).every(field => {
      const value = (moduleData as any)[field];
      return typeof value === 'string' && value.trim() !== '';
    });
  };

  const toggleModuleSelection = (moduleId: keyof ModuleSelection) => {
    setData(prev => ({
      ...prev,
      moduleSelection: {
        ...prev.moduleSelection,
        [moduleId]: !prev.moduleSelection[moduleId]
      }
    }));
  };

  const isModuleSelected = (moduleId: keyof ModuleSelection): boolean => {
    return data.moduleSelection[moduleId];
  };

  const getCompletedModulesCount = (): number => {
    const moduleIds = ['basicInfo', 'applicationBackground', 'experienceHistory', 'fitAndClosing'];
    return moduleIds.filter(moduleId => 
      isModuleSelected(moduleId as keyof ModuleSelection) && isModuleCompleted(moduleId)
    ).length;
  };

  const getConfirmationData = (): ConfirmationItem[] => {
    const modules = [
      { id: 'basicInfo', title: '基本信息' },
      { id: 'applicationBackground', title: '申请背景' },
      { id: 'experienceHistory', title: '实习与经历' },
      { id: 'fitAndClosing', title: '匹配度与结尾' }
    ];

    return modules.map(module => {
      const isChecked = isModuleSelected(module.id as keyof ModuleSelection);
      const hasContent = hasModuleContent(module.id);
      const isEmpty = isChecked && !hasContent;
      const missingFields = getMissingFields(module.id);

      return {
        moduleId: module.id,
        title: module.title,
        isChecked,
        hasContent,
        isEmpty,
        missingFields
      };
    });
  };

  const getIncompleteSelections = (): ConfirmationItem[] => {
    return getConfirmationData().filter(item => 
      item.isChecked && (!item.hasContent || item.missingFields.length > 0)
    );
  };

  const canGenerate = (): boolean => {
    const incompleteSelections = getIncompleteSelections();
    return incompleteSelections.length === 0;
  };

  const updateBasicInfoData = (newData: Partial<BasicInfoData>) => {
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...newData }
    }));
  };

  const updateApplicationBackgroundData = (newData: Partial<ApplicationBackgroundData>) => {
    setData(prev => ({
      ...prev,
      applicationBackground: { ...prev.applicationBackground, ...newData }
    }));
  };

  const updateExperienceHistoryData = (newData: Partial<ExperienceHistoryData>) => {
    setData(prev => ({
      ...prev,
      experienceHistory: { ...prev.experienceHistory, ...newData }
    }));
  };

  const updateFitAndClosingData = (newData: Partial<FitAndClosingData>) => {
    setData(prev => ({
      ...prev,
      fitAndClosing: { ...prev.fitAndClosing, ...newData }
    }));
  };

  const getMissingFields = (moduleId: string): string[] => {
    const requiredFields = REQUIRED_FIELDS[moduleId as keyof typeof REQUIRED_FIELDS];
    if (!requiredFields) return [];

    const moduleData = data[moduleId as keyof CoverLetterData];
    if (typeof moduleData !== 'object' || moduleData === null || moduleId === 'moduleSelection') return [];

    const missing: string[] = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      const value = (moduleData as any)[field];
      if (typeof value !== 'string' || value.trim() === '') {
        missing.push(label);
      }
    });

    return missing;
  };

  const updateGeneratedContent = (content: string) => {
    setGenerationState(prev => ({
      ...prev,
      generatedContent: content,
      lastGeneratedAt: Date.now()
    }));
    
    // 保存到本地存储
    try {
      localStorage.setItem('coverLetter_generated_content', content);
      localStorage.setItem('coverLetter_generated_at', Date.now().toString());
    } catch (error) {
      console.error('Error saving generated content to cache:', error);
    }
  };

  const setGenerationError = (error: string | null) => {
    setGenerationState(prev => ({
      ...prev,
      error
    }));
  };

  const setGenerationLoading = (loading: boolean) => {
    setGenerationState(prev => ({
      ...prev,
      isGenerating: loading
    }));
  };

  const getSelectedData = () => {
    const selectedData: any = {
      language: language  // 添加语言字段
    };
    
    if (data.moduleSelection.basicInfo) {
      Object.assign(selectedData, data.basicInfo);
    }
    if (data.moduleSelection.applicationBackground) {
      Object.assign(selectedData, data.applicationBackground);
    }
    if (data.moduleSelection.experienceHistory) {
      Object.assign(selectedData, data.experienceHistory);
    }
    if (data.moduleSelection.fitAndClosing) {
      Object.assign(selectedData, data.fitAndClosing);
    }
    
    return selectedData;
  };

  // workflow 执行状态相关方法
  const setWorkflowIds = (workflowRunId: string, taskId: string) => {
    setGenerationState(prev => ({
      ...prev,
      workflowRunId,
      taskId,
      workflowStatus: 'running'
    }));
  };

  const updateWorkflowStatus = (status: 'running' | 'succeeded' | 'failed' | 'stopped') => {
    setGenerationState(prev => ({
      ...prev,
      workflowStatus: status
    }));
  };

  const getWorkflowStatus = async () => {
    if (!generationState.workflowRunId) return;
    
    try {
      const response = await fetch(`/api/dify/workflows/run/${generationState.workflowRunId}?function_type=cover-letter`);
      const result = await response.json();
      
      if (result.success) {
        const status = result.data.status;
        updateWorkflowStatus(status);
        
        // 如果执行完成，更新内容
        if (status === 'succeeded' && result.data.outputs) {
          const output = result.data.outputs.text || result.data.outputs.content || '';
          if (output) {
            updateGeneratedContent(output);
          }
        }
        
        // 如果执行失败，设置错误
        if (status === 'failed' && result.data.error) {
          setGenerationError(result.data.error);
        }
      }
    } catch (error) {
      console.error('获取 workflow 状态失败:', error);
      setGenerationError('获取执行状态失败');
    }
  };

  const startWorkflowStatusPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(async () => {
      await getWorkflowStatus();
      
      // 如果状态不是 running，停止轮询
      if (generationState.workflowStatus && generationState.workflowStatus !== 'running') {
        stopWorkflowStatusPolling();
        setGenerationLoading(false);
      }
    }, 2000); // 每2秒检查一次
    
    setPollingInterval(interval);
  };

  const stopWorkflowStatusPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const value: CoverLetterContextType = {
    data,
    generationState,
    updateBasicInfoData,
    updateApplicationBackgroundData,
    updateExperienceHistoryData,
    updateFitAndClosingData,
    toggleModuleSelection,
    isModuleSelected,
    isModuleCompleted,
    getCompletedModulesCount,
    getConfirmationData,
    getIncompleteSelections,
    canGenerate,
    saveToCache,
    loadFromCache,
    getMissingFields,
    updateGeneratedContent,
    setGenerationError,
    setGenerationLoading,
    getSelectedData,
    setWorkflowIds,
    updateWorkflowStatus,
    getWorkflowStatus,
    startWorkflowStatusPolling,
    stopWorkflowStatusPolling
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
} 