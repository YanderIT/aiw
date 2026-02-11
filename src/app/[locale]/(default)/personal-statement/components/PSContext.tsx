"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// PS数据结构
export interface PSData {
  target: string;          // 申请目标
  education: string;       // 教育背景
  skill: string;          // 相关技能
  research: string;       // 研究经历
  workExperience: string; // 工作经历
  reason: string;         // 申请理由
}

// 生成状态
export interface GenerationState {
  isGenerating: boolean;
  generatedContent: string;
  lastGeneratedAt: number | null;
  error: string | null;
  workflowRunId: string | null;
  taskId: string | null;
  workflowStatus: 'running' | 'succeeded' | 'failed' | 'stopped' | null;
  languagePreference: 'English' | 'Chinese';
}

// Context类型定义
interface PSContextType {
  data: PSData;
  updateField: (field: keyof PSData, value: string) => void;
  updateData: (newData: Partial<PSData>) => void;
  generationState: GenerationState;
  setGenerationLoading: (loading: boolean) => void;
  setGenerationError: (error: string | null) => void;
  updateGeneratedContent: (content: string) => void;
  setWorkflowIds: (workflowRunId: string, taskId: string) => void;
  setWorkflowStatus: (status: GenerationState['workflowStatus']) => void;
  setLanguagePreference: (lang: 'English' | 'Chinese') => void;
  canGenerate: () => boolean;
  saveToCache: () => void;
  loadFromCache: () => void;
  clearCache: () => void;
  getFormData: () => PSData;
}

// 创建Context
const PSContext = createContext<PSContextType | undefined>(undefined);

// 缓存键
const CACHE_KEY = 'ps-form-data';
const GENERATION_CACHE_KEY = 'ps-generation-state';

// Provider组件
export function PSProvider({ children }: { children: ReactNode }) {
  // 初始数据
  const initialData: PSData = {
    target: '',
    education: '',
    skill: '',
    research: '',
    workExperience: '',
    reason: ''
  };

  const initialGenerationState: GenerationState = {
    isGenerating: false,
    generatedContent: '',
    lastGeneratedAt: null,
    error: null,
    workflowRunId: null,
    taskId: null,
    workflowStatus: null,
    languagePreference: 'English'
  };

  const [data, setData] = useState<PSData>(initialData);
  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);

  // 更新单个字段
  const updateField = (field: keyof PSData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 批量更新数据
  const updateData = (newData: Partial<PSData>) => {
    setData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // 设置生成状态
  const setGenerationLoading = (loading: boolean) => {
    setGenerationState(prev => ({
      ...prev,
      isGenerating: loading,
      error: loading ? null : prev.error
    }));
  };

  const setGenerationError = (error: string | null) => {
    setGenerationState(prev => ({
      ...prev,
      error
    }));
  };

  const updateGeneratedContent = (content: string) => {
    setGenerationState(prev => ({
      ...prev,
      generatedContent: content,
      lastGeneratedAt: Date.now()
    }));
  };

  const setWorkflowIds = (workflowRunId: string, taskId: string) => {
    setGenerationState(prev => ({
      ...prev,
      workflowRunId,
      taskId,
      workflowStatus: 'running'
    }));
  };

  const setWorkflowStatus = (status: GenerationState['workflowStatus']) => {
    setGenerationState(prev => ({
      ...prev,
      workflowStatus: status
    }));
  };

  const setLanguagePreference = (lang: 'English' | 'Chinese') => {
    setGenerationState(prev => ({
      ...prev,
      languagePreference: lang
    }));
  };

  // 检查是否可以生成
  const canGenerate = (): boolean => {
    // 至少需要填写目标和教育背景
    return !!(data.target && data.education);
  };

  // 获取表单数据（包含语言偏好）
  const getFormData = (): PSData => {
    return {
      ...data
    };
  };

  // 缓存管理
  const saveToCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(GENERATION_CACHE_KEY, JSON.stringify(generationState));
    }
  };

  const loadFromCache = () => {
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedGenState = localStorage.getItem(GENERATION_CACHE_KEY);
      
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setData(parsed);
        } catch (e) {
          console.error('Failed to parse cached data:', e);
        }
      }
      
      if (cachedGenState) {
        try {
          const parsed = JSON.parse(cachedGenState);
          setGenerationState(parsed);
        } catch (e) {
          console.error('Failed to parse cached generation state:', e);
        }
      }
    }
  };

  const clearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(GENERATION_CACHE_KEY);
      setData(initialData);
      setGenerationState(initialGenerationState);
    }
  };

  // 自动保存到缓存（1秒防抖，避免初始空数据覆盖缓存）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToCache();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data, generationState]);

  // 初始加载缓存
  useEffect(() => {
    loadFromCache();
  }, []);

  const value: PSContextType = {
    data,
    updateField,
    updateData,
    generationState,
    setGenerationLoading,
    setGenerationError,
    updateGeneratedContent,
    setWorkflowIds,
    setWorkflowStatus,
    setLanguagePreference,
    canGenerate,
    saveToCache,
    loadFromCache,
    clearCache,
    getFormData
  };

  return (
    <PSContext.Provider value={value}>
      {children}
    </PSContext.Provider>
  );
}

// Hook for using context
export function usePS() {
  const context = useContext(PSContext);
  if (context === undefined) {
    throw new Error('usePS must be used within a PSProvider');
  }
  return context;
}