# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"智写匠" (ZhiXieJiang) is a Next.js-based AI SaaS template for document generation services including resume generation, cover letters, and recommendation letters. Built for deployment on Vercel, Cloudflare, and Docker platforms.

## Development Commands

### Core Development
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server with turbopack
pnpm build            # Build for production (runs TypeScript strict checks)
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm analyze          # Build with bundle analysis
```

### Cloudflare Deployment
```bash
pnpm cf:preview       # Preview on Cloudflare
pnpm cf:deploy        # Deploy to Cloudflare (reads from wrangler.toml)
pnpm cf:upload        # Upload to Cloudflare
pnpm cf:typegen       # Generate Cloudflare types
```

### Docker
```bash
pnpm docker:build     # Build Docker image
```

## Architecture Overview

### Tech Stack
- **Next.js 15.2.3** with App Router and React 19
- **TypeScript** with strict mode in production builds
- **Tailwind CSS v4** with Shadcn/ui components
- **next-intl** for internationalization (en/zh)
- **next-auth v5 (beta)** for authentication
- **Supabase** for database and storage
- **Stripe** for payments
- **Firebase** for authentication backend
- **Dify AI** for workflow-based document generation
- **MDX** support for documentation pages

### Authentication Architecture
Configured in `src/auth/config.ts` with multiple providers:
- Firebase credentials (email/password) when `NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED=true`
- Google OAuth with One Tap support when `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`
- GitHub OAuth when `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`
- Firebase email link authentication when `NEXT_PUBLIC_FIREBASE_EMAIL_LINK_AUTH_ENABLED=true`
- Session management with JWT

### AI Integration Pattern
**Dify Service** (`src/services/dify.ts`) manages AI workflows with:
- Function-specific API keys for different document types
- Streaming support via `runWorkflowStreaming()`
- File upload capabilities
- Comprehensive error handling
- Revision support for recommendation letters

Environment variables follow pattern:
- `DIFY_API_KEY_RECOMMENDATION_LETTER`
- `DIFY_API_KEY_COVER_LETTER`
- `DIFY_API_KEY_RESUME_GENERATOR`
- `DIFY_API_KEY_REVISE_RECOMMENDATION_LETTER`
- `DIFY_API_KEY` (default fallback)

### Document Generation Architecture
Each document feature follows a consistent pattern:
```
feature-name/
├── components/
│   ├── FeatureContext.tsx          # State management with React Context
│   ├── FeatureGeneratorClient.tsx  # Main UI component
│   ├── icons/                      # Module-specific icons
│   └── modules/                    # Form sections (BasicInfo, etc.)
├── page.tsx                        # Server component entry point
└── result/
    └── components/
        └── FeatureResultClient.tsx # Streaming result display
```

### Resume Template System
Special architecture for resume generation:
- **Field Mapping**: `src/lib/resume-field-mapping.ts` converts form data to `StandardResumeData`
- **Templates**: Multiple templates (kakuna, ditto) in `components/templates/`
- **Dual View**: Template preview and markdown editing modes
- **Print Optimization**: A4 size with proper scaling
- **Modular Sections**: Education, Work Experience, Skills, etc.

### Database Models & Services Pattern
Each model in `src/models/` has a corresponding service in `src/services/`:
- **User**: Credits system, profile management
- **Order**: Stripe integration, payment tracking
- **Document**: Version control, revisions
- **APIKey**: User-provided service keys
- **Credit**: Transaction history
- **Feedback**: User feedback collection

### Key Directories
- `src/app/[locale]/` - Locale-specific pages
  - `(admin)/` - Admin dashboard (users, orders, posts, feedbacks)
  - `(default)/` - Public pages
    - `(console)/` - User dashboard (credits, documents, API keys)
  - `auth/` - Authentication pages
  - `api/` - API routes
- `src/components/` - UI components
  - `blocks/` - Large layout components (hero, pricing, features)
  - `ui/` - Shadcn/ui base components
  - `console/` - Console-specific components
  - `dashboard/` - Dashboard layout components
- `src/i18n/` - Internationalization
  - `messages/` - Global translations
  - `pages/` - Page-specific translations (landing, pricing, showcase)

## Development Patterns

### Creating New Document Generation Features
1. Create feature directory under `src/app/[locale]/(default)/`
2. Implement context provider for state management
3. Create modular form components in `modules/`
4. Add result page with streaming AI response
5. Update i18n files for new strings
6. Configure Dify API key if needed

### Working with AI Workflows
```typescript
// Use the hook with function type
const { runWorkflow, uploadFile } = useDify({ 
  functionType: 'recommendation-letter' 
});

// Stream responses
await runWorkflowStreaming(
  payload,
  (chunk) => { /* handle chunk */ },
  (error) => { /* handle error */ },
  functionType
);
```

### Environment Configuration
- Development: `.env.development`
- Production: `.env.production`
- Cloudflare: `wrangler.toml` (copy all env vars under `[vars]`)

Critical environment variables:
- **Supabase**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Authentication**: `AUTH_SECRET`, `AUTH_URL`, Firebase config
- **OAuth**: Google and GitHub client IDs and secrets
- **Stripe**: `STRIPE_PUBLIC_KEY`, `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Dify**: `DIFY_BASE_URL` and function-specific API keys
- **Storage**: S3-compatible storage configuration

### Code Conventions
- TypeScript for all new code
- React functional components with hooks
- Tailwind CSS with Shadcn/ui components
- Internationalization for all user-facing text
- React Context for complex state management
- Sonner for toast notifications
- Use `@/` path alias for imports from `src/`

### Next.js 15 Specific Patterns
- Server Components by default, use `"use client"` directive when needed
- Dynamic route params are async: `const { id } = await params;`
- Standalone output mode for Docker deployments
- Turbopack enabled for faster development builds

## TypeScript Strict Mode Guidelines for Production Builds

### Why These Guidelines Matter
Next.js production builds (`pnpm build`) enforce strict TypeScript checking, while development mode is more lenient. Follow these rules to avoid build failures on Vercel.

### 1. Array Method Type Annotations
Always provide explicit types for array method callbacks:
```typescript
// ❌ Bad - will fail in production
items.map((item) => item.name)

// ✅ Good - explicit types
items.map((item: ItemType) => item.name)
displayContent.split('\n\n').map((paragraph: string, index: number) => ...)
```

### 2. Type Assertions for Incompatible Types
When converting between incompatible types, use `unknown` as intermediate:
```typescript
// ❌ Bad - direct conversion may fail
value as TargetType

// ✅ Good - use unknown for incompatible conversions
value as unknown as TargetType
currentColorScale as unknown as keyof typeof COLOR_SCALES['blue']
```

### 3. Handling Potentially Undefined Values
```typescript
// ❌ Bad - TypeScript doesn't know user.uuid exists
user_uuid: user.uuid

// ✅ Good - use non-null assertion when you've verified existence
user_uuid: user.uuid!  // Only after checking if (!user)

// ✅ Good - use optional chaining
user?.profile?.name

// ✅ Good - provide defaults
language: language || 'zh'
```

### 4. React and Next.js Specific Rules

#### Dynamic Route Parameters (Next.js 15)
```typescript
// ❌ Bad - old pattern
{ params }: { params: { id: string } }

// ✅ Good - Next.js 15 async params
{ params }: { params: Promise<{ id: string }> }
// Then: const { id } = await params;
```

#### React DnD Refs
```typescript
// ❌ Bad - ref callback returns non-void
ref={(node) => drag(drop(node))}

// ✅ Good - ref callback returns void
ref={(node) => {
  drag(drop(node));
}}
```

### 5. Complete Object Properties
Always provide all required properties for interfaces:
```typescript
// ❌ Bad - missing required uuid
await insertDocument({
  user_uuid: user.uuid,
  // ...other fields
});

// ✅ Good - include all required fields
await insertDocument({
  uuid: uuidv4(),  // Don't forget required fields!
  user_uuid: user.uuid,
  // ...other fields
});
```

### 6. Enum and Literal Type Usage
Use proper type assertions for enums and literal types:
```typescript
// ❌ Bad - using string literals without type
version_type: "original"

// ✅ Good - cast to enum or use 'as const'
version_type: VersionType.Original
// or
version_type: "original" as VersionType
```

### Pre-Build Checklist
Before pushing code that will trigger a Vercel build:
1. Run `pnpm build` locally to catch type errors
2. Fix all TypeScript errors - don't use `@ts-ignore`
3. Ensure all array callbacks have typed parameters
4. Check for missing object properties in function calls
5. Verify React component props and refs follow conventions

## Common Pitfalls to Avoid
- Don't hardcode API keys - use environment variables
- Always check user credits before AI operations
- Handle streaming responses properly to avoid memory leaks
- Validate form data on both client and server
- Ensure all text is internationalized
- Check user authentication before sensitive operations
- Always run `pnpm build` locally before pushing to catch TypeScript errors
- Remember to handle both `en` and `zh` locales in i18n files
- Use proper error boundaries for streaming AI responses
- Implement proper loading states for async operations

## Testing

To run tests, check package.json for available test scripts or README for project-specific testing guidelines.