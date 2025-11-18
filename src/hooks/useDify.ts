import { useState, useCallback } from 'react';
import {
  DifyWorkflowRunRequest,
  DifyWorkflowRunResponse,
  DifyWorkflowStatus,
  DifyFileUploadResponse,
  DifyWorkflowLogsQuery,
  DifyWorkflowLogsResponse,
  DifyFunctionType
} from '@/types/dify';
import type { StreamingCallbacks } from '@/services/dify-sse';
import { sendWorkflowStreamingMessage } from '@/services/dify-sse';

interface UseDifyOptions {
  baseUrl?: string;
  functionType?: DifyFunctionType;
}

export function useDify(options: UseDifyOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = options.baseUrl || '/api/dify';
  const defaultFunctionType = options.functionType || 'default';

  const handleRequest = useCallback(async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 检查Dify API的返回格式：{ code: 0, message: "ok", data: ... }
      if (data.code !== 0) {
        throw new Error(data.message || 'API 调用失败');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 执行 workflow
  const runWorkflow = useCallback(async (
    request: DifyWorkflowRunRequest,
    functionType?: DifyFunctionType
  ): Promise<DifyWorkflowRunResponse> => {
    return handleRequest<DifyWorkflowRunResponse>(
      `${baseUrl}/workflows/run`,
      {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          function_type: functionType || defaultFunctionType,
        }),
      }
    );
  }, [baseUrl, defaultFunctionType, handleRequest]);

  // 获取 workflow 运行状态
  const getWorkflowStatus = useCallback(async (
    workflowRunId: string,
    functionType?: DifyFunctionType
  ): Promise<DifyWorkflowStatus> => {
    const params = new URLSearchParams({
      function_type: functionType || defaultFunctionType,
    });

    return handleRequest<DifyWorkflowStatus>(
      `${baseUrl}/workflows/run/${workflowRunId}?${params}`,
      {
        method: 'GET',
      }
    );
  }, [baseUrl, defaultFunctionType, handleRequest]);

  // 停止 workflow
  const stopWorkflow = useCallback(async (
    taskId: string,
    user: string,
    functionType?: DifyFunctionType
  ): Promise<{ result: string }> => {
    return handleRequest<{ result: string }>(
      `${baseUrl}/workflows/tasks/${taskId}/stop`,
      {
        method: 'POST',
        body: JSON.stringify({
          user,
          function_type: functionType || defaultFunctionType,
        }),
      }
    );
  }, [baseUrl, defaultFunctionType, handleRequest]);

  // 上传文件
  const uploadFile = useCallback(async (
    file: File,
    user: string,
    type?: string,
    functionType?: DifyFunctionType
  ): Promise<DifyFileUploadResponse> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user', user);
      formData.append('function_type', functionType || defaultFunctionType);
      if (type) {
        formData.append('type', type);
      }

      const response = await fetch(`${baseUrl}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 检查Dify API的返回格式：{ code: 0, message: "ok", data: ... }
      if (data.code !== 0) {
        throw new Error(data.message || '文件上传失败');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '文件上传失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, defaultFunctionType]);

  // 获取 workflow 日志
  const getWorkflowLogs = useCallback(async (
    query?: DifyWorkflowLogsQuery,
    functionType?: DifyFunctionType
  ): Promise<DifyWorkflowLogsResponse> => {
    const params = new URLSearchParams({
      function_type: functionType || defaultFunctionType,
    });
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${baseUrl}/workflows/logs?${params}`;
    return handleRequest<DifyWorkflowLogsResponse>(url, {
      method: 'GET',
    });
  }, [baseUrl, defaultFunctionType, handleRequest]);

  // 流式调用 workflow
  const runWorkflowStreaming = useCallback(async (
    request: DifyWorkflowRunRequest,
    onChunk: (chunk: any) => void,
    onError?: (error: Error) => void,
    functionType?: DifyFunctionType
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/workflows/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          response_mode: 'streaming',
          function_type: functionType || defaultFunctionType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onChunk(data);
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '流式调用失败';
      setError(errorMessage);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  }, [baseUrl, defaultFunctionType]);

  // 官方推荐的 SSE 流式调用（使用回调接口）
  const runWorkflowStreamingWithCallbacks = useCallback(async (
    request: DifyWorkflowRunRequest,
    callbacks: Required<
      Pick<
        StreamingCallbacks,
        'onWorkflowStarted' | 'onNodeStarted' | 'onNodeFinished' | 'onWorkflowFinished'
      >
    > &
      Pick<StreamingCallbacks, 'onError' | 'onTextChunk'>,
    functionType?: DifyFunctionType
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await sendWorkflowStreamingMessage(
        {
          ...request,
          function_type: functionType || defaultFunctionType,
        },
        callbacks
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '流式调用失败';
      setError(errorMessage);
      callbacks.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [defaultFunctionType]);

  return {
    loading,
    error,
    runWorkflow,
    getWorkflowStatus,
    stopWorkflow,
    uploadFile,
    getWorkflowLogs,
    runWorkflowStreaming,
    runWorkflowStreamingWithCallbacks, // 新增：官方推荐的 SSE 流式调用
  };
} 