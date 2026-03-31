/**
 * Dify SSE (Server-Sent Events) 流式处理服务
 * 基于官方推荐的实现方案
 */

// SSE 事件类型定义
export type WorkflowStartedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    sequence_number: number;
    created_at: number;
  };
};

export type WorkflowFinishedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    status: string;
    outputs: any;
    error: string;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
};

export type NodeStartedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    node_id: string;
    node_type: string;
    index: number;
    predecessor_node_id?: string;
    inputs: any;
    created_at: number;
    extras?: any;
  };
};

export type NodeFinishedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    node_id: string;
    node_type: string;
    index: number;
    predecessor_node_id?: string;
    inputs: any;
    process_data: any;
    outputs: any;
    status: string;
    error: string;
    elapsed_time: number;
    execution_metadata: {
      total_tokens: number;
      total_price: number;
      currency: string;
    };
    created_at: number;
  };
};

export type MessageChunkResponse = {
  event: string;
  message_id: string;
  conversation_id?: string;
  answer: string;
  created_at: number;
};

// 回调函数类型定义
export type IOnDataMoreInfo = {
  conversationId?: string;
  messageId: string;
  errorMessage?: string;
};

export type IOnData = (
  message: string,
  isFirstMessage: boolean,
  moreInfo: IOnDataMoreInfo
) => void;

export type IOnTextChunk = (
  text: string,
  isFirstChunk: boolean,
  moreInfo: { messageId?: string; fromVariable?: string }
) => void;

export type IOnCompleted = (hasError?: boolean) => void;
export type IOnError = (msg: string, code?: string) => void;
export type IOnWorkflowStarted = (data: WorkflowStartedResponse) => void;
export type IOnWorkflowFinished = (data: WorkflowFinishedResponse) => void;
export type IOnNodeStarted = (data: NodeStartedResponse) => void;
export type IOnNodeFinished = (data: NodeFinishedResponse) => void;

export type StreamingCallbacks = {
  onData?: IOnData;
  onTextChunk?: IOnTextChunk;
  onCompleted?: IOnCompleted;
  onError?: IOnError;
  onWorkflowStarted?: IOnWorkflowStarted;
  onWorkflowFinished?: IOnWorkflowFinished;
  onNodeStarted?: IOnNodeStarted;
  onNodeFinished?: IOnNodeFinished;
};

/**
 * Unicode 转字符
 */
function unicodeToChar(text: string): string {
  return text.replace(/\\u[0-9a-f]{4}/g, (match) => {
    return String.fromCharCode(parseInt(match.slice(2), 16));
  });
}

/**
 * 核心 SSE 流处理函数
 * 使用 ReadableStream 处理服务器发送的事件流
 */
const handleStream = (
  response: Response,
  callbacks: StreamingCallbacks
): void => {
  const {
    onData,
    onTextChunk,
    onCompleted,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeStarted,
    onNodeFinished,
    onError,
  } = callbacks;

  if (!response.ok) {
    onError?.(`Network response was not ok: ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError?.('No response body available');
    return;
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let bufferObj: any;
  let isFirstMessage = true;
  let hasError = false;

  // 明确的 reader 类型，避免 TypeScript 错误
  const streamReader = reader;

  function read() {
    streamReader
      .read()
      .then((result: ReadableStreamReadResult<Uint8Array>) => {
        if (result.done) {
          onCompleted?.(hasError);
          return;
        }

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split('\n');

        try {
          lines.forEach((message) => {
            if (!message || !message.startsWith('data: ')) return;

            try {
              // 移除 "data: " 前缀并解析 JSON
              bufferObj = JSON.parse(message.substring(6));
            } catch (e) {
              // JSON 解析失败
              if (onData) {
                onData('', isFirstMessage, {
                  conversationId: bufferObj?.conversation_id,
                  messageId: bufferObj?.id || '',
                  errorMessage: `Failed to parse JSON: ${e}`,
                });
              }
              hasError = true;
              return;
            }

            // 处理不同的事件类型
            if (bufferObj.event === 'message') {
              // Completion 模式的文本 chunk
              onData?.(unicodeToChar(bufferObj.answer), isFirstMessage, {
                conversationId: bufferObj.conversation_id,
                messageId: bufferObj.id,
              });
              isFirstMessage = false;
            } else if (bufferObj.event === 'text_chunk') {
              // Workflow 模式的文本块（逐步返回的文本）
              const text = bufferObj.data?.text || bufferObj.text || '';
              if (text) {
                onTextChunk?.(unicodeToChar(text), isFirstMessage, {
                  messageId: bufferObj.task_id,
                  fromVariable: bufferObj.data?.from_variable_selector?.[1],
                });
                isFirstMessage = false;
              }
            } else if (bufferObj.event === 'workflow_started') {
              // Workflow 开始
              onWorkflowStarted?.(bufferObj as WorkflowStartedResponse);
            } else if (bufferObj.event === 'workflow_finished') {
              // Workflow 完成
              onWorkflowFinished?.(bufferObj as WorkflowFinishedResponse);
            } else if (bufferObj.event === 'node_started') {
              // 节点开始执行
              onNodeStarted?.(bufferObj as NodeStartedResponse);
            } else if (bufferObj.event === 'node_finished') {
              // 节点执行完成
              onNodeFinished?.(bufferObj as NodeFinishedResponse);
            } else if (bufferObj.event === 'error') {
              // 错误事件
              hasError = true;
              onError?.(bufferObj.message || 'Unknown error', bufferObj.code);
            }
          });

          // 保留最后一行（可能不完整）
          buffer = lines[lines.length - 1];
        } catch (e) {
          hasError = true;
          onError?.(`Stream processing error: ${e}`);
          return;
        }

        // 继续读取下一个 chunk
        read();
      })
      .catch((err) => {
        hasError = true;
        onError?.(`Stream reading error: ${err}`);
      });
  }

  read();
};

/**
 * SSE POST 请求
 * 发起流式 POST 请求并处理响应流
 */
export const ssePost = async (
  url: string,
  body: Record<string, any>,
  callbacks: StreamingCallbacks
): Promise<void> => {
  const { onError } = callbacks;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        response_mode: 'streaming',
      }),
    });

    if (!response.ok) {
      // 尝试解析错误信息
      try {
        const errorData = await response.json();
        onError?.(
          errorData.message || `Server Error: ${response.status}`,
          errorData.code
        );
      } catch {
        onError?.(`Server Error: ${response.status}`);
      }
      return;
    }

    // 处理流式响应
    handleStream(response, callbacks);
  } catch (err) {
    onError?.(
      err instanceof Error ? err.message : 'Network request failed'
    );
  }
};

/**
 * 发送 Workflow 流式消息
 */
export const sendWorkflowStreamingMessage = async (
  body: Record<string, any>,
  callbacks: Required<
    Pick<
      StreamingCallbacks,
      'onWorkflowStarted' | 'onNodeStarted' | 'onNodeFinished' | 'onWorkflowFinished'
    >
  > &
    Pick<StreamingCallbacks, 'onError'>
): Promise<void> => {
  return ssePost('/api/dify/workflows/run', body, callbacks);
};

/**
 * 发送 Completion 流式消息
 */
export const sendCompletionStreamingMessage = async (
  body: Record<string, any>,
  callbacks: Required<
    Pick<StreamingCallbacks, 'onData' | 'onCompleted'>
  > &
    Pick<StreamingCallbacks, 'onError'>
): Promise<void> => {
  return ssePost('/api/dify/completion-messages', body, callbacks);
};
