# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Essmote AI" (ZhiXieJiang) is a Next.js 15-based AI SaaS platform for document generation including resumes, cover letters, recommendation letters, personal statements, and SOPs. Built with React 19, TypeScript strict mode, and Tailwind CSS v4 for deployment on Vercel, Cloudflare, and Docker.

## Development Commands

### Core Development
```bash
pnpm install          # Install dependencies
pnpm dev              # Development with turbopack (port 3000)
pnpm build            # Production build with TypeScript strict checking
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm analyze          # Bundle analysis (ANALYZE=true pnpm build)
```

### Cloudflare Deployment
```bash
pnpm cf:preview       # Preview on Cloudflare
pnpm cf:deploy        # Deploy (copy all env vars to wrangler.toml [vars])
pnpm cf:upload        # Upload to Cloudflare
pnpm cf:typegen       # Generate Cloudflare types
```

### Docker
```bash
pnpm docker:build     # Build Docker image (standalone output)
```

## Architecture Patterns

### Tech Stack
- **Next.js 15.2.3** with App Router and React 19
- **TypeScript** with strict mode enforced in production builds
- **Tailwind CSS v4** with Shadcn/ui components
- **next-intl** for i18n (en/zh locales)
- **next-auth v5 beta** for authentication
- **Supabase** for database and storage
- **Stripe** for payments
- **Dify AI** for workflow-based document generation

### Authentication Flow
Configured in `src/auth/config.ts` with multiple providers:
- Email/password authentication when `NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED=true`
- Google OAuth with One Tap when `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`
- GitHub OAuth when `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`
- Session management with JWT

### AI Integration Pattern
The `DifyService` (`src/services/dify.ts`) manages AI workflows:
```typescript
// Function-specific API keys
const functionType: DifyFunctionType = 'recommendation-letter' | 'cover-letter' | 'resume-generator' | 'sop' | 'personal-statement';

// Use the hook with function type
const { runWorkflow, uploadFile } = useDify({ functionType });

// Stream responses
await runWorkflowStreaming(
  payload,
  (chunk) => { /* handle chunk */ },
  (error) => { /* handle error */ },
  functionType
);
```

Environment variables:
- `DIFY_API_KEY_RECOMMENDATION_LETTER`
- `DIFY_API_KEY_COVER_LETTER`
- `DIFY_API_KEY_RESUME_GENERATOR`
- `DIFY_API_KEY_SOP`
- `DIFY_API_KEY_PERSONAL_STATEMENT`
- `DIFY_API_KEY` (default fallback)

### Document Generation Architecture
Each document feature follows this structure:
```
feature-name/
├── components/
│   ├── FeatureContext.tsx          # React Context state management
│   ├── FeatureGeneratorClient.tsx  # Main UI component
│   └── modules/                    # Form sections
├── page.tsx                        # Server component entry
└── result/
    └── components/
        └── FeatureResultClient.tsx # Streaming result display
```

### Resume Template System
- **Field Mapping**: `src/lib/resume-field-mapping.ts` converts form data to `StandardResumeData`
- **Templates**: Multiple templates in `src/components/templates/` (kakuna, ditto)
- **Dual View**: Template preview and markdown editing modes
- **Print Optimization**: A4 size with proper scaling

### Security Patterns
- **Rate Limiting**: `src/lib/security/simple-rate-limiter.ts` - Memory-based rate limiter for uploads (10 req/5min per user, 20 req/5min per IP)
- **File Upload Security**: Validation in API routes with size and type checks
- **Authentication**: All sensitive operations check user session
- **API Keys**: User-provided service keys stored in database

### Database Models & Services
Each model in `src/models/` has a corresponding service in `src/services/`:
- **User**: Credits system, profile management
- **Order**: Stripe integration, payment tracking
- **Document**: Version control, revisions
- **APIKey**: User-provided service keys
- **Credit**: Transaction history
- **Feedback**: User feedback collection

## TypeScript Strict Mode Rules

Production builds enforce strict TypeScript. Common patterns:

### Array Method Type Annotations
```typescript
// ✅ Correct
items.map((item: ItemType) => item.name)
displayContent.split('\n\n').map((paragraph: string, index: number) => ...)

// ❌ Will fail in production
items.map((item) => item.name)
```

### Type Assertions for Incompatible Types
```typescript
// ✅ Use unknown as intermediate
value as unknown as TargetType

// ❌ Direct conversion may fail
value as TargetType
```

### Next.js 15 Async Params
```typescript
// ✅ Correct pattern
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;

// ❌ Old pattern
{ params }: { params: { id: string } }
```

### React DnD Refs
```typescript
// ✅ Ref callback returns void
ref={(node) => {
  drag(drop(node));
}}

// ❌ Ref callback returns non-void
ref={(node) => drag(drop(node))}
```

## Critical Environment Variables

### Authentication
- `AUTH_SECRET`: NextAuth secret
- `AUTH_URL`: Application URL
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth
- `NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED`: Enable email/password auth

### Services
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Database
- `STRIPE_PUBLIC_KEY`, `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`: Payments
- `DIFY_BASE_URL`: AI service base URL
- `S3_*`: S3-compatible storage configuration

### Deployment
- Development: `.env.development`
- Production: `.env.production`
- Cloudflare: Copy all env vars to `wrangler.toml` under `[vars]`

## Project Structure

```
src/
├── app/[locale]/           # Locale-specific pages
│   ├── (admin)/           # Admin dashboard
│   ├── (default)/         # Public pages
│   │   ├── (console)/     # User dashboard
│   │   └── [features]/    # Document generation features
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── components/
│   ├── blocks/            # Large layout components
│   ├── ui/                # Shadcn/ui components
│   └── templates/         # Resume templates
├── services/              # Business logic
├── models/                # Database models
├── lib/                   # Utilities
│   └── security/          # Security utilities
└── i18n/                  # Internationalization
    ├── messages/          # Global translations
    └── pages/             # Page-specific translations
```

## Development Workflow

### Before Pushing Code
1. Run `pnpm build` locally to catch TypeScript errors
2. Fix all type errors - don't use `@ts-ignore`
3. Ensure all array callbacks have typed parameters
4. Check for missing object properties
5. Test both `en` and `zh` locales

### Creating New Document Features
1. Create feature directory under `src/app/[locale]/(default)/`
2. Implement context provider for state management
3. Create modular form components in `modules/`
4. Add result page with streaming AI response
5. Update i18n files for new strings
6. Configure Dify API key if needed

### Code Conventions
- TypeScript for all new code
- React functional components with hooks
- Tailwind CSS with Shadcn/ui components
- Internationalization for all user-facing text
- React Context for complex state management
- Sonner for toast notifications
- Use `@/` path alias for imports from `src/`
- Server Components by default, `"use client"` only when needed

## Dify AI Module Integration

### Overview
The Dify module provides AI workflow execution for document generation. It supports multiple function types with isolated API keys and handles both blocking and streaming responses.

### Architecture

#### Service Layer (`src/services/dify.ts`)
The `DifyService` class manages all Dify API interactions:
- **Multi-tenant API Keys**: Each function type has its own API key
- **Response Modes**: Supports both `blocking` and `streaming` modes
- **File Uploads**: Handles document uploads for AI processing

#### Function Types
```typescript
type DifyFunctionType = 'recommendation-letter' | 'cover-letter' | 'resume-generator' | 'sop' | 'personal-statement' | 'default';
```

Each function type maps to environment variables:
- `DIFY_API_KEY_RECOMMENDATION_LETTER`
- `DIFY_API_KEY_COVER_LETTER`
- `DIFY_API_KEY_RESUME_GENERATOR`
- `DIFY_API_KEY_SOP`
- `DIFY_API_KEY_PERSONAL_STATEMENT`
- `DIFY_API_KEY` (default fallback)

### Understanding runWorkflow

#### Request Structure
```typescript
const payload = {
  inputs: {
    // Your input data as key-value pairs
    context: "...",
    type: "..."
  },
  response_mode: 'blocking' | 'streaming',
  user: 'user-identifier'
};
```

#### Response Structure (Blocking Mode)
The Dify API returns a deeply nested structure:
```typescript
{
  workflow_run_id: "...",
  task_id: "...",
  data: {
    id: "...",
    workflow_id: "...",
    status: "succeeded",
    outputs: {
      // Your actual output data
      text: "...",  // For text generation
      structured_output: {  // For structured data
        fieldName: value,
        // ...
      }
    }
  }
}
```

#### Extracting Outputs
```typescript
// Common extraction patterns
const text = response.data?.outputs?.text;
const structured = response.data?.outputs?.structured_output;
```

### Handling Structured Outputs

#### Resume AI Example (`src/services/resume-ai.ts`)
The Resume AI service demonstrates structured output handling:

```typescript
// Different output structures by type
switch (type) {
  case 0: // Education - Returns array
    return { courseList: ["Course 1", "Course 2"] };
  
  case 1: // Skills - Returns array
    return { skillsList: ["Skill 1", "Skill 2"] };
  
  case 2: // Work Experience - Returns array
    return { responsibilities: ["Task 1", "Task 2"] };
  
  case 4: // Research Background - Returns string
    return { background: "Description text" };
}
```

#### Parsing Strategy
1. Extract the nested `outputs` object from Dify response
2. Access the `structured_output` field
3. Parse based on expected structure for the function type
4. Format for display (arrays to bullet points, etc.)

### Integration Patterns

#### Client-Side Hook (`src/hooks/useDify.ts`)
```typescript
const { runWorkflow, runWorkflowStreaming } = useDify({ 
  functionType: 'resume-generator' 
});

// Blocking call
const result = await runWorkflow({
  inputs: { /* your data */ },
  response_mode: 'blocking',
  user: 'user-id'
});

// Streaming call
await runWorkflowStreaming(
  request,
  (chunk) => { /* handle each chunk */ },
  (error) => { /* handle errors */ }
);
```

#### API Route Pattern (`src/app/api/dify/workflows/run/route.ts`)
- Validates function type and API key availability
- Handles both streaming and blocking modes
- Returns appropriate response format

#### Response Handling in Components
```typescript
// Extract from nested structure
const content = result.data?.data?.outputs?.text || 
                result.data?.outputs?.text || 
                result.outputs?.text;

// Handle structured output
const structured = result.data?.outputs?.structured_output;
if (structured?.courseList) {
  // Handle array of courses
}
```

### Adding New AI Interfaces

#### Step 1: Define Function Type
Add to `DifyFunctionType` in `src/types/dify.d.ts`:
```typescript
type DifyFunctionType = '...existing...' | 'your-new-function';
```

#### Step 2: Configure API Key
1. Add environment variable: `DIFY_API_KEY_YOUR_NEW_FUNCTION`
2. Update `API_KEY_MAP` in `src/services/dify.ts`

#### Step 3: Create Service Layer
```typescript
export class YourNewAIService {
  async generateContent(inputs: any) {
    const response = await difyService.runWorkflow(
      { inputs, response_mode: 'blocking', user },
      'your-new-function'
    );
    
    // Extract and parse structured output
    const outputs = response.data?.outputs || {};
    return this.parseResponse(outputs);
  }
  
  private parseResponse(outputs: any) {
    // Handle your specific structured output format
    return {
      structured_output: {
        // Your fields
      }
    };
  }
}
```

#### Step 4: Create Hook for UI Integration
```typescript
export function useYourNewAI() {
  const { runWorkflow } = useDify({ 
    functionType: 'your-new-function' 
  });
  // Implementation
}
```

#### Step 5: Handle Streaming (if needed)
For real-time generation, use streaming mode:
```typescript
await runWorkflowStreaming(
  request,
  (chunk) => {
    // Parse SSE chunks
    if (chunk.event === 'text_chunk') {
      updateContent(chunk.data.text);
    }
  }
);
```

### Common Pitfalls & Solutions

1. **Nested Response Structure**: Always check multiple levels (`data.outputs`, `data.data.outputs`)
2. **Type Safety**: Define interfaces for your structured outputs
3. **Error Handling**: Check API key availability before calling
4. **Streaming Parsing**: Handle SSE format with proper line splitting
5. **Field Mapping**: Document expected output structure for each function type

## Server-Sent Events (SSE) Streaming Architecture

### Overview

The SSE streaming architecture provides real-time, typewriter-style content generation for document features. Instead of waiting for the entire response to complete (blocking mode), SSE streams content as it's generated, providing immediate user feedback and a better experience.

**Benefits:**
- **Real-time Feedback**: Users see content appear word-by-word as the AI generates it
- **Better UX**: Loading states transition immediately to content display on first chunk
- **Progress Visibility**: Users know the AI is working, reducing perceived wait time
- **Flexible**: Can handle both text streaming and structured outputs

**When to Use:**
- ✅ Long-form document generation (SOP, cover letters, personal statements)
- ✅ Features where users benefit from seeing incremental progress
- ❌ Quick operations where streaming overhead isn't worth it
- ❌ Structured-only outputs with no user-visible text

### Architecture Components

#### 1. Service Layer (`src/services/dify-sse.ts`)

Core SSE handling service following the official Dify template:

```typescript
// Event type definitions
export type IOnTextChunk = (
  text: string,
  isFirstChunk: boolean,
  moreInfo: { messageId?: string; fromVariable?: string }
) => void;

export interface StreamingCallbacks {
  onWorkflowStarted?: (data: WorkflowStartedResponse) => void;
  onNodeStarted?: (data: NodeStartedResponse) => void;
  onNodeFinished?: (data: NodeFinishedResponse) => void;
  onTextChunk?: IOnTextChunk;
  onWorkflowFinished?: (data: WorkflowFinishedResponse) => void;
  onError?: (msg: string, code?: string) => void;
}

// Main streaming function
export const sendWorkflowStreamingMessage = async (
  url: string,
  options: RequestInit,
  callbacks: StreamingCallbacks
): Promise<void> => {
  // Fetch with stream
  const response = await fetch(url, options);

  // Process ReadableStream
  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let isFirstMessage = true;

  // Read stream chunks
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));

        // Handle text_chunk events
        if (data.event === 'text_chunk') {
          const text = data.data?.text || data.text || '';
          callbacks.onTextChunk?.(text, isFirstMessage, {
            messageId: data.task_id,
            fromVariable: data.data?.from_variable_selector?.[1]
          });
          isFirstMessage = false;
        }

        // Handle other events
        if (data.event === 'workflow_started') {
          callbacks.onWorkflowStarted?.(data);
        }
        // ... etc
      }
    }
  }
};
```

**Key Features:**
- Uses native `ReadableStream` API (not EventSource)
- Handles SSE format: `data: {json}\n\n`
- Unicode character conversion for proper text display
- First chunk detection flag

#### 2. Hook Layer (`src/hooks/useDify.ts`)

Extends the useDify hook with streaming callback support:

```typescript
const runWorkflowStreamingWithCallbacks = useCallback(async (
  request: DifyWorkflowRunRequest,
  callbacks: Required<
    Pick<StreamingCallbacks, 'onWorkflowStarted' | 'onNodeStarted' | 'onNodeFinished' | 'onWorkflowFinished'>
  > & Pick<StreamingCallbacks, 'onError' | 'onTextChunk'>,
  functionType?: DifyFunctionType
): Promise<void> => {
  const apiKey = getApiKey(functionType || defaultFunctionType);

  await sendWorkflowStreamingMessage(
    '/api/dify/workflows/run',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ ...request, functionType: functionType || defaultFunctionType })
    },
    callbacks
  );
}, [defaultFunctionType]);

return { runWorkflowStreamingWithCallbacks, /* ... */ };
```

#### 3. API Route Pattern (`src/app/api/dify/workflows/run/route.ts`)

Direct stream forwarding from Dify API:

```typescript
if (response_mode === 'streaming') {
  const difyResponse = await fetch(`${baseUrl}/workflows/run`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs, response_mode: 'streaming', user }),
  });

  // IMPORTANT: Forward the stream directly, don't await json()
  return new Response(difyResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Critical:** Don't call `.json()` on the response - forward the body stream directly.

#### 4. Component Integration Pattern

Reference implementation: `src/app/[locale]/(default)/sop/result/[uuid]/components/SOPResultClient.tsx`

```typescript
// 1. Add streaming states
const [isStreamingText, setIsStreamingText] = useState(false);
const [firstChunkReceived, setFirstChunkReceived] = useState(false);
const [currentNodeName, setCurrentNodeName] = useState('');
const contentEndRef = useRef<HTMLDivElement>(null);

// 2. Text accumulation (official template pattern)
const chunks: string[] = [];

// 3. Call streaming with callbacks
await runWorkflowStreamingWithCallbacks(
  {
    inputs: { /* your data */ },
    response_mode: 'streaming',
    user: 'user-id'
  },
  {
    onWorkflowStarted: (data) => {
      setWorkflowRunId(data.workflow_run_id);
      console.log('[Streaming] Workflow started');
    },

    onNodeStarted: (data) => {
      setCurrentNodeName(data.data.title || data.data.node_type);
    },

    onTextChunk: (text: string, isFirst: boolean) => {
      // First chunk closes loading immediately
      if (isFirst && !firstChunkReceived) {
        setFirstChunkReceived(true);
        setGenerationLoading(false);
        setIsStreamingText(true);
      }

      // Accumulate chunks
      chunks.push(text);
      const fullText = chunks.join('');

      // Update display (triggers re-render for typewriter effect)
      updateGeneratedContent(fullText);
    },

    onNodeFinished: (data) => {
      // text_chunk already handled text, this is for metadata
      console.log('[Streaming] Node finished:', data.data.title);
    },

    onWorkflowFinished: (data) => {
      setIsStreamingText(false);
      setCurrentNodeName('');

      // Get final content from outputs (fallback if no text_chunk events)
      const finalContent = data.data.outputs?.text ||
                          data.data.outputs?.output ||
                          '';

      if (finalContent && !firstChunkReceived) {
        updateGeneratedContent(finalContent);
      }

      // Save to database with smart word count
      const wordCount = smartWordCount(finalContent, languagePreference);
      await fetch('/api/documents', {
        method: 'PUT',
        body: JSON.stringify({
          uuid: documentUuid,
          content: finalContent,
          word_count: wordCount.count.toString()
        })
      });
    },

    onError: (msg, code) => {
      setGenerationError(msg);
      setGenerationLoading(false);
      setIsStreamingText(false);
    }
  },
  'sop' // function type
);

// 4. Update loading condition
// ONLY show loader if generating AND no chunks received yet
if (generationState.isGenerating && !firstChunkReceived) {
  return <AIGeneratingLoader currentNodeName={currentNodeName} />;
}

// 5. Show streaming indicator
{isStreamingText && (
  <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
    <Loader2 className="w-4 h-4 animate-spin text-primary" />
    <span className="text-sm text-muted-foreground">
      {currentNodeName || 'AI 正在生成内容...'}
    </span>
    <Badge variant="secondary" className="ml-auto">
      {wordCountInfo.count} {wordCountInfo.label}
    </Badge>
  </div>
)}

// 6. Auto-scroll during streaming
useEffect(() => {
  if (isStreamingText && contentEndRef.current) {
    contentEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}, [displayContent, isStreamingText]);

// Add ref at end of content
<div ref={contentEndRef} />
```

### Event Types & Flow

SSE events arrive in this order:

1. **`workflow_started`**: Workflow execution begins
   - Contains: `workflow_run_id`, `task_id`
   - Action: Store IDs, update UI to show workflow started

2. **`node_started`**: Each workflow node begins processing
   - Contains: `node_id`, `node_type`, `title`, `inputs`
   - Action: Display current node name to user

3. **`text_chunk`**: Individual text pieces stream in (THIS IS KEY!)
   - Contains: `text` (single word or character), `from_variable_selector`
   - Action: Accumulate chunks, update display, close loading on first chunk
   - **Pattern**: Text arrives as individual words like `"From"`, `" the"`, `" moment"`, etc.

4. **`node_finished`**: Node completes
   - Contains: `outputs`, `execution_metadata`
   - Action: Log completion, extract metadata (NOT primary text source)

5. **`workflow_finished`**: Complete workflow finishes
   - Contains: `status`, `outputs`, `total_tokens`, `elapsed_time`
   - Action: Final cleanup, save to database, show success message

### Key Implementation Patterns

#### Pattern 1: Text Accumulation Strategy

```typescript
// ✅ CORRECT: Array accumulation (official template pattern)
const chunks: string[] = [];

onTextChunk: (text, isFirst) => {
  chunks.push(text);              // Add to array
  const fullText = chunks.join(''); // Join for display
  updateGeneratedContent(fullText); // Trigger React re-render
}

// ❌ WRONG: String concatenation (can cause memory issues)
let fullText = '';
onTextChunk: (text, isFirst) => {
  fullText += text; // Don't do this
}
```

#### Pattern 2: First Chunk Detection

```typescript
// ✅ CORRECT: Close loading immediately on first chunk
onTextChunk: (text, isFirst) => {
  if (isFirst && !firstChunkReceived) {
    setFirstChunkReceived(true);
    setGenerationLoading(false);  // Close loader NOW
    setIsStreamingText(true);      // Show streaming indicator
  }
  // ... accumulate text
}

// ❌ WRONG: Waiting for workflow_started or other events
onWorkflowStarted: (data) => {
  setGenerationLoading(false); // Too early! No text yet
}
```

#### Pattern 3: Loading Condition

```typescript
// ✅ CORRECT: Check both generating AND no chunks received
if (generationState.isGenerating && !firstChunkReceived) {
  return <AIGeneratingLoader />;
}

// ❌ WRONG: Only checking isGenerating
if (generationState.isGenerating) {
  return <AIGeneratingLoader />; // Will show loader even after chunks arrive
}
```

#### Pattern 4: Smart Word Count Integration

```typescript
import { smartWordCount } from '@/lib/word-count';

// Define AFTER displayContent to avoid initialization order errors
const displayContent = currentVersion > 1
  ? versions.find(v => v.version === currentVersion)?.content
  : generationState.generatedContent || '';

// Smart word count with useMemo optimization
const wordCountInfo = useMemo(() => {
  return smartWordCount(displayContent, generationState.languagePreference);
}, [displayContent, generationState.languagePreference]);

// Use in UI and database
<Badge>{wordCountInfo.count} {wordCountInfo.label}</Badge>

// Database save
word_count: wordCountInfo.count.toString()
```

The `smartWordCount` function:
- **English**: Counts words (space-separated)
- **Chinese**: Counts characters (excluding spaces)
- Returns: `{ count: number, type: 'words' | 'characters', label: 'words' | '字' }`

### Integration Checklist for New Features

When adding SSE to a new feature (cover-letter, personal-statement, etc.):

- [ ] **Step 1: Add Streaming States**
  ```typescript
  const [isStreamingText, setIsStreamingText] = useState(false);
  const [firstChunkReceived, setFirstChunkReceived] = useState(false);
  const [currentNodeName, setCurrentNodeName] = useState('');
  const contentEndRef = useRef<HTMLDivElement>(null);
  ```

- [ ] **Step 2: Import Required Utilities**
  ```typescript
  import { smartWordCount } from '@/lib/word-count';
  const { runWorkflowStreamingWithCallbacks } = useDify({ functionType: 'your-feature' });
  ```

- [ ] **Step 3: Implement Callbacks**
  - Copy callback pattern from SOPResultClient
  - Update function type
  - Adjust content extraction based on your feature's output structure

- [ ] **Step 4: Update Loading Logic**
  ```typescript
  if (isGenerating && !firstChunkReceived) {
    return <Loader />;
  }
  ```

- [ ] **Step 5: Add Streaming Indicator UI**
  - Show current node name
  - Display real-time word count
  - Add loading spinner

- [ ] **Step 6: Implement Auto-scroll**
  ```typescript
  useEffect(() => {
    if (isStreamingText && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayContent, isStreamingText]);
  ```

- [ ] **Step 7: Update Database Saves**
  - Use `smartWordCount` for all word count saves
  - Save final content in `onWorkflowFinished`

- [ ] **Step 8: Handle Variable Initialization Order**
  - Define `displayContent` BEFORE `wordCountInfo`
  - Use `useMemo` for `wordCountInfo` to optimize

### Common Pitfalls & Solutions

1. **ReferenceError: Cannot access 'displayContent' before initialization**
   - **Cause**: Using `displayContent` in `wordCountInfo` useMemo before it's declared
   - **Fix**: Move `wordCountInfo` definition AFTER `displayContent`

2. **Loading persists after text starts streaming**
   - **Cause**: Not updating loading state on first chunk
   - **Fix**: Set `setGenerationLoading(false)` in `onTextChunk` when `isFirst === true`

3. **Text doesn't appear during streaming**
   - **Cause**: Processing text in `onNodeFinished` instead of `onTextChunk`
   - **Fix**: Use `onTextChunk` callback for real-time text display

4. **Incorrect word count for Chinese documents**
   - **Cause**: Using `displayContent.length` which counts all characters
   - **Fix**: Use `smartWordCount(content, language)` which handles both English and Chinese

5. **Stream connection errors**
   - **Cause**: Calling `.json()` on streaming response in API route
   - **Fix**: Forward `response.body` directly with proper headers

6. **TypeScript errors on callbacks**
   - **Cause**: Missing type annotations on callback parameters
   - **Fix**: Explicitly type all parameters: `onTextChunk: (text: string, isFirst: boolean) => {}`

7. **Memory issues with long documents**
   - **Cause**: String concatenation in loop
   - **Fix**: Use array accumulation: `chunks.push(text); chunks.join('')`

### Files Reference

**Core Implementation:**
- `src/services/dify-sse.ts` - SSE service layer
- `src/hooks/useDify.ts` - React hook with streaming support
- `src/lib/word-count.ts` - Language-aware word counting

**Example Integration:**
- `src/app/[locale]/(default)/sop/result/[uuid]/components/SOPResultClient.tsx` - Complete reference implementation

**API Configuration:**
- `src/app/api/dify/workflows/run/route.ts` - Stream forwarding API route