# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Link1t is an open-source portfolio generator that lets developers create professional portfolios. Users can add their details once, preview multiple themes, and share one link (link1t.com/username).

## Commands

```bash
pnpm dev      # Development server with Turbopack
pnpm build    # Production build
pnpm lint     # ESLint with Next.js rules
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth**: Clerk (Google OAuth via redirect flow)
- **Database**: Supabase (SSR client, JSONB for portfolio data)
- **Storage**: Cloudflare R2 (S3-compatible)
- **AI**: OpenRouter API for resume parsing
- **Styling**: Tailwind CSS v4 with OKLCH colors, tw-animate-css
- **UI Components**: Radix UI primitives
- **Theming**: next-themes (dark mode default)

## Architecture

### Path Aliases
- `@/*` maps to project root (e.g., `@/components/ui/button`)

### Directory Structure
```
app/
├── (dashboard)/dashboard/    # Protected dashboard
├── [username]/               # Public portfolio pages
├── api/
│   ├── portfolio/            # CRUD operations
│   ├── upload/               # R2 image uploads
│   └── parse-resume/         # AI resume extraction
├── preview/                  # Full preview page
└── sso-callback/             # Clerk OAuth callback

components/
├── dashboard/                # Dashboard UI components
│   ├── DashboardShell.tsx    # Split-view layout
│   ├── PortfolioForm.tsx     # Form container
│   ├── PreviewPanel.tsx      # Live preview + theme selector
│   └── sections/             # Form sections
├── themes/                   # Portfolio themes
│   ├── index.ts              # Theme registry
│   ├── config.ts             # Shared utilities (date formatting, visibility)
│   ├── useThemeData.ts       # Data processing hook for themes
│   └── [Theme]Theme.tsx      # Individual theme components
├── landing/                  # Landing page components
└── ui/                       # Radix-based UI primitives

hooks/
├── usePortfolioForm.ts       # Form state + auto-save
├── useFileUpload.ts          # R2 upload handling
└── useResumeParser.ts        # AI parsing with rate limiting

types/
└── portfolio.ts              # TypeScript interfaces
```

### Theme System

5 available themes: `minimal`, `brutalist`, `terminal`, `bento`, `glassmorphism`

Theme components receive `PortfolioData` and use the `useThemeData` hook:
```typescript
const { portfolio, experiences, education, projects, skills, socialLinks, sections } = useThemeData(data);
```

The `sections` object provides visibility flags (e.g., `sections.hasBio`, `sections.hasExperiences`) for conditional rendering.

### AI Rate Limiting

Resume parsing is limited to 3 uses per 30 minutes per user. Usage timestamps are stored in the `ai_usage` JSONB column on the users table.

### Database Schema

Key tables: `users`, `portfolios`, `experiences`, `education`, `projects`, `skills`, `social_links`

Important columns:
- `users.ai_usage` - JSONB array of timestamps for rate limiting
- `portfolios.portfolio_data` - JSONB containing all portfolio sections
- `portfolios.is_published` - Boolean for public visibility

### Authentication Flow
- ClerkProvider wraps the app at root layout
- Login uses `signIn.authenticateWithRedirect()` with Google OAuth
- SSO callback handled at `/sso-callback`
- Dashboard routes protected via middleware

### Styling
- Custom fonts: Amiko (sans), Adamina (serif), Chivo Mono (mono)
- Theme variables in `globals.css` using OKLCH color space
- Light/dark mode toggle in Navbar
- Zero border radius (brutalist design aesthetic)

### Environment Variables

Required in `.env.local`:
```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
R2_PUBLIC_URL=

# OpenRouter (AI)
OPENROUTER_API_KEY=
```
