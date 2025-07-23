'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/app";

const PROJECT_TYPES = ['web', 'app', 'saas', 'ai', 'mini', 'system', 'other'] as const;
const BUDGET_RANGES = ['small', 'medium', 'large', 'enterprise'] as const;

interface ContactFormProps {
  title: string;
  subtitle: string;
  translations: {
    name: string;
    email: string;
    emailTip: string;
    projectType: string;
    selectProjectType: string;
    budget: string;
    selectBudget: string;
    message: string;
    messagePlaceholder: string;
    needsNda: string;
    ndaDescription: string;
    submit: string;
    submitting: string;
    privacyNotice: string;
    privacyPolicy: string;
    projectTypes: {
      web: string;
      app: string;
      saas: string;
      ai: string;
      mini: string;
      system: string;
      other: string;
    };
    budgetRanges: {
      small: string;
      medium: string;
      large: string;
      enterprise: string;
    };
  };
}

export default function ContactForm({ title, subtitle, translations }: ContactFormProps) {
  const { theme } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
    needsNda: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!formData.name || !formData.email || !formData.projectType || !formData.budget || !formData.message) {
      toast.error('请填写必填字段');
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

      if (!response.ok) {
        throw new Error('提交失败');
      }

      toast.success('提交成功，我们会尽快与您联系');
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        message: '',
        needsNda: false
      });
    } catch (error) {
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

  const handleNdaChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      needsNda: checked
    }));
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
        <h2 className="text-4xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
          <form onSubmit={handleSubmit} className="lg:flex-auto">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
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
                    placeholder="请输入邮箱或手机号码"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="projectType" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.projectType} *
                </label>
                <div className="mt-2.5">
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="">{translations.selectProjectType}</option>
                    {PROJECT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {translations.projectTypes[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="budget" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.budget} *
                </label>
                <div className="mt-2.5">
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="">{translations.selectBudget}</option>
                    {BUDGET_RANGES.map(range => (
                      <option key={range} value={range}>
                        {translations.budgetRanges[range]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-foreground">
                  {translations.message} *
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={translations.messagePlaceholder}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="nda"
                    checked={formData.needsNda}
                    onCheckedChange={handleNdaChange}
                  />
                  <Label htmlFor="nda" className="text-sm font-semibold leading-6 text-foreground">
                    {translations.needsNda}
                  </Label>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {translations.ndaDescription}
                </p>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="block w-full rounded-md bg-primary text-primary-foreground px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                {isSubmitting ? translations.submitting : translations.submit}
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
          <div className="lg:mt-6 lg:w-80 lg:flex-none">
            <div className="flex items-center">
              <Image
                src={theme === "dark" ? "/logowhite.png" : "/logo.png"}
                alt="Company Logo"
                width={150}
                height={48}
                className="h-12 w-auto"
              />
              <p className="ml-4 text-lg font-semibold text-foreground">
                Yander Tech
              </p>
            </div>
            <div className="mt-10">
              <Image
                src="/imgs/cooperation.png"
                alt="Cooperation"
                width={320}
                height={240}
                className="w-full rounded-lg"
              />
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground">
                  合作流程
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  我们提供完整的合作流程，确保您的项目顺利进行。
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    需求咨询与评估
                  </li>
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    方案制定与报价
                  </li>
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    开发实施与交付
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 