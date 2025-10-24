# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project:
   - Name: PromptHub
   - Choose a database password (save it!)
   - Select a region close to you
3. Wait for project to be created (~2 minutes)

### 2. Create Database Tables (1 minute)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy all content from `supabase-schema.sql` in this repository
3. Paste it into the SQL Editor
4. Click **Run** or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

### 3. Get Your Credentials (30 seconds)

1. Go to **Settings** → **API** in Supabase dashboard
2. Copy these two values:
   - **Project URL** (e.g., https://xxx.supabase.co)
   - **anon public** key (the long string starting with "eyJ...")

### 4. Configure Environment Variables (30 seconds)

1. Open `client/.env` in your project
2. Replace the values:
   ```env
   VITE_SUPABASE_URL=paste_your_project_url_here
   VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
   ```
3. Save the file

### 5. Run Locally (1 minute)

```bash
# Install dependencies (first time only)
npm install --prefix client

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser!

## 🎯 What You Can Do Now

- ✅ Register a new account
- ✅ Login with your account
- ✅ Create prompts
- ✅ Browse and search prompts
- ✅ Like prompts
- ✅ Edit/delete your own prompts

## 📦 Deploy to Vercel (Optional - 5 minutes)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Migrate to Supabase"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - Framework: **Vite**
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy**

### Step 3: Configure Supabase Redirects

1. Go back to Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: `https://your-project.vercel.app/**`

Done! Your app is now live! 🎉

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Check that `client/.env` exists and has correct values
- Restart the dev server after changing `.env`

### "Auth error" or "Invalid credentials"
- Check Supabase project is running
- Verify environment variables are correct
- Try disabling email confirmation in Supabase (for testing):
  - Go to **Authentication** → **Providers** → **Email**
  - Uncheck "Confirm email"

### Build fails on Vercel
- Check environment variables are set in Vercel
- Verify build command: `cd client && npm install && npm run build`
- Check output directory: `client/dist`

## 📚 More Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [MIGRATION.md](./MIGRATION.md) - Technical migration details
- [Supabase Docs](https://supabase.com/docs) - Official documentation

## 💡 Tips

- Use the same email for Supabase and Vercel for easier management
- Free tier is generous: 50,000 monthly active users
- Enable email confirmation after testing for production
- Add custom domain in Vercel settings for professional look

## 🆘 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Visit [Supabase Discord](https://discord.supabase.com)
- Check [Vercel Documentation](https://vercel.com/docs)
