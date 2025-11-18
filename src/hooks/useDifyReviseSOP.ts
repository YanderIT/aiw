import { useState, useCallback } from 'react';
import { useDify } from './useDify';
import type { StreamingCallbacks } from '@/services/dify-sse';

interface ReviseParams {
  revise_type: string; // "0"代表保持原本，"1"代表扩写，"2"代表缩写
  style: string; // 风格要求
  original_word_count: string; // 原字数
  word_count: string; // 字数要求
  detail: string; // 补充修改方向
  original_context: string; // 原文
  whole: string; // "0"代表整篇，"1"代表段落
  language: string; // 语言设置
}

export function useDifyReviseSOP() {
  const [isRevising, setIsRevising] = useState(false);
  const { runWorkflowStreamingWithCallbacks } = useDify({
    functionType: 'revise-sop'
  });

  const runRevision = async (params: ReviseParams) => {
    setIsRevising(true);

    console.log('[SOP Revision] Starting revision with params:', params);

    try {
      const response = await fetch('/api/dify/revise-sop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      console.log('[SOP Revision] Response status:', response.status);
      console.log('[SOP Revision] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SOP Revision] API error response:', errorText);
        throw new Error(`SOP Revision API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[SOP Revision] Revision response data:', data);
      return data.content || "";
    } catch (error) {
      console.error('[SOP Revision] Revision failed:', error);
      throw error;
    } finally {
      setIsRevising(false);
    }
  };

  // Streaming revision function
  const runRevisionStreaming = useCallback(async (
    params: ReviseParams,
    callbacks: StreamingCallbacks
  ) => {
    setIsRevising(true);

    console.log('[SOP Revision Streaming] Starting revision with params:', params);

    try {
      await runWorkflowStreamingWithCallbacks(
        {
          inputs: params,
          response_mode: 'streaming',
          user: `revise-sop-${Date.now()}`
        },
        {
          ...callbacks,
          onWorkflowStarted: (data) => {
            console.log('[SOP Revision Streaming] Workflow started:', data.workflow_run_id);
            callbacks.onWorkflowStarted?.(data);
          },
          onError: (msg: string, code?: string) => {
            console.error('[SOP Revision Streaming] Error:', msg, code);
            setIsRevising(false);
            callbacks.onError?.(msg, code);
          },
          onWorkflowFinished: (data) => {
            console.log('[SOP Revision Streaming] Workflow finished');
            setIsRevising(false);
            callbacks.onWorkflowFinished?.(data);
          }
        },
        'revise-sop'
      );
    } catch (error) {
      console.error('[SOP Revision Streaming] Revision failed:', error);
      setIsRevising(false);
      throw error;
    }
  }, [runWorkflowStreamingWithCallbacks]);

  return {
    runRevision,
    runRevisionStreaming,
    isRevising
  };
}
