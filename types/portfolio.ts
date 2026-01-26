export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SectionKey = 'experiences' | 'education' | 'projects' | 'skills' | 'socialLinks';

export interface Portfolio {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  profileImageUrl: string;
  bio: string;
  themeId: ThemeId;
  sectionOrder: SectionKey[];
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  portfolioId: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  displayOrder: number;
}

export interface Education {
  id: string;
  portfolioId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
  displayOrder: number;
}

export interface Project {
  id: string;
  portfolioId: string;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  imageUrl: string;
  technologies: string[];
  displayOrder: number;
}

export interface Skill {
  id: string;
  portfolioId: string;
  name: string;
  category: string;
  proficiencyLevel: number;
  displayOrder: number;
}

export interface SocialLink {
  id: string;
  portfolioId: string;
  platform: SocialPlatform;
  url: string;
  displayOrder: number;
}

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'dribbble'
  | 'behance'
  | 'youtube'
  | 'medium'
  | 'devto'
  | 'instagram';

export type ThemeId =
  | 'minimal'
  | 'brutalist'
  | 'terminal'
  | 'bento'
  | 'glassmorphism';

export interface PortfolioData {
  portfolio: Portfolio;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  socialLinks: SocialLink[];
}

export const THEME_OPTIONS: { id: ThemeId; name: string; description: string }[] = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and professional' },
  { id: 'brutalist', name: 'Brutalist', description: 'Bold and striking' },
  { id: 'terminal', name: 'Terminal', description: 'Developer-focused' },
  { id: 'bento', name: 'Bento', description: 'Grid-based layout' },
  { id: 'glassmorphism', name: 'Glass', description: 'Frosted glass effects' },
];

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'website', label: 'Website' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'medium', label: 'Medium' },
  { value: 'devto', label: 'Dev.to' },
  { value: 'instagram', label: 'Instagram' },
];

export const DEFAULT_SECTION_ORDER: SectionKey[] = ['experiences', 'education', 'projects', 'skills', 'socialLinks'];

export function createEmptyPortfolio(): PortfolioData {
  return {
    portfolio: {
      id: '',
      userId: '',
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      profileImageUrl: '',
      bio: '',
      themeId: 'brutalist',
      sectionOrder: DEFAULT_SECTION_ORDER,
      isPublished: false,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    experiences: [],
    education: [],
    projects: [],
    skills: [],
    socialLinks: [],
  };
}

export function generateId(): string {
  return crypto.randomUUID();
}
