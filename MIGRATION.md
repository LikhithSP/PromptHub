# Migration Summary: MongoDB/Express → Supabase

## What Changed

### Removed
- ✅ `server.js` - Express backend server
- ✅ `routes/` - Express route handlers (authRoutes, promptRoutes)
- ✅ `models/` - Mongoose models (User, Prompt)
- ✅ `config/` - MongoDB connection configuration
- ✅ `middleware/` - JWT authentication middleware
- ✅ Backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, etc.)

### Added
- ✅ `client/src/lib/supabaseClient.js` - Supabase client initialization
- ✅ `@supabase/supabase-js` package to client dependencies
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `supabase-schema.sql` - Database schema for Supabase
- ✅ `client/.env` - Environment variables for Supabase
- ✅ `client/.env.example` - Template for environment variables

### Modified
- ✅ `client/src/utils/api.js` - Replaced Axios/Express API calls with Supabase client calls
- ✅ `client/src/context/AuthContext.jsx` - Updated to use Supabase Auth instead of JWT
- ✅ `client/src/components/PromptCard.jsx` - Updated user data references (user_id, id fields)
- ✅ `client/src/pages/PromptDetail.jsx` - Updated user data references and field names
- ✅ `package.json` - Simplified to frontend-only scripts
- ✅ `README.md` - Updated documentation to reflect Supabase architecture
- ✅ `.gitignore` - Updated to ignore client/.env
- ✅ `.env` - Cleaned up to remove MongoDB/JWT references

## Database Schema Changes

### MongoDB Schema (Old)
```javascript
{
  _id: ObjectId,
  title: String,
  prompt: String,
  category: String,
  tags: [String],
  likes: Number,
  likedBy: [ObjectId],
  user: ObjectId,
  author: String,
  createdAt: Date
}
```

### Supabase Schema (New)
```sql
{
  id: UUID,
  title: TEXT,
  prompt: TEXT,
  category: TEXT,
  tags: TEXT[],
  likes: INTEGER,
  liked_by: UUID[],
  user_id: UUID,
  author: TEXT,
  created_at: TIMESTAMP
}
```

### Key Field Changes
- `_id` → `id` (MongoDB ObjectId to PostgreSQL UUID)
- `user` → `user_id` (reference to auth.users)
- `likedBy` → `liked_by` (snake_case convention)
- `createdAt` → `created_at` (snake_case convention)

## Authentication Changes

### Old (JWT)
- Custom JWT token generation
- Manual password hashing with bcrypt
- Token stored in localStorage
- Custom middleware for protected routes

### New (Supabase Auth)
- Built-in authentication service
- Automatic password hashing
- Session managed by Supabase (stored in localStorage)
- Row Level Security (RLS) for authorization

## API Changes

### Old (Express API)
```javascript
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/prompts
POST /api/prompts
PUT /api/prompts/:id
DELETE /api/prompts/:id
POST /api/prompts/:id/like
```

### New (Supabase Client)
```javascript
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.getUser()
supabase.from('prompts').select()
supabase.from('prompts').insert()
supabase.from('prompts').update()
supabase.from('prompts').delete()
supabase.from('prompts').update() // for likes
```

## Next Steps

1. **Set up Supabase Project**
   - Create account at https://supabase.com
   - Create new project
   - Run SQL schema from `supabase-schema.sql`
   - Copy project URL and anon key

2. **Configure Environment Variables**
   - Update `client/.env` with your Supabase credentials
   - Never commit `.env` files to git

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy

## Benefits of Migration

1. **No Backend Maintenance** - Supabase handles all backend infrastructure
2. **Automatic API Generation** - No need to write API endpoints
3. **Built-in Auth** - Secure authentication out of the box
4. **Row Level Security** - Database-level security policies
5. **Real-time Capabilities** - Built-in support for real-time subscriptions
6. **Easier Deployment** - Only need to deploy frontend to Vercel
7. **PostgreSQL** - More powerful than MongoDB for relational data
8. **Automatic Backups** - Built-in backup and recovery

## Support

- See `DEPLOYMENT.md` for detailed deployment instructions
- Check `supabase-schema.sql` for database setup
- Refer to https://supabase.com/docs for Supabase documentation
