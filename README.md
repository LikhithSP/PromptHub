# 🚀 PromptHub
<img src="preview 01.png" alt="PromptHub Preview" width="100%" />
A modern AI prompts sharing and creating platform built with React and Supabase

## Features
- Authentication (Supabase Auth)
- Create, edit, delete, and like prompts
- Real-time search & dynamic category filter
- Responsive design & dark/light theme
- Toast notifications for user actions

## Tech Stack
- Frontend: React, Vite
- Backend: Supabase (PostgreSQL, Auth)
- Deployment: Vercel

## Quick Start
1. Clone repo & install dependencies:
   ```bash
   git clone https://github.com/LikhithSP/PromptHub.git
   cd PromptHub
   npm install --prefix client
   ```
2. Create a Supabase project, run `supabase-schema.sql`, and copy your API keys.
3. Add your keys to `client/.env`:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Deploy
- Push to GitHub, import to Vercel, add env vars, and deploy.

## License
MIT

---
**Built with ❤️ using React & Supabase**
