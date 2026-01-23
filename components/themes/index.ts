import { MinimalTheme } from './MinimalTheme';
import { BrutalistTheme } from './BrutalistTheme';
import { TerminalTheme } from './TerminalTheme';
import { BentoTheme } from './BentoTheme';
import { GlassmorphismTheme } from './GlassmorphismTheme';
import { RetroTheme } from './RetroTheme';
import type { ThemeId, PortfolioData } from '@/types/portfolio';

export type ThemeComponent = React.ComponentType<{
  data: PortfolioData;
  isPreview?: boolean;
}>;

export const themes: Record<ThemeId, ThemeComponent> = {
  minimal: MinimalTheme,
  brutalist: BrutalistTheme,
  terminal: TerminalTheme,
  bento: BentoTheme,
  glassmorphism: GlassmorphismTheme,
  retro: RetroTheme,
};

export { MinimalTheme, BrutalistTheme, TerminalTheme, BentoTheme, GlassmorphismTheme, RetroTheme };
