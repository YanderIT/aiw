import { useEffect, useState, useRef } from 'react';
import { useResume } from '@/app/[locale]/(default)/resume-generator/components/ResumeContext';
import { useRouter } from '@/i18n/navigation';

interface UseLoadResumeDocumentOptions {
  documentUuid?: string | null;
  onError?: (error: Error) => void;
  redirectOnNotFound?: boolean;
}

export function useLoadResumeDocument(options: UseLoadResumeDocumentOptions = {}) {
  const { documentUuid, onError, redirectOnNotFound = true } = options;
  const { documentState, loadDocument } = useResume();
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // 简化条件，只要有 documentUuid 且还没加载就执行
    if (!documentUuid || hasLoadedRef.current) {
      return;
    }

    const loadDocumentData = async () => {
      try {
        setError(null);
        await loadDocument(documentUuid);
        hasLoadedRef.current = true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load document');
        setError(error);
        hasLoadedRef.current = true;
        
        if (onError) {
          onError(error);
        }

        if (error.message === 'Document not found' && redirectOnNotFound) {
          // Show error message and redirect
          setTimeout(() => {
            router.push('/resume-generator');
          }, 3000);
        }
      }
    };

    loadDocumentData();
  }, [documentUuid]); // 只依赖 documentUuid

  return {
    isLoading: documentState.isLoading,
    error,
    documentUuid: documentState.documentUuid,
    retry: () => {
      hasLoadedRef.current = false;
      setError(null);
    }
  };
}