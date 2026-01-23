-- Link1t Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  username VARCHAR(50) UNIQUE,
  username_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  profile_image_url TEXT,
  bio TEXT,
  theme_id VARCHAR(50) DEFAULT 'brutalist',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  github_url TEXT,
  image_url TEXT,
  technologies TEXT[],
  display_order INTEGER DEFAULT 0
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  proficiency_level INTEGER DEFAULT 3,
  display_order INTEGER DEFAULT 0
);

-- Social Links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_published ON portfolios(is_published);
CREATE INDEX IF NOT EXISTS idx_experiences_portfolio_id ON experiences(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_social_links_portfolio_id ON social_links(portfolio_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (published portfolios)
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public experiences are viewable" ON experiences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios WHERE portfolios.id = experiences.portfolio_id AND portfolios.is_published = true
    )
  );

CREATE POLICY "Public education is viewable" ON education
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios WHERE portfolios.id = education.portfolio_id AND portfolios.is_published = true
    )
  );

CREATE POLICY "Public projects are viewable" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.is_published = true
    )
  );

CREATE POLICY "Public skills are viewable" ON skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios WHERE portfolios.id = skills.portfolio_id AND portfolios.is_published = true
    )
  );

CREATE POLICY "Public social links are viewable" ON social_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios WHERE portfolios.id = social_links.portfolio_id AND portfolios.is_published = true
    )
  );

-- RLS Policy for username lookup
CREATE POLICY "Username lookup is public" ON users
  FOR SELECT USING (username IS NOT NULL);

-- Allow service role full access (for API routes)
-- The anon key with service_role bypass will handle authenticated operations

-- Migration: Add username_changed_at column (run this if table already exists)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMPTZ;
