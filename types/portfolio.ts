import type { ThemeId } from './theme';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SectionKey = 'experiences' | 'education' | 'projects' | 'skills' | 'socialLinks' | 'certifications' | 'languages';

export interface Portfolio {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  profileImageUrl: string;
  resumeUrl: string;
  bio: string;
  themeId: ThemeId;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

export interface Experience {
  id: string;
  portfolioId: string;
  company: string;
  companyUrl: string;
  position: string;
  employmentType: EmploymentType | '';
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
  featured: boolean;
  displayOrder: number;
}

export interface Certification {
  id: string;
  portfolioId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
  credentialId: string;
  displayOrder: number;
}

export type LanguageProficiency = 'native' | 'fluent' | 'professional' | 'conversational' | 'basic';

export const LANGUAGE_PROFICIENCIES: { value: LanguageProficiency; label: string }[] = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic' },
];

export interface Language {
  id: string;
  portfolioId: string;
  name: string;
  proficiency: LanguageProficiency;
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
  | 'instagram'
  | 'stackoverflow'
  | 'hashnode'
  | 'bluesky'
  | 'kaggle';

// ThemeId is the single source of truth — re-exported here for convenience.
export { type ThemeId } from './theme';

export interface PortfolioData {
  portfolio: Portfolio;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  socialLinks: SocialLink[];
  certifications: Certification[];
  languages: Language[];
}

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
  { value: 'stackoverflow', label: 'Stack Overflow' },
  { value: 'hashnode', label: 'Hashnode' },
  { value: 'bluesky', label: 'Bluesky' },
  { value: 'kaggle', label: 'Kaggle' },
];

export const DEFAULT_SECTION_ORDER: SectionKey[] = ['experiences', 'education', 'projects', 'skills', 'certifications', 'languages', 'socialLinks'];

export function createEmptyPortfolio(): PortfolioData {
  return {
    portfolio: {
      id: '',
      userId: '',
      fullName: '',
      title: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      profileImageUrl: '',
      resumeUrl: '',
      bio: '',
      themeId: 'brutalist',
      sectionOrder: DEFAULT_SECTION_ORDER,
      hiddenSections: [],
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
    certifications: [],
    languages: [],
  };
}

export function generateId(): string {
  return crypto.randomUUID();
}
