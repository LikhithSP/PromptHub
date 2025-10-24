# PromptHub - Deployment Guide

This guide will help you deploy PromptHub to Vercel with Supabase as the backend.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## Part 1: Supabase Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - Name: PromptHub
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"

### 2. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
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
```

### 3. Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (it's enabled by default)
3. (Optional) Configure email templates under **Authentication** → **Email Templates**
4. (Optional) Disable email confirmation for testing:
   - Go to **Authentication** → **Providers** → **Email**
   - Uncheck "Confirm email"

### 4. Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following:
   - **Project URL** (e.g., https://xxx.supabase.co)
   - **anon/public key** (starts with eyJ...)

## Part 2: Vercel Deployment

### 1. Prepare Your Repository

1. Make sure all your changes are committed:
   ```bash
   git add .
   git commit -m "Migrate to Supabase backend"
   git push origin main
   ```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

- **VITE_SUPABASE_URL**: Your Supabase Project URL
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anon/public key

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

## Part 3: Post-Deployment

### 1. Test Your Application

1. Once deployed, Vercel will provide you with a URL (e.g., https://your-project.vercel.app)
2. Test the following features:
   - User registration
   - User login
   - Create a prompt
   - View prompts
   - Like/unlike prompts
   - Edit/delete your own prompts

### 2. Custom Domain (Optional)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

### 3. Configure Supabase Redirect URLs (Important!)

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Site URL** (e.g., https://your-project.vercel.app)
4. Add the following to **Redirect URLs**:
   - `https://your-project.vercel.app/**`
   - `http://localhost:5173/**` (for local development)

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install --prefix client

# Run development server
npm run dev
```

Make sure you have a `client/.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Authentication Issues

- Make sure email confirmation is disabled in Supabase (for testing)
- Check that redirect URLs are properly configured
- Verify environment variables are set correctly in Vercel

### Database Errors

- Ensure RLS policies are properly configured
- Check that the prompts table schema matches the application expectations
- Verify user_id references are correct

### Build Failures

- Check that all dependencies are listed in `client/package.json`
- Ensure environment variables are set in Vercel
- Review build logs for specific error messages

## Support

For issues and questions:
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: [Your Repository URL]

## License

MIT
