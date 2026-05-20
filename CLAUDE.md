# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start both Next.js frontend and Convex backend in parallel
npm run dev:frontend # Next.js only (port 3000)
npm run dev:backend  # Convex backend only
npm run build        # Production build
npm run lint         # ESLint (excludes convex/_generated/**)
```

No test runner is configured. Convex functions can be tested with `convex-test` + `vitest` if added.

## Architecture

This is a personal portfolio + blog platform. **Next.js 16 App Router** frontend communicates with a **Convex** serverless backend for all data persistence and real-time updates.

### Data layer (Convex — `/convex`)

All backend logic lives here. The schema (`convex/schema.ts`) defines five tables: `posts`, `experiences`, `projects`, `skills`, and auth tables from `@convex-dev/auth`.

Key files:
- `schema.ts` — database schema and index definitions
- `auth.ts` / `auth.config.ts` — email-based passwordless auth via Resend
- `posts.ts`, `experiences.ts`, `projects.ts`, `skills.ts` — CRUD functions
- `ai.ts` — blog post summarization via OpenRouter (Claude 3.5 Haiku), requires `"use node;"`
- `files.ts` — file upload/download via Convex storage
- `contact.ts` — contact form email via Resend
- `http.ts` — HTTP routes (auth callback)

Authorization pattern: always call `getAuthUserId(ctx)` or `ctx.auth.getUserIdentity()` server-side. Never accept user IDs as arguments for auth purposes. Admin access is gated by the `ADMIN_EMAILS` environment variable checked server-side.

### Frontend (Next.js — `/app`)

Pages:
- `/` — homepage with hero, about, experience, blog preview, skills, contact sections
- `/blog` and `/blog/[slug]` — public blog with markdown rendering
- `/admin/**` — auth-protected CRUD dashboard for all content
- `/signin` — authentication page

Client components use Convex's `useQuery` / `useMutation` hooks for real-time data. Server components handle metadata, SEO, and the sitemap/RSS feed.

The rich text blog editor uses **TipTap** (in `/app/admin/posts`). Blog content is stored as HTML and rendered with `react-markdown` + `rehype-highlight` on the public side.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `CONVEX_DEPLOY_KEY` | Convex deploy key |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |
| `RESEND_API_KEY` | Resend email API key |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI summarization |

## Convex patterns

Follow `.cursor/rules/convex_rules.mdc` for detailed Convex guidelines. Key rules:

- **Always include argument validators** (`v.*`) for all public and internal functions.
- **Never use `filter`** on queries — define an index in `schema.ts` and use `withIndex`.
- **Avoid `.collect()`** — use `.take(n)` or paginate to prevent unbounded reads.
- **Index naming**: include all fields in the name (e.g., `by_published_and_creationTime`).
- **Actions with Node.js builtins** require `"use node;"` at the top; never mix with queries/mutations in the same file.
- **File metadata**: query `_storage` system table via `ctx.db.system.get`; do not use deprecated `ctx.storage.getMetadata`.
- Use `Doc<"tableName">` and `Id<"tableName">` from `./_generated/dataModel` for strict typing; never use `any` for ctx or document IDs.
