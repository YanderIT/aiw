'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  FileText, 
  Star, 
  Send,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";

// 反馈类型
const FEEDBACK_TYPES = [
  'document_quality',
  'feature_request', 
  'bug_report',
  'ai_generation',
  'template_issue',
  'account_payment',
  'other'
] as const;

// 满意度等级
const SATISFACTION_LEVELS = [
  'very_satisfied',
  'satisfied',
  'neutral',
  'dissatisfied',
  'very_dissatisfied'
] as const;

// 文档类型
const DOCUMENT_TYPES = [
  'recommendation_letter',
  'cover_letter',
  'personal_statement',
  'sop',
  'resume',
  'study_abroad_consultation',
  'not_applicable'
] as const;

interface ContactFormProps {
  title: string;
  subtitle: string;
  translations: {
    name: string;
    email: string;
    emailTip: string;
    feedbackType: string;
    selectFeedbackType: string;
    documentType: string;
    selectDocumentType: string;
    satisfaction: string;
    selectSatisfaction: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    privacyNotice: string;
    privacyPolicy: string;
    feedbackTypes: {
      document_quality: string;
      feature_request: string;
      bug_report: string;
      ai_generation: string;
      template_issue: string;
      account_payment: string;
      other: string;
    };
    documentTypes: {
      recommendation_letter: string;
      cover_letter: string;
      personal_statement: string;
      sop: string;
      resume: string;
      study_abroad_consultation: string;
      not_applicable: string;
    };
    satisfactionLevels: {
      very_satisfied: string;
      satisfied: string;
      neutral: string;
      dissatisfied: string;
      very_dissatisfied: string;
    };
  };
}

export default function ContactForm({ title, subtitle, translations }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    documentType: '',
    satisfaction: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.name || !formData.email || !formData.feedbackType || !formData.satisfaction || !formData.message) {
      toast.error('请填写所有必填字段');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '提交失败');
      }

      toast.success('感谢您的反馈！我们会认真查看并尽快回复。');
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        feedbackType: '',
        documentType: '',
        satisfaction: '',
        message: ''
      });
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 根据满意度获取对应的颜色
  const getSatisfactionColor = (level: string) => {
    switch(level) {
      case 'very_satisfied': return 'text-green-500';
      case 'satisfied': return 'text-green-400';
      case 'neutral': return 'text-yellow-500';
      case 'dissatisfied': return 'text-orange-500';
      case 'very_dissatisfied': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative isolate bg-background px-6 py-24 sm:py-32 lg:px-8">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-border [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-border/10"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-64}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-64} className="overflow-visible fill-muted/20">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      
      <div className="mx-auto max-w-xl lg:max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          {subtitle}
        </p>
        
        <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
          <form onSubmit={handleSubmit} className="lg:flex-auto">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* 姓名 */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.name} *
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              {/* 联系方式 */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.email} * ({translations.emailTip})
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="请输入邮箱或微信号"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* 反馈类型 */}
              <div className="sm:col-span-2">
                <label htmlFor="feedbackType" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.feedbackType} *
                </label>
                <div className="mt-2.5">
                  <select
                    id="feedbackType"
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="">{translations.selectFeedbackType}</option>
                    {FEEDBACK_TYPES.map(type => (
                      <option key={type} value={type}>
                        {translations.feedbackTypes[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 相关文档类型 */}
              <div className="sm:col-span-2">
                <label htmlFor="documentType" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.documentType}
                </label>
                <div className="mt-2.5">
                  <select
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="">{translations.selectDocumentType}</option>
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {translations.documentTypes[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 满意度 */}
              <div className="sm:col-span-2">
                <label htmlFor="satisfaction" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.satisfaction} *
                </label>
                <div className="mt-2.5">
                  <select
                    id="satisfaction"
                    name="satisfaction"
                    value={formData.satisfaction}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-md border-0 px-3.5 py-2 bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 ${getSatisfactionColor(formData.satisfaction)}`}
                  >
                    <option value="" className="text-foreground">{translations.selectSatisfaction}</option>
                    {SATISFACTION_LEVELS.map(level => (
                      <option key={level} value={level} className="text-foreground">
                        {translations.satisfactionLevels[level]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 详细反馈 */}
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.message} *
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={translations.messagePlaceholder}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="block w-full rounded-md bg-primary text-primary-foreground px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      {translations.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {translations.submit}
                    </>
                  )}
                </span>
              </button>
            </div>
            
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {translations.privacyNotice}{' '}
              <Link href="/privacy-policy" className="font-semibold text-primary hover:text-primary/80">
                {translations.privacyPolicy}
              </Link>
              。
            </p>
          </form>
          
          {/* 右侧信息栏 */}
          <div className="lg:mt-6 lg:w-80 lg:flex-none">
            <div className="rounded-2xl bg-muted/50 p-8">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                为什么选择我们？
              </h3>
              
              <div className="mt-8 space-y-6">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">专业文书服务</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      提供推荐信、求职信、个人陈述、SOP、简历等多种留学文书生成服务
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">AI智能生成</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      基于先进的AI技术，快速生成高质量的个性化文书内容
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">持续优化</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      我们重视每一条用户反馈，不断改进产品体验
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  反馈须知
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• 请提供具体的问题描述或建议</li>
                  <li>• 如遇紧急问题，请联系客服</li>
                  <li>• 我们会在1-2个工作日内回复</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}