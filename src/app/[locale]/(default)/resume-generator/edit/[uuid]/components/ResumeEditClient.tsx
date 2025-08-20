"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from '@/i18n/navigation';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GlobalLoading } from "@/components/ui/loading";
import { ResumeProvider, useResume } from "../../../components/ResumeContext";
import ResumeResultClient from "../../../result/components/ResumeResultClient";
import { useLoadResumeDocument } from "@/hooks/useLoadResumeDocument";

interface ResumeEditClientProps {
  documentUuid: string;
}

function ResumeEditContent({ documentUuid }: ResumeEditClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { documentState, data } = useResume();
  
  // 清除本地缓存，确保从服务器加载数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resume_generator_data');
    }
  }, []);
  
  const { isLoading, error, retry } = useLoadResumeDocument({
    documentUuid,
    redirectOnNotFound: false
  });

  // Handle loading state
  if (isLoading || documentState.isLoading) {
    return <GlobalLoading isVisible={true} />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>加载失败</AlertTitle>
            <AlertDescription>
              {error.message === 'Document not found' 
                ? '该简历不存在或已被删除' 
                : '加载简历时出现错误，请重试'}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-3">
            <Button onClick={retry} variant="outline">
              重试
            </Button>
            <Button onClick={() => router.push('/resume-generator')}>
              创建新简历
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render the resume editor
  return <ResumeResultClient />;
}

export default function ResumeEditClient({ documentUuid }: ResumeEditClientProps) {
  return (
    <ResumeProvider isEditMode={true}>
      <ResumeEditContent documentUuid={documentUuid} />
    </ResumeProvider>
  );
}