import type { PortfolioData } from '@/types/portfolio';
import type { ThemeId } from '@/types/theme';
import { minimalThemeConfig } from './MinimalTheme';
import { brutalistThemeConfig } from './BrutalistTheme';
import { terminalThemeConfig } from './TerminalTheme';
import { bentoThemeConfig } from './BentoTheme';
import { glassmorphismThemeConfig } from './GlassmorphismTheme';
import { paperThemeConfig } from './PaperTheme';
import { retroThemeConfig } from './RetroTheme';
import { elegantThemeConfig } from './ElegantTheme';

// -- Theme config type --------------------------------------------------
// Each theme file exports a config matching this shape.
// To add a new theme:
//   1. Create components/themes/[Name]Theme.tsx with a config export
//   2. Add the theme ID to types/theme.ts
//   3. Import the config below and add it to themeConfigs

export type ThemeComponent = React.ComponentType<{
  data: PortfolioData;
  isPreview?: boolean;
}>;

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  component: ThemeComponent;
}

// -- Registry -----------------------------------------------------------
// Add new theme configs here. Everything else is derived automatically.

const themeConfigs: ThemeConfig[] = [
  minimalThemeConfig,
  brutalistThemeConfig,
  terminalThemeConfig,
  bentoThemeConfig,
  glassmorphismThemeConfig,
  paperThemeConfig,
  retroThemeConfig,
  elegantThemeConfig,
];

// -- Derived exports ----------------------------------------------------

/** Component map keyed by theme ID */
export const themes: Record<ThemeId, ThemeComponent> = Object.fromEntries(
  themeConfigs.map((c) => [c.id, c.component]),
) as Record<ThemeId, ThemeComponent>;

/** Options array for UI selectors (dropdowns, etc.) */
export const THEME_OPTIONS: { id: ThemeId; name: string; description: string }[] =
  themeConfigs.map(({ id, name, description }) => ({ id, name, description }));

/** All registered configs */
export { themeConfigs };
