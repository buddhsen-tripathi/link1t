/**
 * Theme ID registry.
 *
 * To add a new theme, add its ID here and create the corresponding
 * theme config file in components/themes/.
 */
export const THEME_IDS = [
  'minimal',
  'brutalist',
  'terminal',
  'bento',
  'glassmorphism',
  'paper',
  'retro',
  'elegant',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];
