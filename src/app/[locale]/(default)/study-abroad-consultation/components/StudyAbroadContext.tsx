"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface StudyAbroadData {
  basicInfo: {
    full_name: string;
    phone: string;
    email: string;
    wechat: string;
  };
  polishingDetails: {
    uploaded_document_name: string;
    uploaded_document_url: string;
    polishing_requirements: string;
    return_method: 'email' | 'wechat' | '';
    return_email: string;
    return_wechat: string;
  };
  academicBackground: {
    current_degree: string;
    current_school: string;
    major: string;
    gpa: string;
    graduation_date: string;
    language_scores: string;
  };
  targetProgram: {
    target_degree: string;
    target_country: string;
    target_major: string;
    target_schools: string;
    application_year: string;
    budget_range: string;
  };
  backgroundExperience: {
    research_experience: string;
    internship_experience: string;
    competition_awards: string;
    publications: string;
    other_achievements: string;
  };
  consultationNeeds: {
    main_concerns: string;
    service_expectations: string;
    preferred_consultation_time: string;
    additional_notes: string;
  };
}

interface StudyAbroadContextType {
  data: StudyAbroadData;
  updateBasicInfo: (data: Partial<StudyAbroadData['basicInfo']>) => void;
  updatePolishingDetails: (data: Partial<StudyAbroadData['polishingDetails']>) => void;
  updateAcademicBackground: (data: Partial<StudyAbroadData['academicBackground']>) => void;
  updateTargetProgram: (data: Partial<StudyAbroadData['targetProgram']>) => void;
  updateBackgroundExperience: (data: Partial<StudyAbroadData['backgroundExperience']>) => void;
  updateConsultationNeeds: (data: Partial<StudyAbroadData['consultationNeeds']>) => void;
  resetData: () => void;
  saveToCache: () => void;
  loadFromCache: () => void;
  fillMockData: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  submissionError: string | null;
  setSubmissionError: (error: string | null) => void;
}

const initialData: StudyAbroadData = {
  basicInfo: {
    full_name: '',
    phone: '',
    email: '',
    wechat: ''
  },
  polishingDetails: {
    uploaded_document_name: '',
    uploaded_document_url: '',
    polishing_requirements: '',
    return_method: '',
    return_email: '',
    return_wechat: ''
  },
  academicBackground: {
    current_degree: '',
    current_school: '',
    major: '',
    gpa: '',
    graduation_date: '',
    language_scores: ''
  },
  targetProgram: {
    target_degree: '',
    target_country: '',
    target_major: '',
    target_schools: '',
    application_year: '',
    budget_range: ''
  },
  backgroundExperience: {
    research_experience: '',
    internship_experience: '',
    competition_awards: '',
    publications: '',
    other_achievements: ''
  },
  consultationNeeds: {
    main_concerns: '',
    service_expectations: '',
    preferred_consultation_time: '',
    additional_notes: ''
  }
};

const StudyAbroadContext = createContext<StudyAbroadContextType | undefined>(undefined);

const CACHE_KEY = 'study_abroad_consultation_data';

export function StudyAbroadProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StudyAbroadData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const saveToCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const loadFromCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          // Migrate old data that doesn't have polishingDetails
          if (!parsedData.polishingDetails) {
            parsedData.polishingDetails = {
              uploaded_document_name: '',
              uploaded_document_url: '',
              polishing_requirements: '',
              return_method: '',
              return_email: '',
              return_wechat: ''
            };
          }
          setData(parsedData);
        } catch (error) {
          console.error('Failed to load cached data:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadFromCache();
  }, []);

  useEffect(() => {
    saveToCache();
  }, [data, saveToCache]);

  const updateBasicInfo = useCallback((newData: Partial<StudyAbroadData['basicInfo']>) => {
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...newData }
    }));
  }, []);

  const updatePolishingDetails = useCallback((newData: Partial<StudyAbroadData['polishingDetails']>) => {
    setData(prev => ({
      ...prev,
      polishingDetails: { ...prev.polishingDetails, ...newData }
    }));
  }, []);

  const updateAcademicBackground = useCallback((newData: Partial<StudyAbroadData['academicBackground']>) => {
    setData(prev => ({
      ...prev,
      academicBackground: { ...prev.academicBackground, ...newData }
    }));
  }, []);

  const updateTargetProgram = useCallback((newData: Partial<StudyAbroadData['targetProgram']>) => {
    setData(prev => ({
      ...prev,
      targetProgram: { ...prev.targetProgram, ...newData }
    }));
  }, []);

  const updateBackgroundExperience = useCallback((newData: Partial<StudyAbroadData['backgroundExperience']>) => {
    setData(prev => ({
      ...prev,
      backgroundExperience: { ...prev.backgroundExperience, ...newData }
    }));
  }, []);

  const updateConsultationNeeds = useCallback((newData: Partial<StudyAbroadData['consultationNeeds']>) => {
    setData(prev => ({
      ...prev,
      consultationNeeds: { ...prev.consultationNeeds, ...newData }
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const fillMockData = useCallback(() => {
    setData({
      basicInfo: {
        full_name: '张三',
        phone: '13812345678',
        email: 'zhangsan@example.com',
        wechat: 'zhangsan_wx'
      },
      polishingDetails: {
        uploaded_document_name: 'personal-statement-draft.pdf',
        uploaded_document_url: '/temp/mock-document.pdf',
        polishing_requirements: '希望老师重点关注语法错误和表达流畅度，特别是第二段关于研究经历的部分。',
        return_method: 'wechat',
        return_email: '',
        return_wechat: 'zhangsan_wx'
      },
      academicBackground: {
        current_degree: '本科',
        current_school: '清华大学',
        major: '计算机科学与技术',
        gpa: '3.8/4.0',
        graduation_date: '2025-06',
        language_scores: 'TOEFL 105, GRE 325'
      },
      targetProgram: {
        target_degree: '硕士',
        target_country: '美国',
        target_major: '计算机科学',
        target_schools: 'MIT, Stanford, CMU',
        application_year: '2025 Fall',
        budget_range: '50-60万人民币/年'
      },
      backgroundExperience: {
        research_experience: '参与国家自然科学基金项目，发表SCI论文1篇',
        internship_experience: '字节跳动算法工程师实习6个月',
        competition_awards: 'ACM-ICPC亚洲区域赛银奖',
        publications: 'IEEE Conference论文一作1篇',
        other_achievements: '校级优秀学生干部，志愿服务100小时'
      },
      consultationNeeds: {
        main_concerns: '选校定位、文书准备、面试指导',
        service_expectations: '全程申请指导、文书润色、模拟面试',
        preferred_consultation_time: '周末下午2-5点',
        additional_notes: '希望了解奖学金申请和实习机会'
      }
    });
  }, []);

  const value: StudyAbroadContextType = {
    data,
    updateBasicInfo,
    updatePolishingDetails,
    updateAcademicBackground,
    updateTargetProgram,
    updateBackgroundExperience,
    updateConsultationNeeds,
    resetData,
    saveToCache,
    loadFromCache,
    fillMockData,
    isSubmitting,
    setIsSubmitting,
    submissionError,
    setSubmissionError
  };

  return (
    <StudyAbroadContext.Provider value={value}>
      {children}
    </StudyAbroadContext.Provider>
  );
}

export function useStudyAbroad() {
  const context = useContext(StudyAbroadContext);
  if (!context) {
    throw new Error('useStudyAbroad must be used within StudyAbroadProvider');
  }
  return context;
}