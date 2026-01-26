import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

// Date formatting utilities
export const formatDate = {
  // YYYY-MM -> MM/YYYY
  monthYear: (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  },
  // YYYY-MM -> YYYY-MM
  dashFormat: (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${year}-${month}`;
  },
  // YYYY-MM -> Month YYYY
  longFormat: (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  },
};

// Section visibility helpers
export function getSectionVisibility(data: PortfolioData) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  return {
    hasName: !!portfolio.fullName?.trim(),
    hasTitle: !!portfolio.title?.trim(),
    hasBio: !!portfolio.bio?.trim(),
    hasEmail: !!portfolio.email?.trim(),
    hasPhone: !!portfolio.phone?.trim(),
    hasLocation: !!portfolio.location?.trim(),
    hasProfileImage: !!portfolio.profileImageUrl,
    hasContact: !!(portfolio.email?.trim() || portfolio.phone?.trim() || portfolio.location?.trim()),
    hasExperiences: experiences.length > 0,
    hasEducation: education.length > 0,
    hasProjects: projects.length > 0,
    hasSkills: skills.length > 0,
    hasSocialLinks: socialLinks.length > 0,
  };
}

// Social platform base URLs for building full URLs from usernames
export const SOCIAL_PLATFORM_URLS: Record<SocialPlatform, string | null> = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  twitter: "https://twitter.com/",
  website: null,
  dribbble: "https://dribbble.com/",
  behance: "https://behance.net/",
  youtube: "https://youtube.com/",
  medium: "https://medium.com/",
  devto: "https://dev.to/",
  instagram: "https://instagram.com/",
};

// Social platform display names
export const SOCIAL_PLATFORM_NAMES: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  dribbble: "Dribbble",
  behance: "Behance",
  youtube: "YouTube",
  medium: "Medium",
  devto: "Dev.to",
  instagram: "Instagram",
};

// Extract username from social URL
export function extractUsername(url: string, platform: SocialPlatform): string {
  const baseUrl = SOCIAL_PLATFORM_URLS[platform];
  if (!baseUrl || !url.startsWith(baseUrl)) return url;
  return url.replace(baseUrl, "").replace(/\/$/, "");
}

// Theme color palettes (can be extended per theme)
export const colorPalettes = {
  vibrant: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1", "#5f27cd"],
  muted: ["#6c757d", "#495057", "#343a40", "#212529"],
  neon: ["#39FF14", "#FF073A", "#00FFFF", "#FF00FF", "#FFFF00"],
};

// Get color from palette by index (cycles through)
export function getColorFromPalette(palette: string[], index: number): string {
  return palette[index % palette.length];
}
