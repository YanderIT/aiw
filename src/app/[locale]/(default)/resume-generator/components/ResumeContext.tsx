"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// 定义所有模块的数据结构
export interface HeaderData {
  full_name: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  profilePicture?: {
    url: string;
    key: string;
  };
}

export interface EducationData {
  school_name: string;
  edu_city: string;
  edu_country: string;
  degree: string;
  edu_start_date: string;
  edu_end_date: string;
  gpa_or_rank: string;
  relevant_courses: string;
}

export interface WorkExperienceData {
  company: string;
  job_title: string;
  work_city: string;
  work_country: string;
  work_start_date: string;
  work_end_date: string;
  responsibilities: string;
}

export interface ResearchData {
  project_title: string;
  lab_or_unit: string;
  res_start_date: string;
  res_end_date: string;
  project_background: string;
  your_contributions: string;
  tools_used: string;
  outcomes: string;
}

export interface ActivitiesData {
  activity_name: string;
  role: string;
  act_city: string;
  act_country: string;
  act_start_date: string;
  act_end_date: string;
  description: string;
}

export interface AwardsData {
  award_name: string;
  award_year: string;
  award_issuer: string;
  award_rank: string;
  certificate_name: string;
  certificate_issuer: string;
}

export interface SkillsLanguageData {
  skills: string;
  english_level: string;
  native_language: string;
  other_languages: string;
}

// 新增：模块选择状态
export interface ModuleSelection {
  header: boolean;
  education: boolean;
  workExperience: boolean;
  research: boolean;
  activities: boolean;
  awards: boolean;
  skillsLanguage: boolean;
}

// 新增：布局管理 - 定义哪些模块在主要区域，哪些在侧边栏
export interface LayoutConfiguration {
  mainSections: string[]; // 主要内容区域的模块顺序
  sidebarSections: string[]; // 侧边栏区域的模块顺序
}

// 新增：定义必选模块
const REQUIRED_MODULES = ['header', 'education'] as const;

export interface ResumeData {
  header: HeaderData;
  education: EducationData;
  workExperience: WorkExperienceData[];
  research: ResearchData[];
  activities: ActivitiesData[];
  awards: AwardsData[];
  skillsLanguage: SkillsLanguageData;
  // 新增：记录每个模块是否被选中
  moduleSelection: ModuleSelection;
  // 新增：选择的简历模板
  selectedTemplate: string;
  // 新增：主题颜色
  themeColor: string;
  // 新增：布局配置
  layoutConfiguration: LayoutConfiguration;
}

// 确认页面需要的数据结构
export interface ConfirmationItem {
  moduleId: string;
  title: string;
  isChecked: boolean;
  hasContent: boolean;
  isEmpty: boolean; // 勾选了但没内容
  missingFields: string[]; // 新增：缺失的必填字段
}

// 新增：定义每个模块的必填字段
const REQUIRED_FIELDS = {
  header: {
    full_name: '姓名',
    city: '城市',
    country: '国家',
    email: '邮箱',
    phone: '电话'
  },
  education: {
    school_name: '学校名称',
    edu_city: '学校城市',
    edu_country: '学校国家',
    degree: '学位',
    edu_start_date: '开始日期',
    edu_end_date: '结束日期',
    gpa_or_rank: 'GPA/排名'
  },
  workExperience: {
    company: '公司名称',
    job_title: '职位',
    work_start_date: '开始日期',
    work_end_date: '结束日期',
    responsibilities: '工作内容'
  },
  research: {
    project_title: '项目标题',
    res_start_date: '开始日期',
    res_end_date: '结束日期',
    project_background: '项目背景',
    your_contributions: '个人贡献'
  },
  activities: {
    activity_name: '活动名称',
    role: '担任角色',
    act_start_date: '开始日期',
    act_end_date: '结束日期',
    description: '活动描述'
  },
  awards: {
    award_name: '奖项名称',
    award_year: '获奖年份'
  },
  skillsLanguage: {
    skills: '技能',
    english_level: '英语水平',
    native_language: '母语'
  }
} as const;

// 生成状态
interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  languagePreference: 'English' | 'Chinese'; // 添加语言偏好
}

// 文档管理状态
interface DocumentState {
  documentUuid: string | null;
  lastSavedAt: Date | null;
  isSaving: boolean;
  isLoading: boolean;
  saveError: string | null;
}

interface ResumeContextType {
  data: ResumeData;
  isEditMode?: boolean; // 新增：是否在编辑模式
  updateHeaderData: (data: Partial<HeaderData>) => void;
  updateEducationData: (data: Partial<EducationData>) => void;
  updateWorkExperienceData: (index: number, data: Partial<WorkExperienceData>) => void;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
  updateResearchData: (index: number, data: Partial<ResearchData>) => void;
  addResearch: () => void;
  removeResearch: (index: number) => void;
  updateActivitiesData: (index: number, data: Partial<ActivitiesData>) => void;
  addActivity: () => void;
  removeActivity: (index: number) => void;
  updateAwardsData: (index: number, data: Partial<AwardsData>) => void;
  addAward: () => void;
  removeAward: (index: number) => void;
  updateSkillsLanguageData: (data: Partial<SkillsLanguageData>) => void;
  // 新增：模块选择相关方法
  toggleModuleSelection: (moduleId: keyof ModuleSelection) => void;
  isModuleSelected: (moduleId: keyof ModuleSelection) => boolean;
  isModuleRequired: (moduleId: keyof ModuleSelection) => boolean;
  // 修改：移除锁定相关逻辑
  isModuleCompleted: (moduleId: string) => boolean;
  getCompletedModulesCount: () => number;
  // 新增：确认页面相关方法
  getConfirmationData: () => ConfirmationItem[];
  getIncompleteSelections: () => ConfirmationItem[];
  canGenerate: () => boolean;
  saveToCache: () => void;
  loadFromCache: () => void;
  // 新增：获取缺失字段的方法
  getMissingFields: (moduleId: string) => string[];
  // 新增：模板选择相关方法
  updateSelectedTemplate: (template: string) => void;
  // 新增：主题颜色相关方法
  updateThemeColor: (themeColor: string) => void;
  // 新增：获取选中模块数据的方法
  getSelectedData: () => any;
  // 新增：布局管理相关方法
  updateLayoutConfiguration: (layout: LayoutConfiguration) => void;
  moveModuleToMain: (moduleId: string) => void;
  moveModuleToSidebar: (moduleId: string) => void;
  reorderMainSections: (newOrder: string[]) => void;
  reorderSidebarSections: (newOrder: string[]) => void;
  // 新增：生成状态管理
  generationState: GenerationState;
  setGenerationLoading: (loading: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setLanguagePreference: (language: 'English' | 'Chinese') => void;
  // 新增：文档管理
  documentState: DocumentState;
  saveDocument: () => Promise<void>;
  loadDocument: (uuid: string) => Promise<void>;
  setDocumentUuid: (uuid: string | null) => void;
}

const defaultResumeData: ResumeData = {
  header: {
    full_name: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    profilePicture: undefined
  },
  education: {
    school_name: '',
    edu_city: '',
    edu_country: '',
    degree: '',
    edu_start_date: '',
    edu_end_date: '',
    gpa_or_rank: '',
    relevant_courses: ''
  },
  workExperience: [],
  research: [],
  activities: [],
  awards: [],
  skillsLanguage: {
    skills: '',
    english_level: '',
    native_language: '',
    other_languages: ''
  },
  // 默认只选中必填模块
  moduleSelection: {
    header: true,
    education: true,
    workExperience: false,
    research: false,
    activities: false,
    awards: false,
    skillsLanguage: false
  },
  // 默认选择 ditto 模板
  selectedTemplate: 'ditto',
  themeColor: 'sky-500',
  // 默认布局配置：基于 ditto 模板的结构
  layoutConfiguration: {
    mainSections: ['experience', 'education', 'research', 'activities'],
    sidebarSections: ['profiles', 'skills', 'certifications', 'awards', 'languages']
  }
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const CACHE_KEY = 'resume_generator_data';

export function ResumeProvider({ children, isEditMode = false }: { children: ReactNode; isEditMode?: boolean }) {
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    languagePreference: 'English' // 默认为英文
  });
  const [documentState, setDocumentState] = useState<DocumentState>({
    documentUuid: null,
    lastSavedAt: null,
    isSaving: false,
    isLoading: false,
    saveError: null
  });

  // 从缓存加载数据
  const loadFromCache = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      const savedLanguage = localStorage.getItem('resume_language_preference');
      
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          // 确保新字段存在
          if (!parsedData.moduleSelection) {
            parsedData.moduleSelection = defaultResumeData.moduleSelection;
          }
          if (!parsedData.selectedTemplate) {
            parsedData.selectedTemplate = defaultResumeData.selectedTemplate;
          }
          if (!parsedData.layoutConfiguration) {
            parsedData.layoutConfiguration = defaultResumeData.layoutConfiguration;
          }
          
          // 确保必选模块始终保持选中状态
          REQUIRED_MODULES.forEach(moduleId => {
            if (parsedData.moduleSelection) {
              parsedData.moduleSelection[moduleId] = true;
            }
          });
          
          setData(parsedData);
        } catch (error) {
          console.error('加载缓存数据失败:', error);
        }
      }
      
      // 恢复语言偏好
      if (savedLanguage) {
        setGenerationState(prev => ({
          ...prev,
          languagePreference: savedLanguage as 'English' | 'Chinese'
        }));
      }
    }
  };

  // 保存到缓存
  const saveToCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }
  };

  // 组件初始化时加载缓存数据
  // 但如果在编辑页面，不应该加载缓存
  useEffect(() => {
    // 检查 URL 是否包含 /edit/ 路径
    const isEditPage = typeof window !== 'undefined' && window.location.pathname.includes('/resume-generator/edit/');
    if (!isEditPage) {
      loadFromCache();
    }
  }, []);

  // 数据变化时自动保存到缓存
  useEffect(() => {
    saveToCache();
  }, [data]);

  // 检查模块是否有内容
  const hasModuleContent = (moduleId: string): boolean => {
    // 使用新的必填字段逻辑：只有所有必填字段都填写了才算有内容
    const missingFields = getMissingFields(moduleId);
    return missingFields.length === 0;
  };

  // 修改：模块完成状态现在基于选中状态 + 内容
  const isModuleCompleted = (moduleId: string): boolean => {
    const moduleKey = moduleId === 'work-experience' ? 'workExperience' : 
                     moduleId === 'skills-language' ? 'skillsLanguage' : moduleId;
    
    const isSelected = data.moduleSelection[moduleKey as keyof ModuleSelection];
    const hasContent = hasModuleContent(moduleKey);
    
    // 如果选中了且有内容，则完成
    // 如果没选中，也算完成（因为用户不想包含这部分）
    return !isSelected || (isSelected && hasContent);
  };

  // 新增：切换模块选择状态（但保护必选模块）
  const toggleModuleSelection = (moduleId: keyof ModuleSelection) => {
    // 如果是必选模块，不允许取消选择
    if (REQUIRED_MODULES.includes(moduleId as any)) {
      return;
    }
    
    setData(prev => ({
      ...prev,
      moduleSelection: {
        ...prev.moduleSelection,
        [moduleId]: !prev.moduleSelection[moduleId]
      }
    }));
  };

  // 新增：检查模块是否被选中
  const isModuleSelected = (moduleId: keyof ModuleSelection): boolean => {
    return data.moduleSelection[moduleId];
  };

  // 新增：检查模块是否为必选模块
  const isModuleRequired = (moduleId: keyof ModuleSelection): boolean => {
    return REQUIRED_MODULES.includes(moduleId as any);
  };

  // 获取已完成模块数量（选中且有内容的模块）
  const getCompletedModulesCount = (): number => {
    const modules = ['header', 'education', 'workExperience', 'research', 'activities', 'awards', 'skillsLanguage'];
    return modules.filter(moduleId => {
      const isSelected = data.moduleSelection[moduleId as keyof ModuleSelection];
      const hasContent = hasModuleContent(moduleId);
      return isSelected && hasContent;
    }).length;
  };

  // 新增：获取确认页面数据
  const getConfirmationData = (): ConfirmationItem[] => {
    const modules = [
      { id: 'header', title: '个人背景' },
      { id: 'education', title: '教育经历' },
      { id: 'workExperience', title: '实习/工作经历' },
      { id: 'research', title: '学术研究兴趣' },
      { id: 'activities', title: '活动经历' },
      { id: 'awards', title: '获奖情况' },
      { id: 'skillsLanguage', title: '技能语言' }
    ];

    return modules.map(module => {
      const isChecked = data.moduleSelection[module.id as keyof ModuleSelection];
      const hasContent = hasModuleContent(module.id);
      const missingFields = getMissingFields(module.id);
      
      return {
        moduleId: module.id,
        title: module.title,
        isChecked,
        hasContent,
        isEmpty: isChecked && !hasContent,
        missingFields
      };
    });
  };

  // 新增：获取选中但未填写的模块
  const getIncompleteSelections = (): ConfirmationItem[] => {
    return getConfirmationData().filter(item => item.isEmpty);
  };

  // 新增：检查是否可以生成文书
  const canGenerate = (): boolean => {
    const confirmationData = getConfirmationData();
    const hasSelectedModules = confirmationData.some(item => item.isChecked);
    const hasIncompleteSelections = confirmationData.some(item => item.isEmpty);
    
    return hasSelectedModules && !hasIncompleteSelections;
  };

  // 更新函数保持不变
  const updateHeaderData = (newData: Partial<HeaderData>) => {
    setData(prev => ({
      ...prev,
      header: { ...prev.header, ...newData }
    }));
  };

  const updateEducationData = (newData: Partial<EducationData>) => {
    setData(prev => ({
      ...prev,
      education: { ...prev.education, ...newData }
    }));
  };

  const updateWorkExperienceData = (index: number, newData: Partial<WorkExperienceData>) => {
    setData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((item, i) => 
        i === index ? { ...item, ...newData } : item
      )
    }));
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperienceData = {
      company: '',
      job_title: '',
      work_city: '',
      work_country: '',
      work_start_date: '',
      work_end_date: '',
      responsibilities: ''
    };
    setData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience]
    }));
  };

  const removeWorkExperience = (index: number) => {
    setData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_: WorkExperienceData, i: number) => i !== index)
    }));
  };

  const updateResearchData = (index: number, newData: Partial<ResearchData>) => {
    setData(prev => ({
      ...prev,
      research: prev.research.map((item, i) => 
        i === index ? { ...item, ...newData } : item
      )
    }));
  };

  const addResearch = () => {
    const newResearch: ResearchData = {
      project_title: '',
      lab_or_unit: '',
      res_start_date: '',
      res_end_date: '',
      project_background: '',
      your_contributions: '',
      tools_used: '',
      outcomes: ''
    };
    setData(prev => ({
      ...prev,
      research: [...prev.research, newResearch]
    }));
  };

  const removeResearch = (index: number) => {
    setData(prev => ({
      ...prev,
      research: prev.research.filter((_: ResearchData, i: number) => i !== index)
    }));
  };

  const updateActivitiesData = (index: number, newData: Partial<ActivitiesData>) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map((item, i) => 
        i === index ? { ...item, ...newData } : item
      )
    }));
  };

  const addActivity = () => {
    const newActivity: ActivitiesData = {
      activity_name: '',
      role: '',
      act_city: '',
      act_country: '',
      act_start_date: '',
      act_end_date: '',
      description: ''
    };
    setData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const removeActivity = (index: number) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.filter((_: ActivitiesData, i: number) => i !== index)
    }));
  };

  const updateAwardsData = (index: number, newData: Partial<AwardsData>) => {
    setData(prev => ({
      ...prev,
      awards: prev.awards.map((item, i) => 
        i === index ? { ...item, ...newData } : item
      )
    }));
  };

  const addAward = () => {
    const newAward: AwardsData = {
      award_name: '',
      award_year: '',
      award_issuer: '',
      award_rank: '',
      certificate_name: '',
      certificate_issuer: ''
    };
    setData(prev => ({
      ...prev,
      awards: [...prev.awards, newAward]
    }));
  };

  const removeAward = (index: number) => {
    setData(prev => ({
      ...prev,
      awards: prev.awards.filter((_: AwardsData, i: number) => i !== index)
    }));
  };

  const updateSkillsLanguageData = (newData: Partial<SkillsLanguageData>) => {
    setData(prev => ({
      ...prev,
      skillsLanguage: { ...prev.skillsLanguage, ...newData }
    }));
  };

  // 新增：获取选中模块的数据
  const getSelectedData = () => {
    const selectedData: any = {};
    
    if (data.moduleSelection.header) {
      selectedData.header = data.header;
    }
    if (data.moduleSelection.education) {
      selectedData.education = data.education;
    }
    if (data.moduleSelection.workExperience) {
      selectedData.workExperience = data.workExperience;
    }
    if (data.moduleSelection.research) {
      selectedData.research = data.research;
    }
    if (data.moduleSelection.activities) {
      selectedData.activities = data.activities;
    }
    if (data.moduleSelection.awards) {
      selectedData.awards = data.awards;
    }
    if (data.moduleSelection.skillsLanguage) {
      selectedData.skillsLanguage = data.skillsLanguage;
    }
    
    return selectedData;
  };

  // 新增：获取缺失字段的方法
  const getMissingFields = (moduleId: string): string[] => {
    const requiredFields = REQUIRED_FIELDS[moduleId as keyof typeof REQUIRED_FIELDS];
    if (!requiredFields) return [];

    const missing: string[] = [];

    switch (moduleId) {
      case 'header':
        Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
          const value = data.header[key as keyof HeaderData];
          if (typeof value === 'string' && !value.trim()) {
            missing.push(label);
          } else if (!value) {
            missing.push(label);
          }
        });
        break;

      case 'education':
        Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
          const value = data.education[key as keyof EducationData];
          if (typeof value === 'string' && !value.trim()) {
            missing.push(label);
          }
        });
        break;

      case 'workExperience':
        if (data.workExperience.length === 0) {
          missing.push('需要至少添加一个工作经历');
        } else {
          // 检查第一个工作经历的必填字段
          const firstExp = data.workExperience[0];
          Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
            const value = firstExp[key as keyof WorkExperienceData];
            if (typeof value === 'string' && !value.trim()) {
              missing.push(label);
            }
          });
        }
        break;

      case 'research':
        if (data.research.length === 0) {
          missing.push('需要至少添加一个研究项目');
        } else {
          // 检查第一个研究项目的必填字段
          const firstResearch = data.research[0];
          Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
            const value = firstResearch[key as keyof ResearchData];
            if (typeof value === 'string' && !value.trim()) {
              missing.push(label);
            }
          });
        }
        break;

      case 'activities':
        if (data.activities.length === 0) {
          missing.push('需要至少添加一个活动经历');
        } else {
          // 检查第一个活动的必填字段
          const firstActivity = data.activities[0];
          Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
            const value = firstActivity[key as keyof ActivitiesData];
            if (typeof value === 'string' && !value.trim()) {
              missing.push(label);
            }
          });
        }
        break;

      case 'awards':
        if (data.awards.length === 0) {
          missing.push('需要至少添加一个奖项');
        } else {
          // 检查第一个奖项的必填字段
          const firstAward = data.awards[0];
          Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
            const value = firstAward[key as keyof AwardsData];
            if (typeof value === 'string' && !value.trim()) {
              missing.push(label);
            }
          });
        }
        break;

      case 'skillsLanguage':
        Object.entries(requiredFields).forEach(([key, label]: [string, string]) => {
          const value = data.skillsLanguage[key as keyof SkillsLanguageData];
          if (typeof value === 'string' && !value.trim()) {
            missing.push(label);
          }
        });
        break;
    }

    return missing;
  };

  // 更新选中模板的方法
  const updateSelectedTemplate = (template: string) => {
    setData(prev => ({
      ...prev,
      selectedTemplate: template
    }));
    saveToCache();
  };

  // 新增：更新主题颜色的方法
  const updateThemeColor = (themeColor: string) => {
    setData(prev => ({
      ...prev,
      themeColor: themeColor
    }));
    saveToCache();
  };

  // 新增：布局管理相关方法
  const updateLayoutConfiguration = (layout: LayoutConfiguration) => {
    setData(prev => ({
      ...prev,
      layoutConfiguration: layout
    }));
    saveToCache();
  };

  const moveModuleToMain = (moduleId: string) => {
    setData(prev => {
      const newLayout = { ...prev.layoutConfiguration };
      // 从sidebar中移除
      newLayout.sidebarSections = newLayout.sidebarSections.filter(id => id !== moduleId);
      // 添加到main末尾
      if (!newLayout.mainSections.includes(moduleId)) {
        newLayout.mainSections.push(moduleId);
      }
      return {
        ...prev,
        layoutConfiguration: newLayout
      };
    });
    saveToCache();
  };

  const moveModuleToSidebar = (moduleId: string) => {
    setData(prev => {
      const newLayout = { ...prev.layoutConfiguration };
      // 从main中移除
      newLayout.mainSections = newLayout.mainSections.filter(id => id !== moduleId);
      // 添加到sidebar末尾
      if (!newLayout.sidebarSections.includes(moduleId)) {
        newLayout.sidebarSections.push(moduleId);
      }
      return {
        ...prev,
        layoutConfiguration: newLayout
      };
    });
    saveToCache();
  };

  const reorderMainSections = (newOrder: string[]) => {
    setData(prev => ({
      ...prev,
      layoutConfiguration: {
        ...prev.layoutConfiguration,
        mainSections: newOrder
      }
    }));
    saveToCache();
  };

  const reorderSidebarSections = (newOrder: string[]) => {
    setData(prev => ({
      ...prev,
      layoutConfiguration: {
        ...prev.layoutConfiguration,
        sidebarSections: newOrder
      }
    }));
    saveToCache();
  };

  // 生成状态管理
  const setGenerationLoading = (loading: boolean) => {
    setGenerationState(prev => ({ ...prev, isGenerating: loading }));
  };

  const setGenerationError = (error: string | null) => {
    setGenerationState(prev => ({ ...prev, error }));
  };

  const setLanguagePreference = (language: 'English' | 'Chinese') => {
    setGenerationState(prev => ({ ...prev, languagePreference: language }));
    // 同时保存到localStorage
    try {
      localStorage.setItem('resume_language_preference', language);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // 文档管理方法
  const setDocumentUuid = useCallback((uuid: string | null) => {
    setDocumentState(prev => ({ ...prev, documentUuid: uuid }));
  }, []);

  const saveDocument = async () => {
    console.log('[ResumeContext] saveDocument called, documentUuid:', documentState.documentUuid);
    try {
      setDocumentState(prev => ({ ...prev, isSaving: true, saveError: null }));

      const payload = {
        uuid: documentState.documentUuid,
        resumeData: data,
        template: data.selectedTemplate,
        themeColor: data.themeColor,
        layoutConfiguration: data.layoutConfiguration,
        moduleSelection: data.moduleSelection,
        title: data.header.full_name ? `${data.header.full_name}的简历` : '未命名简历'
      };

      console.log('[ResumeContext] Saving with payload:', payload);

      let response;
      if (documentState.documentUuid) {
        // Update existing document
        console.log('[ResumeContext] Updating existing document');
        response = await fetch(`/api/documents/resume/${documentState.documentUuid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new document
        response = await fetch('/api/documents/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const result = await response.json();
      console.log('[ResumeContext] Save response:', result);
      
      if (!documentState.documentUuid && result.data?.uuid) {
        console.log('[ResumeContext] Setting new document UUID:', result.data.uuid);
        setDocumentUuid(result.data.uuid);
      }

      setDocumentState(prev => ({
        ...prev,
        isSaving: false,
        lastSavedAt: new Date(),
        saveError: null
      }));
      console.log('[ResumeContext] Save completed successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      setDocumentState(prev => ({
        ...prev,
        isSaving: false,
        saveError: error instanceof Error ? error.message : 'Failed to save document'
      }));
    }
  };

  const loadDocument = useCallback(async (uuid: string) => {
    try {
      setDocumentState(prev => ({ ...prev, isLoading: true, documentUuid: uuid }));

      const response = await fetch(`/api/documents/resume/${uuid}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found');
        }
        throw new Error('Failed to load document');
      }

      const result = await response.json();
      const document = result.data;

      if (document?.form_data) {
        // Inline the initialization logic to avoid dependency issues
        const formData = document.form_data;
        
        // Check if the data structure has resumeData nested
        let resumeData, template, themeColor, layoutConfiguration, moduleSelection;
        
        if (formData.resumeData) {
          resumeData = formData.resumeData;
          template = formData.template || resumeData.selectedTemplate;
          themeColor = formData.themeColor || resumeData.themeColor;
          layoutConfiguration = formData.layoutConfiguration || resumeData.layoutConfiguration;
          moduleSelection = formData.moduleSelection || resumeData.moduleSelection;
        } else {
          ({ resumeData, template, themeColor, layoutConfiguration, moduleSelection } = formData);
        }

        // Extract the actual resume data fields
        const extractedData = {
          header: resumeData.header || defaultResumeData.header,
          education: resumeData.education || defaultResumeData.education,
          workExperience: resumeData.workExperience || defaultResumeData.workExperience,
          research: resumeData.research || defaultResumeData.research,
          activities: resumeData.activities || defaultResumeData.activities,
          awards: resumeData.awards || defaultResumeData.awards,
          skillsLanguage: resumeData.skillsLanguage || defaultResumeData.skillsLanguage,
          moduleSelection: moduleSelection || resumeData.moduleSelection || defaultResumeData.moduleSelection,
          selectedTemplate: template || resumeData.selectedTemplate || defaultResumeData.selectedTemplate,
          themeColor: themeColor || resumeData.themeColor || defaultResumeData.themeColor,
          layoutConfiguration: layoutConfiguration || resumeData.layoutConfiguration || defaultResumeData.layoutConfiguration
        };

        // Ensure required modules remain selected
        REQUIRED_MODULES.forEach(moduleId => {
          if (extractedData.moduleSelection) {
            extractedData.moduleSelection[moduleId] = true;
          }
        });

        setData(extractedData);
        setDocumentState(prev => ({ ...prev, documentUuid: document.uuid }));
      }

      setDocumentState(prev => ({
        ...prev,
        isLoading: false,
        lastSavedAt: document.updated_at ? new Date(document.updated_at) : null
      }));
    } catch (error) {
      console.error('Error loading document:', error);
      setDocumentState(prev => ({
        ...prev,
        isLoading: false,
        saveError: error instanceof Error ? error.message : 'Failed to load document'
      }));
      throw error; // Re-throw to handle in component
    }
  }, []);


  const value: ResumeContextType = {
    data,
    isEditMode,
    updateHeaderData,
    updateEducationData,
    updateWorkExperienceData,
    addWorkExperience,
    removeWorkExperience,
    updateResearchData,
    addResearch,
    removeResearch,
    updateActivitiesData,
    addActivity,
    removeActivity,
    updateAwardsData,
    addAward,
    removeAward,
    updateSkillsLanguageData,
    toggleModuleSelection,
    isModuleSelected,
    isModuleRequired,
    isModuleCompleted,
    getCompletedModulesCount,
    getConfirmationData,
    getIncompleteSelections,
    canGenerate,
    saveToCache,
    loadFromCache,
    getMissingFields,
    updateSelectedTemplate,
    updateThemeColor,
    getSelectedData,
    updateLayoutConfiguration,
    moveModuleToMain,
    moveModuleToSidebar,
    reorderMainSections,
    reorderSidebarSections,
    generationState,
    setGenerationLoading,
    setGenerationError,
    setLanguagePreference,
    documentState,
    saveDocument,
    loadDocument,
    setDocumentUuid
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
} 