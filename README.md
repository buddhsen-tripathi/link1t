# Link1t

An open-source portfolio generator for developers. Add your details once, preview multiple themes, and share one link.

## Features

- **5 Portfolio Themes**: Minimal, Brutalist, Terminal, Bento, Glassmorphism
- **AI Resume Parsing**: Upload a PDF and auto-fill your portfolio
- **Live Preview**: See changes instantly as you edit
- **Public URLs**: Share your portfolio at `link1t.com/username`
- **Drag & Drop**: Reorder sections and items easily
- **Dark Mode**: Full dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account
- Clerk account
- Cloudflare R2 bucket (for image uploads)
- OpenRouter API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/link1t.git
   cd link1t
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables (see `.env.example` for required keys)

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Clerk
- **Database**: Supabase
- **Storage**: Cloudflare R2
- **AI**: OpenRouter
- **Styling**: Tailwind CSS v4

## Adding a New Theme

Themes are React components that receive portfolio data and render a complete portfolio page.

### Step 1: Create the Theme Component

Create a new file in `components/themes/`:

```tsx
// components/themes/MyTheme.tsx
"use client";

import type { PortfolioData } from "@/types/portfolio";
import { useThemeData } from "./useThemeData";

interface MyThemeProps {
  data: PortfolioData;
  isPreview?: boolean;
}

export function MyTheme({ data }: MyThemeProps) {
  const {
    portfolio,
    experiences,
    education,
    projects,
    skills,
    socialLinks,
    sections
  } = useThemeData(data);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header>
        {sections.hasName && <h1>{portfolio.fullName}</h1>}
        {sections.hasTitle && <p>{portfolio.title}</p>}
      </header>

      {/* Bio */}
      {sections.hasBio && (
        <section>
          <p>{portfolio.bio}</p>
        </section>
      )}

      {/* Experience */}
      {sections.hasExperiences && (
        <section>
          <h2>Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.id}>
              <h3>{exp.position}</h3>
              <p>{exp.company}</p>
              <p>{exp.dateRange}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Add other sections: education, projects, skills, socialLinks */}
    </div>
  );
}
```

### Step 2: Use the Theme Data Hook

The `useThemeData` hook provides:

| Property | Description |
|----------|-------------|
| `portfolio` | Basic info (name, title, bio, contact) |
| `experiences` | Work history with formatted dates |
| `education` | Education entries |
| `projects` | Projects with technologies array |
| `skills` | Skills with categories |
| `socialLinks` | Social media links |
| `sections` | Visibility flags for conditional rendering |

**Formatted date properties on experiences:**
- `dateRange` - "Jan 2020 - Present" or "Jan 2020 - Dec 2022"
- `dashDateRange` - "2020-01 → present" or "2020-01 → 2022-12"

**Section visibility flags:**
- `sections.hasName`, `sections.hasTitle`, `sections.hasBio`
- `sections.hasEmail`, `sections.hasPhone`, `sections.hasLocation`, `sections.hasContact`
- `sections.hasExperiences`, `sections.hasEducation`, `sections.hasProjects`
- `sections.hasSkills`, `sections.hasSocialLinks`

### Step 3: Register the Theme

Add your theme to `components/themes/index.ts`:

```tsx
import { MyTheme } from './MyTheme';

export const themes: Record<ThemeId, ThemeComponent> = {
  minimal: MinimalTheme,
  brutalist: BrutalistTheme,
  terminal: TerminalTheme,
  bento: BentoTheme,
  glassmorphism: GlassmorphismTheme,
  mytheme: MyTheme,  // Add your theme
};

export { MinimalTheme, BrutalistTheme, TerminalTheme, BentoTheme, GlassmorphismTheme, MyTheme };
```

### Step 4: Add Theme to Type Definition

Update `types/portfolio.ts`:

```tsx
export type ThemeId =
  | 'minimal'
  | 'brutalist'
  | 'terminal'
  | 'bento'
  | 'glassmorphism'
  | 'mytheme';  // Add your theme ID

export const THEME_OPTIONS: { id: ThemeId; name: string; description: string }[] = [
  // ... existing themes
  { id: 'mytheme', name: 'My Theme', description: 'Your theme description' },
];
```

### Tips

- Use `sections.hasX` to conditionally render sections (not `data.X.length > 0`)
- Use pre-formatted dates from `experiences` (`dateRange`, `dashDateRange`)
- Test with empty data to ensure graceful degradation
- Add the `isPreview` prop if you need different behavior in preview vs public view

## License

MIT
