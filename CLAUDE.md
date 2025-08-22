# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Essmote AI" (ZhiXieJiang) is a Next.js 15-based AI SaaS platform for document generation including resumes, cover letters, and recommendation letters. Built with React 19, TypeScript strict mode, and Tailwind CSS v4 for deployment on Vercel, Cloudflare, and Docker.

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
- **Firebase** for authentication backend
- **Dify AI** for workflow-based document generation

### Authentication Flow
Configured in `src/auth/config.ts` with multiple providers:
- Email/password via Firebase when `NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED=true`
- Google OAuth with One Tap when `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`
- GitHub OAuth when `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`
- Firebase email link when `NEXT_PUBLIC_FIREBASE_EMAIL_LINK_AUTH_ENABLED=true`
- Session management with JWT

### AI Integration Pattern
The `DifyService` (`src/services/dify.ts`) manages AI workflows:
```typescript
// Function-specific API keys
const functionType: DifyFunctionType = 'recommendation-letter' | 'cover-letter' | 'resume-generator' | 'revise-recommendation-letter';

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
- `DIFY_API_KEY_REVISE_RECOMMENDATION_LETTER`
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
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth

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
type DifyFunctionType = 'recommendation-letter' | 'cover-letter' | 'resume-generator' | 'revise-recommendation-letter' | 'default';
```

Each function type maps to environment variables:
- `DIFY_API_KEY_RECOMMENDATION_LETTER`
- `DIFY_API_KEY_COVER_LETTER`
- `DIFY_API_KEY_RESUME_GENERATOR`
- `DIFY_API_KEY_REVISE_RECOMMENDATION_LETTER`
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