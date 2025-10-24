-- PromptHub Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create prompts table
CREATE TABLE prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  prompt TEXT NOT NULL,
  author TEXT DEFAULT 'Anonymous',
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  liked_by UUID[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for prompts table

-- Anyone can read prompts
CREATE POLICY "Prompts are viewable by everyone"
ON prompts FOR SELECT
USING (true);

-- Authenticated users can create prompts
CREATE POLICY "Authenticated users can create prompts"
ON prompts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own prompts
CREATE POLICY "Users can update their own prompts"
ON prompts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own prompts
CREATE POLICY "Users can delete their own prompts"
ON prompts FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_likes ON prompts(likes DESC);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

-- Optional: Insert sample data
INSERT INTO prompts (title, category, prompt, author, tags, user_id) VALUES
('Creative Story Starter', 'Creative Writing', 'Write a short story about a time traveler who accidentally changes history.', 'Sample User', ARRAY['creative', 'fiction', 'time-travel'], NULL),
('Business Plan Template', 'Business', 'Create a comprehensive business plan for a sustainable tech startup.', 'Sample User', ARRAY['business', 'startup', 'planning'], NULL),
('Code Review Prompt', 'Coding', 'Review this code for best practices, security issues, and performance optimizations.', 'Sample User', ARRAY['coding', 'review', 'best-practices'], NULL);
