"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// SOP数据结构
export interface SOPData {
  target: string;          // 申请目标
  education: string;       // 教育背景
  skill: string;          // 相关技能
  research: string;       // 研究经历
  workExperience: string; // 工作经历
  plan: string;           // 未来规划
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
interface SOPContextType {
  data: SOPData;
  updateField: (field: keyof SOPData, value: string) => void;
  updateData: (newData: Partial<SOPData>) => void;
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
  getFormData: () => SOPData;
}

// 创建Context
const SOPContext = createContext<SOPContextType | undefined>(undefined);

// 缓存键
const CACHE_KEY = 'sop-form-data';
const GENERATION_CACHE_KEY = 'sop-generation-state';

// Provider组件
export function SOPProvider({ children }: { children: ReactNode }) {
  // 初始数据
  const initialData: SOPData = {
    target: '',
    education: '',
    skill: '',
    research: '',
    workExperience: '',
    plan: ''
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

  const [data, setData] = useState<SOPData>(initialData);
  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);

  // 更新单个字段
  const updateField = (field: keyof SOPData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 批量更新数据
  const updateData = (newData: Partial<SOPData>) => {
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
  const getFormData = (): SOPData => {
    return {
      ...data,
      // 可以在这里添加语言偏好等额外字段
    };
  };

  // 缓存管理
  const saveToCache = () => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(GENERATION_CACHE_KEY, JSON.stringify(generationState));
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  };

  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedGeneration = localStorage.getItem(GENERATION_CACHE_KEY);
      
      if (cachedData) {
        setData(JSON.parse(cachedData));
      }
      
      if (cachedGeneration) {
        const parsed = JSON.parse(cachedGeneration);
        setGenerationState({
          ...parsed,
          isGenerating: false // 重置生成状态
        });
      }
    } catch (error) {
      console.error('Failed to load from cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(GENERATION_CACHE_KEY);
      setData(initialData);
      setGenerationState(initialGenerationState);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  // 自动保存
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToCache();
    }, 1000); // 1秒后自动保存

    return () => clearTimeout(timeoutId);
  }, [data, generationState]);

  // 初始加载
  useEffect(() => {
    loadFromCache();
  }, []);

  const value: SOPContextType = {
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
    <SOPContext.Provider value={value}>
      {children}
    </SOPContext.Provider>
  );
}

// 自定义Hook
export function useSOP() {
  const context = useContext(SOPContext);
  if (context === undefined) {
    throw new Error('useSOP must be used within a SOPProvider');
  }
  return context;
}