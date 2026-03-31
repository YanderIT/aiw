# Dify 集成文档

本项目已集成 Dify Workflow API，支持根据不同功能类型使用不同的 API Key，适用于推荐信、求职信、简历生成等多种场景。

## 环境配置

在 `.env.development` 文件中添加以下配置：

```bash
# Dify API 配置
DIFY_BASE_URL=https://api.dify.ai/v1

# 各功能模块的 API Key
DIFY_API_KEY_RECOMMENDATION_LETTER=app-0ijkJYyAMBqz4kkwfHIf8Q4N  # 推荐信功能
DIFY_API_KEY_COVER_LETTER=app-xxxxxxxxxxxxxxxxxx           # 求职信功能  
DIFY_API_KEY_RESUME_GENERATOR=app-xxxxxxxxxxxxxxxxxx       # 简历生成功能
DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxx                       # 默认 API Key
```

## 功能类型

支持的功能类型（`function_type`）：
- `recommendation-letter` - 推荐信生成
- `cover-letter` - 求职信生成  
- `resume-generator` - 简历生成
- `default` - 默认功能

## API 端点

### 1. 执行 Workflow

**POST** `/api/dify/workflows/run`

```json
{
  "inputs": {
    "prompt": "你好世界"
  },
  "response_mode": "blocking",
  "user": "user-123",
  "function_type": "recommendation-letter"
}
```

### 2. 获取 Workflow 运行状态

**GET** `/api/dify/workflows/run/[workflow_run_id]?function_type=recommendation-letter`

### 3. 停止 Workflow

**POST** `/api/dify/workflows/tasks/[task_id]/stop`

```json
{
  "user": "user-123",
  "function_type": "recommendation-letter"
}
```

### 4. 上传文件

**POST** `/api/dify/files/upload`

使用 FormData 上传：
- `file`: 文件对象
- `user`: 用户ID
- `function_type`: 功能类型
- `type`: 文件类型（可选）

### 5. 获取 Workflow 日志

**GET** `/api/dify/workflows/logs?function_type=recommendation-letter&page=1&limit=20`

### 6. 示例/状态检查

**GET** `/api/dify/demo` - 获取 API 状态和可用功能类型
**POST** `/api/dify/demo` - 简单示例调用

```json
{
  "prompt": "测试内容",
  "function_type": "recommendation-letter"
}
```

## 前端使用

### 使用 Hook（推荐方式）

```typescript
import { useDify } from '@/hooks/useDify';

function RecommendationLetterComponent() {
  // 为推荐信功能预设功能类型
  const { 
    loading, 
    error, 
    runWorkflow, 
    uploadFile, 
    getWorkflowLogs 
  } = useDify({ 
    functionType: 'recommendation-letter' 
  });

  const handleRunWorkflow = async () => {
    try {
      const result = await runWorkflow({
        inputs: { prompt: '生成推荐信' },
        response_mode: 'blocking',
        user: 'user-123'
      });
      // 会自动使用 recommendation-letter 的 API Key
      console.log('结果:', result);
    } catch (err) {
      console.error('错误:', err);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      const result = await uploadFile(file, 'user-123');
      // 会自动使用 recommendation-letter 的 API Key
      console.log('文件上传成功:', result);
    } catch (err) {
      console.error('上传失败:', err);
    }
  };

  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      <button onClick={handleRunWorkflow}>
        生成推荐信
      </button>
    </div>
  );
}
```

### 动态指定功能类型

```typescript
function MultiPurposeComponent() {
  const { runWorkflow } = useDify();

  const handleRunRecommendationLetter = async () => {
    await runWorkflow({
      inputs: { prompt: '生成推荐信' },
      response_mode: 'blocking',
      user: 'user-123'
    }, 'recommendation-letter'); // 明确指定功能类型
  };

  const handleRunCoverLetter = async () => {
    await runWorkflow({
      inputs: { prompt: '生成求职信' },
      response_mode: 'blocking',
      user: 'user-123'
    }, 'cover-letter'); // 明确指定功能类型
  };

  return (
    <div>
      <button onClick={handleRunRecommendationLetter}>
        生成推荐信
      </button>
      <button onClick={handleRunCoverLetter}>
        生成求职信
      </button>
    </div>
  );
}
```

### 流式调用

```typescript
const handleStreamingWorkflow = async () => {
  await runWorkflowStreaming(
    {
      inputs: { prompt: '写一封推荐信' },
      response_mode: 'streaming',
      user: 'user-123'
    },
    (chunk) => {
      console.log('接收到数据:', chunk);
      // 处理流式数据
    },
    (error) => {
      console.error('流式调用错误:', error);
    },
    'recommendation-letter' // 指定功能类型
  );
};
```

## 直接使用服务

```typescript
import { difyService } from '@/services/dify';

// 在服务端或 API 路由中使用
const result = await difyService.runWorkflow({
  inputs: { text: '输入内容' },
  response_mode: 'blocking',
  user: 'user-123'
}, 'recommendation-letter'); // 指定功能类型
```

## 文件上传示例

```typescript
const handleFileUpload = async (file: File) => {
  try {
    // 1. 上传文件（使用推荐信 API Key）
    const fileResult = await uploadFile(file, 'user-123', 'TXT', 'recommendation-letter');
    
    // 2. 在 workflow 中使用上传的文件
    const workflowResult = await runWorkflow({
      inputs: {
        document: [{
          transfer_method: 'local_file',
          upload_file_id: fileResult.id,
          type: 'document'
        }]
      },
      response_mode: 'blocking',
      user: 'user-123'
    }, 'recommendation-letter');
    
    console.log('处理结果:', workflowResult);
  } catch (error) {
    console.error('处理失败:', error);
  }
};
```

## API Key 状态检查

```typescript
import { difyService } from '@/services/dify';

// 检查特定功能类型的 API Key 是否可用
const isRecommendationLetterAvailable = difyService.checkApiKey('recommendation-letter');
const isCoverLetterAvailable = difyService.checkApiKey('cover-letter');

// 获取所有可用的功能类型
const availableFunctionTypes = difyService.getAvailableFunctionTypes();
console.log('可用功能:', availableFunctionTypes);
```

## 错误处理

所有 API 调用都会返回统一的响应格式：

```json
{
  "success": true,
  "data": {}, // 成功时的数据
  "message": "操作成功"
}
```

错误时：

```json
{
  "success": false,
  "message": "功能类型 'recommendation-letter' 的 API Key 未配置",
  "error": "详细错误"
}
```

## 类型定义

所有相关的 TypeScript 类型定义都在 `@/types/dify` 中，包括：

- `DifyFunctionType` - 功能类型
- `DifyWorkflowRunRequest`
- `DifyWorkflowRunResponse` 
- `DifyWorkflowStatus`
- `DifyFileUploadResponse`
- `DifyWorkflowLogsQuery`
- `DifyWorkflowLogsResponse`
- `DifyStreamEvent`
- `DifyFileInput`

## 实际使用场景

### 推荐信生成
```typescript
// 在推荐信组件中
const { runWorkflow } = useDify({ functionType: 'recommendation-letter' });

// 调用推荐信生成 workflow
await runWorkflow({
  inputs: {
    student_name: '张三',
    recommender_name: '李教授',
    // ... 其他推荐信相关输入
  },
  response_mode: 'blocking',
  user: 'user-123'
});
```

### 求职信生成
```typescript
// 在求职信组件中
const { runWorkflow } = useDify({ functionType: 'cover-letter' });

// 调用求职信生成 workflow
await runWorkflow({
  inputs: {
    applicant_name: '张三',
    position: '软件工程师',
    company: '某科技公司',
    // ... 其他求职信相关输入
  },
  response_mode: 'blocking',
  user: 'user-123'
});
```

## 注意事项

1. **环境变量配置**：确保为每个功能类型配置正确的 API Key
2. **功能类型匹配**：使用时确保 `function_type` 参数与您的业务逻辑匹配
3. **API Key 可用性**：在调用前可以使用 `checkApiKey()` 检查对应的 API Key 是否可用
4. **错误处理**：妥善处理 API Key 未配置的情况
5. **流式调用**：适合长时间运行的任务，如长文本生成
6. **安全性**：在生产环境中确保 API Key 的安全性

## 测试

1. **状态检查**：访问 `/api/dify/demo` 查看所有功能类型的 API Key 状态
2. **功能测试**：使用不同的 `function_type` 测试各个功能模块
3. **错误测试**：尝试使用未配置的功能类型，验证错误处理 