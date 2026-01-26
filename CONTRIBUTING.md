# Contributing to Link1t

Thank you for your interest in contributing to Link1t! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/link1t.git
   cd link1t
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

Copy `.env.example` to `.env.local` and fill in the required values. For local development, you'll need:

- **Clerk**: Create a free account at [clerk.com](https://clerk.com)
- **Supabase**: Create a project at [supabase.com](https://supabase.com)
- **R2** (optional): Only needed if testing image uploads
- **OpenRouter** (optional): Only needed if testing AI features

Run the development server:
```bash
pnpm dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Run `pnpm lint` before committing

## Types of Contributions

### Adding a Theme

See the [Theme Creation Guide](README.md#adding-a-new-theme) in the README.

Key points:
- Create your theme component in `components/themes/`
- Use the `useThemeData` hook for data and visibility flags
- Register the theme in `components/themes/index.ts`
- Add the theme ID to `types/portfolio.ts`

### Bug Fixes

1. Check if an issue already exists
2. If not, create one describing the bug
3. Reference the issue in your PR

### New Features

1. Open an issue to discuss the feature first
2. Wait for feedback before implementing
3. Keep changes focused and minimal

## Pull Request Process

1. Update documentation if needed
2. Ensure `pnpm lint` passes
3. Ensure `pnpm build` succeeds
4. Write a clear PR description explaining your changes
5. Link any related issues

## Project Structure

```
components/
├── dashboard/    # Dashboard UI (form, preview, sections)
├── themes/       # Portfolio themes
├── landing/      # Landing page
└── ui/           # Shared UI primitives

app/
├── (dashboard)/  # Protected routes
├── api/          # API routes
└── [username]/   # Public portfolio pages

hooks/            # React hooks
types/            # TypeScript types
lib/              # Utilities and clients
```

## Questions?

Open an issue or start a discussion if you have questions about contributing.
