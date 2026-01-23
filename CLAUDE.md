# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Link1t is an open-source portfolio generator that lets developers create professional portfolios. Users can add their details once, preview multiple themes, and share one link.

## Commands

```bash
pnpm dev      # Development server with Turbopack
pnpm build    # Production build
pnpm lint     # ESLint with Next.js rules
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth**: Clerk (Google OAuth via redirect flow)
- **Database**: Supabase (SSR client)
- **Storage**: AWS S3
- **Styling**: Tailwind CSS v4 with OKLCH colors, tw-animate-css
- **UI Components**: Radix UI primitives
- **Theming**: next-themes (dark mode default)

## Architecture

### Path Aliases
- `@/*` maps to project root (e.g., `@/components/ui/button`)

### Directory Structure
- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Reusable Radix-based UI components (Button, Dialog, etc.)
- `components/landing/` - Landing page components (Hero, Navbar, Footer, LoginModal)
- `lib/utils.ts` - Utility functions including `cn()` for class merging

### Authentication Flow
- ClerkProvider wraps the app at root layout
- Login uses `signIn.authenticateWithRedirect()` with Google OAuth
- SSO callback handled at `/sso-callback`
- No middleware protection currently (public landing page)

### Theming
- Custom fonts: Amiko (sans), Adamina (serif), Chivo Mono (mono)
- Theme variables defined in `globals.css` using OKLCH color space
- Light/dark mode toggle in Navbar
- Zero border radius (brutalist design aesthetic)

### Environment Variables
Required in `.env.local`:
- Clerk keys (NEXT_PUBLIC_CLERK_* and CLERK_*)
- Supabase connection details
- AWS S3 credentials
