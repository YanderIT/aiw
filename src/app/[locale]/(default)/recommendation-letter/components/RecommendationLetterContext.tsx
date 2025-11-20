"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'next/navigation';

// 定义各个模块的数据结构
export interface BasicInfoData {
  student_full_name: string;
  recommender_name: string;
  recommender_title: string;
  recommender_institution: string;
  recommendation_date: string;
}

export interface RelationshipBackgroundData {
  relationship_with_student: string;
  known_since: string;
  course_or_project: string;
}

export interface AbilityDemonstrationData {
  academic_strength: string;
  project_achievement: string;
  personal_qualities: string;
  specific_example: string;
}

export interface FinalRecommendationData {
  fit_for_program: string;
  final_endorsement: string;
  recommender_contact: string;
}

// 模块选择状态
export interface ModuleSelection {
  basicInfo: boolean;
  relationshipBackground: boolean;
  abilityDemonstration: boolean;
  finalRecommendation: boolean;
}

export interface RecommendationLetterData {
  basicInfo: BasicInfoData;
  relationshipBackground: RelationshipBackgroundData;
  abilityDemonstration: AbilityDemonstrationData;
  finalRecommendation: FinalRecommendationData;
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
  languagePreference: 'English' | 'Chinese'; // 添加语言偏好
}

// 版本管理
export interface DocumentVersion {
  id: string;
  content: string;
  createdAt: number;
  type: 'original' | 'revised';
  revisionCount: number;
}

// 定义每个模块的必填字段
const REQUIRED_FIELDS = {
  basicInfo: {
    student_full_name: '被推荐学生的英文全名',
    recommender_name: '推荐人英文姓名',
    recommender_title: '推荐人职称',
    recommender_institution: '推荐人所在单位',
    recommendation_date: '推荐信日期'
  },
  relationshipBackground: {
    relationship_with_student: '推荐人与学生的关系',
    known_since: '相识时间',
    course_or_project: '学生参与过的课程或项目'
  },
  abilityDemonstration: {
    academic_strength: '学术方面的表现',
    personal_qualities: '学生的性格特质'
  },
  finalRecommendation: {
    fit_for_program: '说明学生为何适合申请该项目',
    final_endorsement: '表达推荐人强烈支持的语句'
  }
} as const;

interface RecommendationLetterContextType {
  data: RecommendationLetterData;
  generationState: GenerationState;
  updateBasicInfoData: (data: Partial<BasicInfoData>) => void;
  updateRelationshipBackgroundData: (data: Partial<RelationshipBackgroundData>) => void;
  updateAbilityDemonstrationData: (data: Partial<AbilityDemonstrationData>) => void;
  updateFinalRecommendationData: (data: Partial<FinalRecommendationData>) => void;
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
  setLanguagePreference: (language: 'English' | 'Chinese') => void; // 添加设置语言偏好的方法
  getSelectedData: () => any; // 获取选中模块的数据
  // workflow 执行状态相关方法
  setWorkflowIds: (workflowRunId: string, taskId: string) => void;
  updateWorkflowStatus: (status: 'running' | 'succeeded' | 'failed' | 'stopped') => void;
  getWorkflowStatus: () => Promise<void>;
  startWorkflowStatusPolling: () => void;
  stopWorkflowStatusPolling: () => void;
  fillMockData: () => void;
  // 版本管理
  versions: DocumentVersion[];
  currentVersionId: string | null;
  addVersion: (content: string, type: 'original' | 'revised') => void;
  switchVersion: (versionId: string) => void;
  getCurrentVersion: () => DocumentVersion | null;
  getRevisionCount: () => number;
  hasUsedFreeRevision: () => boolean;
  clearCache: () => void;
}

// 模拟数据
const mockData: RecommendationLetterData = {
  basicInfo: {
    student_full_name: 'John Smith',
    recommender_name: 'Dr. Emily Johnson',
    recommender_title: 'Professor of Computer Science',
    recommender_institution: 'Stanford University',
    recommendation_date: '2023'
  },
  relationshipBackground: {
    relationship_with_student: 'Academic Advisor and Research Supervisor',
    known_since: '2021',
    course_or_project: 'Advanced Machine Learning, Deep Learning Research Project'
  },
  abilityDemonstration: {
    academic_strength: 'Exceptional analytical skills and deep understanding of machine learning algorithms. Ranked top 5% in class.',
    project_achievement: 'Led the development of a novel neural network architecture for image classification, resulting in a published paper',
    personal_qualities: 'Highly motivated, creative problem solver, excellent team player with strong leadership skills',
    specific_example: 'During the AI hackathon, John demonstrated exceptional leadership by organizing his team and developing an innovative solution that won first place'
  },
  finalRecommendation: {
    fit_for_program: 'John\'s strong foundation in AI and proven research capabilities make him an ideal candidate for your graduate program',
    final_endorsement: 'I give John my highest recommendation without reservation',
    recommender_contact: 'ejohnson@stanford.edu, +1 (650) 123-4567'
  },
  moduleSelection: {
    basicInfo: true,
    relationshipBackground: true,
    abilityDemonstration: true,
    finalRecommendation: true
  }
};

const defaultRecommendationLetterData: RecommendationLetterData = {
  basicInfo: {
    student_full_name: '',
    recommender_name: '',
    recommender_title: '',
    recommender_institution: '',
    recommendation_date: ''
  },
  relationshipBackground: {
    relationship_with_student: '',
    known_since: '',
    course_or_project: ''
  },
  abilityDemonstration: {
    academic_strength: '',
    project_achievement: '',
    personal_qualities: '',
    specific_example: ''
  },
  finalRecommendation: {
    fit_for_program: '',
    final_endorsement: '',
    recommender_contact: ''
  },
  moduleSelection: {
    basicInfo: true,
    relationshipBackground: true,
    abilityDemonstration: true,
    finalRecommendation: true
  }
};

const RecommendationLetterContext = createContext<RecommendationLetterContextType | undefined>(undefined);

export function RecommendationLetterProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const locale = params.locale as string;
  // 根据locale确定语言
  const language = locale === 'zh' ? 'Chinese' : 'English';
  
  const [data, setData] = useState<RecommendationLetterData>(defaultRecommendationLetterData);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    generatedContent: '',
    lastGeneratedAt: null,
    error: null,
    workflowRunId: null,
    taskId: null,
    workflowStatus: null,
    languagePreference: 'English' // 默认为英文
  });
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // 版本管理状态
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem('recommendationLetter_form_data');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
      }
      
      // 加载语言偏好（无论是否自动生成都要加载）
      const savedLanguage = localStorage.getItem('recommendationLetter_language_preference');
      if (savedLanguage) {
        setGenerationState(prev => ({
          ...prev,
          languagePreference: (savedLanguage as 'English' | 'Chinese')
        }));
      }

      // 检查是否是自动生成请求
      const urlParams = new URLSearchParams(window.location.search);
      const shouldAutoGenerate = urlParams.get('autoGenerate') === 'true';

      // 如果不是自动生成请求，加载之前的生成内容
      if (!shouldAutoGenerate) {
        const cachedContent = localStorage.getItem('recommendationLetter_generated_content');
        const cachedTime = localStorage.getItem('recommendationLetter_generated_at');

        if (cachedContent) {
          setGenerationState(prev => ({
            ...prev,
            generatedContent: cachedContent,
            lastGeneratedAt: cachedTime ? parseInt(cachedTime) : null
          }));
        }
      }
      
      // 加载版本信息
      const cachedVersions = localStorage.getItem('recommendationLetter_versions');
      const cachedCurrentVersionId = localStorage.getItem('recommendationLetter_currentVersionId');
      
      if (cachedVersions) {
        const parsedVersions = JSON.parse(cachedVersions);
        setVersions(parsedVersions);
      }
      
      if (cachedCurrentVersionId) {
        setCurrentVersionId(cachedCurrentVersionId);
      }
    } catch (error) {
      console.error('Error loading recommendation letter data from cache:', error);
    }
  };

  const saveToCache = () => {
    try {
      localStorage.setItem('recommendationLetter_form_data', JSON.stringify(data));
      
      // 保存版本信息
      if (versions.length > 0) {
        localStorage.setItem('recommendationLetter_versions', JSON.stringify(versions));
      }
      
      if (currentVersionId) {
        localStorage.setItem('recommendationLetter_currentVersionId', currentVersionId);
      }
    } catch (error) {
      console.error('Error saving recommendation letter data to cache:', error);
    }
  };

  useEffect(() => {
    loadFromCache();
  }, []);

  useEffect(() => {
    saveToCache();
  }, [data]);
  
  // 监听版本变化并保存
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem('recommendationLetter_versions', JSON.stringify(versions));
    }
    if (currentVersionId) {
      localStorage.setItem('recommendationLetter_currentVersionId', currentVersionId);
    }
  }, [versions, currentVersionId]);

  const hasModuleContent = (moduleId: string): boolean => {
    const moduleData = data[moduleId as keyof RecommendationLetterData];
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

    const moduleData = data[moduleId as keyof RecommendationLetterData];
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
    const moduleIds = ['basicInfo', 'relationshipBackground', 'abilityDemonstration', 'finalRecommendation'];
    return moduleIds.filter(moduleId => 
      isModuleSelected(moduleId as keyof ModuleSelection) && isModuleCompleted(moduleId)
    ).length;
  };

  const getConfirmationData = (): ConfirmationItem[] => {
    const modules = [
      { id: 'basicInfo', title: '基本信息' },
      { id: 'relationshipBackground', title: '相识背景' },
      { id: 'abilityDemonstration', title: '能力展示' },
      { id: 'finalRecommendation', title: '总结推荐' }
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

  const updateRelationshipBackgroundData = (newData: Partial<RelationshipBackgroundData>) => {
    setData(prev => ({
      ...prev,
      relationshipBackground: { ...prev.relationshipBackground, ...newData }
    }));
  };

  const updateAbilityDemonstrationData = (newData: Partial<AbilityDemonstrationData>) => {
    setData(prev => ({
      ...prev,
      abilityDemonstration: { ...prev.abilityDemonstration, ...newData }
    }));
  };

  const updateFinalRecommendationData = (newData: Partial<FinalRecommendationData>) => {
    setData(prev => ({
      ...prev,
      finalRecommendation: { ...prev.finalRecommendation, ...newData }
    }));
  };

  const getMissingFields = (moduleId: string): string[] => {
    const requiredFields = REQUIRED_FIELDS[moduleId as keyof typeof REQUIRED_FIELDS];
    if (!requiredFields) return [];

    const moduleData = data[moduleId as keyof RecommendationLetterData];
    if (typeof moduleData !== 'object' || moduleData === null || moduleId === 'moduleSelection') return [];

    const missing: string[] = [];
    Object.entries(requiredFields).forEach(([field, label]: [string, string]) => {
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
    
    // 如果是首次生成（没有版本），创建原始版本
    if (versions.length === 0 && content) {
      const newVersion: DocumentVersion = {
        id: Date.now().toString(),
        content,
        createdAt: Date.now(),
        type: 'original',
        revisionCount: 0
      };
      setVersions([newVersion]);
      setCurrentVersionId(newVersion.id);
    }
    
    // 保存到本地存储
    try {
      localStorage.setItem('recommendationLetter_generated_content', content);
      localStorage.setItem('recommendationLetter_generated_at', Date.now().toString());
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

  const setLanguagePreference = (language: 'English' | 'Chinese') => {
    setGenerationState(prev => ({
      ...prev,
      languagePreference: language
    }));
    // 同时保存到缓存
    try {
      localStorage.setItem('recommendationLetter_language_preference', language);
    } catch (error) {
      console.error('Error saving language preference to cache:', error);
    }
  };

  const getSelectedData = () => {
    const selectedData: any = {
      language: generationState.languagePreference  // 使用语言偏好设置而不是locale
    };
    
    if (data.moduleSelection.basicInfo) {
      Object.assign(selectedData, data.basicInfo);
    }
    if (data.moduleSelection.relationshipBackground) {
      Object.assign(selectedData, data.relationshipBackground);
    }
    if (data.moduleSelection.abilityDemonstration) {
      Object.assign(selectedData, data.abilityDemonstration);
    }
    if (data.moduleSelection.finalRecommendation) {
      Object.assign(selectedData, data.finalRecommendation);
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
      const response = await fetch(`/api/dify/workflows/run/${generationState.workflowRunId}?function_type=recommendation-letter`);
      const result = await response.json();
      
      if (result.success) {
        const status = result.data.status;
        updateWorkflowStatus(status);
        
        // 如果执行完成，更新内容
        if (status === 'succeeded' && result.data.outputs) {
          const output = result.data.outputs.text || result.data.outputs.content || '';
          if (output) {
            updateGeneratedContent(output);
            // 这里可以添加成功提示，但需要在组件层面处理
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

  // 填充模拟数据
  const fillMockData = () => {
    setData(mockData);
    saveToCache();
  };

  // 版本管理方法
  const addVersion = (content: string, type: 'original' | 'revised') => {
    const newVersion: DocumentVersion = {
      id: Date.now().toString(),
      content,
      createdAt: Date.now(),
      type,
      revisionCount: versions.filter(v => v.type === 'revised').length + (type === 'revised' ? 1 : 0)
    };
    
    setVersions([...versions, newVersion]);
    setCurrentVersionId(newVersion.id);
    
    // 如果是修改版本，更新生成内容
    if (type === 'revised') {
      setGenerationState(prev => ({
        ...prev,
        generatedContent: content
      }));
    }
  };

  const switchVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setCurrentVersionId(versionId);
      setGenerationState(prev => ({
        ...prev,
        generatedContent: version.content
      }));
    }
  };

  const getCurrentVersion = (): DocumentVersion | null => {
    return versions.find(v => v.id === currentVersionId) || null;
  };

  const getRevisionCount = (): number => {
    return versions.filter(v => v.type === 'revised').length;
  };

  const hasUsedFreeRevision = (): boolean => {
    return getRevisionCount() >= 1;
  };
  
  // 清除缓存
  const clearCache = () => {
    try {
      localStorage.removeItem('recommendationLetter_form_data');
      localStorage.removeItem('recommendationLetter_generated_content');
      localStorage.removeItem('recommendationLetter_generated_at');
      localStorage.removeItem('recommendationLetter_versions');
      localStorage.removeItem('recommendationLetter_currentVersionId');
    } catch (error) {
      console.error('Error clearing cache:', error);
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

  const value: RecommendationLetterContextType = {
    data,
    generationState,
    updateBasicInfoData,
    updateRelationshipBackgroundData,
    updateAbilityDemonstrationData,
    updateFinalRecommendationData,
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
    setLanguagePreference,
    getSelectedData,
    setWorkflowIds,
    updateWorkflowStatus,
    getWorkflowStatus,
    startWorkflowStatusPolling,
    stopWorkflowStatusPolling,
    fillMockData,
    // 版本管理
    versions,
    currentVersionId,
    addVersion,
    switchVersion,
    getCurrentVersion,
    getRevisionCount,
    hasUsedFreeRevision,
    clearCache
  };

  return (
    <RecommendationLetterContext.Provider value={value}>
      {children}
    </RecommendationLetterContext.Provider>
  );
}

export function useRecommendationLetter() {
  const context = useContext(RecommendationLetterContext);
  if (context === undefined) {
    throw new Error('useRecommendationLetter must be used within a RecommendationLetterProvider');
  }
  return context;
} 