-- Link1t Database Schema for Supabase (Simplified JSON Storage)
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

-- Portfolios table (simplified with JSONB storage)
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Personal info
  full_name TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  profile_image_url TEXT,
  bio TEXT,

  -- Content stored as JSONB (experiences, education, projects, skills, social_links)
  content JSONB DEFAULT '{
    "experiences": [],
    "education": [],
    "projects": [],
    "skills": [],
    "socialLinks": []
  }'::jsonb,

  -- Section order for drag-and-drop reordering
  section_order TEXT[] DEFAULT ARRAY['experiences', 'education', 'projects', 'skills', 'socialLinks'],

  -- Settings
  theme_id VARCHAR(50) DEFAULT 'brutalist',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_published ON portfolios(is_published);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (published portfolios)
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (is_published = true);

-- RLS Policy for username lookup
CREATE POLICY "Username lookup is public" ON users
  FOR SELECT USING (username IS NOT NULL);