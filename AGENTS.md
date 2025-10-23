# Repository Guidelines

## Project Structure & Module Organization
This template runs on the Next.js App Router. Route groups and layouts live in `src/app` with locale-aware content under `src/app/[locale]`; shared styles sit in `src/app/globals.css` and `src/app/theme.css`. UI building blocks reside in `src/components`, while state and domain logic are organized under `src/hooks`, `src/contexts`, `src/models`, and `src/services`. Auth helpers belong in `src/auth`, with cross-cutting utilities in `src/lib` and shared types in `src/types`. Localized copy is defined in `src/i18n`, static assets in `public`, and HTTP request examples in `debug`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install`. Use `pnpm dev` for the local dev server and `pnpm build` to produce a production bundle. Run `pnpm start` to serve the built app and `pnpm lint` to enforce the Next.js ESLint rules. `pnpm analyze` surfaces bundle insights, `pnpm cf:preview` simulates the Cloudflare deployment, and `pnpm cf:deploy` pushes the build to Cloudflare.

## Coding Style & Naming Conventions
Author new modules in TypeScript (`.ts`/`.tsx`) with two-space indentation. Components and contexts use `PascalCase`, hooks use the `useThing` pattern, and shared helpers remain `camelCase`. Follow existing folder naming (kebab-case for routes, lowercase descriptive dirs elsewhere). Tailwind utility classes live inline; centralize reusable variants with `cn` from `src/lib/utils`. Validate formatting by running `pnpm lint`, and keep locale strings synchronized across `src/i18n/messages` before shipping UI work.

## Testing Guidelines
The project does not yet ship an automated test harness, so new features should include targeted checks in adjacent files named `<feature>.test.ts(x)` or `.spec.ts(x)` when introduced. Until then, rely on `pnpm lint` for static guarantees, exercise pages through `pnpm dev`, and document manual steps in PR descriptions. Use the request snippets in `debug/apitest.http` to verify API endpoints quickly.

## Commit & Pull Request Guidelines
Recent commits favor short imperative summaries (e.g., `update some ui`). Continue using concise, present-tense subjects, but add context when the change spans multiple concerns. Reference related issues in the body, and group generated files in separate commits if needed. Pull requests should list scope, testing evidence (`pnpm lint`, Cloudflare preview, etc.), and any environment variable impacts or screenshots for visual changes before requesting review.

## Environment & Deployment Notes
Track environment defaults in `.env.example`, promoting overrides via `.env.development` and `.env.production`. Cloudflare secrets belong under `[vars]` in `wrangler.toml`, while Vercel handles configuration in its dashboard. Rebuild the app whenever locale assets or `open-next.config.ts` changes so server renderers pick up the new configuration.
