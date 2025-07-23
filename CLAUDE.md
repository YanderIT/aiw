# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"智写匠" (ZhiXieJiang) is a Next.js-based AI SaaS template for document generation services including resume generation, cover letters, and recommendation letters. Built for deployment on Vercel, Cloudflare, and Docker platforms.

## Development Commands

### Core Development
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server with turbopack
pnpm build            # Build for production
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
- **TypeScript** for type safety
- **Tailwind CSS v4** with Shadcn/ui components
- **next-intl** for internationalization (en/zh)
- **next-auth v5 (beta)** for authentication
- **Supabase** for database and storage
- **Stripe** for payments
- **Firebase** for authentication backend
- **Dify AI** for workflow-based document generation

### Authentication Architecture
Configured in `src/auth/config.ts` with multiple providers:
- Firebase credentials (email/password)
- Google OAuth with One Tap support
- GitHub OAuth
- Session management with JWT

### AI Integration Pattern
**Dify Service** (`src/services/dify.ts`) manages AI workflows with:
- Function-specific API keys for different document types
- Streaming support via `runWorkflowStreaming()`
- File upload capabilities
- Comprehensive error handling

Environment variables follow pattern:
- `DIFY_API_KEY_RECOMMENDATION_LETTER`
- `DIFY_API_KEY_COVER_LETTER`
- `DIFY_API_KEY_RESUME_GENERATOR`
- `DIFY_API_KEY` (default fallback)

### Document Generation Architecture
Each document feature follows a consistent pattern:
```
feature-name/
├── components/
│   ├── FeatureContext.tsx          # State management
│   ├── FeatureGeneratorClient.tsx  # Main UI
│   ├── icons/                      # Module icons
│   └── modules/                    # Form sections
├── page.tsx                        # Entry point
└── result/
    └── components/
        └── FeatureResultClient.tsx # Result display
```

### Resume Template System
Special architecture for resume generation:
- **Field Mapping**: `src/lib/resume-field-mapping.ts` converts data to standard format
- **Templates**: Multiple templates (kakuna, ditto) in `components/templates/`
- **Dual View**: Template preview and markdown editing modes
- **Print Optimization**: A4 size with proper scaling

### Database Models & Services Pattern
Each model in `src/models/` has a corresponding service in `src/services/`:
- User management with credits system
- Order tracking with Stripe integration
- Document storage and retrieval
- API key management for user-provided services

### Key Directories
- `src/app/[locale]/` - Locale-specific pages
  - `(admin)/` - Admin dashboard
  - `(default)/` - Public pages
  - `(console)/` - User dashboard
  - `api/` - API routes
- `src/components/` - UI components
  - `blocks/` - Large layout components
  - `ui/` - Shadcn/ui components
  - `console/` - Console-specific
  - `dashboard/` - Dashboard-specific
- `src/i18n/` - Internationalization
  - `messages/` - Global translations
  - `pages/` - Page-specific translations

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
- Supabase: URL, anon key, service role key
- Authentication: Firebase config, OAuth credentials
- Stripe: Secret key, publishable key, webhook secret
- Dify: Base URL and function-specific API keys
- NextAuth: Secret and URL

### Code Conventions
- TypeScript for all new code
- React functional components with hooks
- Tailwind CSS with Shadcn/ui components
- Internationalization for all user-facing text
- React Context for complex state management
- Sonner for toast notifications

### Testing and Quality Checks
- Run `pnpm lint` before committing
- Test with both English and Chinese locales
- Verify authentication flows
- Check responsive design
- Validate AI streaming responses

## Common Pitfalls to Avoid
- Don't hardcode API keys - use environment variables
- Always check user credits before AI operations
- Handle streaming responses properly to avoid memory leaks
- Validate form data on both client and server
- Ensure all text is internationalized
- Check user authentication before sensitive operations