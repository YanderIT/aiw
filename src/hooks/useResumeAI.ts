import { useState, useCallback } from 'react';
import { ResumeFieldType } from '@/services/resume-ai';
import { toast } from 'sonner';

interface UseResumeAIOptions {
  onSuccess?: (content: string) => void;
  onError?: (error: string) => void;
}

export function useResumeAI(options: UseResumeAIOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(async (
    context: Record<string, any>,
    type: ResumeFieldType
  ): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/resume-ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          type
        }),
      });

      const data = await response.json();
      console.log('[useResumeAI] Response from API:', data);

      if (data.code !== 0) {
        throw new Error(data.message || 'Failed to generate content');
      }

      const content = data.data?.content || '';
      console.log('[useResumeAI] Extracted content:', content);
      
      if (content) {
        toast.success('内容已生成');
        options.onSuccess?.(content);
        return content;
      } else {
        console.error('[useResumeAI] No content in response. Full data:', data);
        throw new Error('No content generated');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成失败，请重试';
      console.error('[useResumeAI] Error:', error);
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  return {
    generateContent,
    isGenerating
  };
}