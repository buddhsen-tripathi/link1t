import { z } from 'zod';

export const portfolioSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  title: z.string().max(100).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(2000).optional(),
  themeId: z.enum(['minimal', 'brutalist', 'terminal', 'bento', 'glassmorphism', 'retro']),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  location: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional(),
  displayOrder: z.number().int().min(0),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  fieldOfStudy: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().max(1000).optional(),
  displayOrder: z.number().int().min(0),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  displayOrder: z.number().int().min(0),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(50),
  category: z.string().max(50).optional(),
  proficiencyLevel: z.number().int().min(1).max(5).optional(),
  displayOrder: z.number().int().min(0),
});

export const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.enum([
    'github',
    'linkedin',
    'twitter',
    'website',
    'dribbble',
    'behance',
    'youtube',
    'medium',
    'devto',
    'instagram',
  ]),
  url: z.string().url('Invalid URL'),
  displayOrder: z.number().int().min(0),
});

export const portfolioDataSchema = z.object({
  portfolio: portfolioSchema,
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  socialLinks: z.array(socialLinkSchema),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;
export type PortfolioDataFormData = z.infer<typeof portfolioDataSchema>;
