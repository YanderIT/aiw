// Dify API 类型定义

// 功能类型定义
export type DifyFunctionType = 'recommendation-letter' | 'cover-letter' | 'resume-generator' | 'default';

export interface DifyWorkflowRunRequest {
  inputs: Record<string, any>;
  response_mode: 'streaming' | 'blocking';
  user: string;
}

export interface DifyWorkflowRunResponse {
  workflow_run_id: string;
  task_id: string;
  data: {
    id: string;
    workflow_id: string;
    status: 'running' | 'succeeded' | 'failed' | 'stopped';
    outputs?: any;
    error?: string;
    elapsed_time?: number;
    total_tokens?: number;
    total_steps?: number;
    created_at: number;
    finished_at?: number;
  };
}

export interface DifyWorkflowStatus {
  id: string;
  workflow_id: string;
  status: 'running' | 'succeeded' | 'failed' | 'stopped';
  inputs: any;
  outputs?: any;
  error?: string;
  total_steps: number;
  total_tokens: number;
  created_at: number;
  finished_at?: number;
  elapsed_time: number;
}

export interface DifyFileUploadResponse {
  id: string;
  name: string;
  size: number;
  extension: string;
  mime_type: string;
  created_by: string;
  created_at: number;
}

export interface DifyWorkflowStopRequest {
  user: string;
}

export interface DifyWorkflowStopResponse {
  result: 'success';
}

export interface DifyWorkflowLogsQuery {
  keyword?: string;
  status?: 'succeeded' | 'failed' | 'stopped';
  page?: number;
  limit?: number;
  created_by_end_user_session_id?: string;
  created_by_account?: string;
}

export interface DifyWorkflowLogsResponse {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
  data: Array<{
    id: string;
    workflow_run: {
      id: string;
      version: string;
      status: 'running' | 'succeeded' | 'failed' | 'stopped';
      error?: string;
      elapsed_time: number;
      total_tokens: number;
      total_steps: number;
      created_at: number;
      finished_at?: number;
    };
    created_from: string;
    created_by_role: string;
    created_by_account?: string;
    created_by_end_user: {
      id: string;
      type: string;
      is_anonymous: boolean;
      session_id: string;
    };
    created_at: number;
  }>;
}

// 流式响应事件类型
export interface DifyStreamEvent {
  event: 'workflow_started' | 'node_started' | 'text_chunk' | 'node_finished' | 'workflow_finished' | 'tts_message' | 'tts_message_end' | 'ping';
  task_id: string;
  workflow_run_id: string;
  data: any;
}

// 文件上传时的文件输入类型
export interface DifyFileInput {
  type: 'document' | 'image' | 'audio' | 'video' | 'custom';
  transfer_method: 'remote_url' | 'local_file';
  url?: string;
  upload_file_id?: string;
} 