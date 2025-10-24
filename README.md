# 🚀 PromptHub - AI Prompts Sharing Platform

A production-ready full-stack application for sharing and discovering AI prompts, built with **React** and **Express.js**. Features a clean, professional interface inspired by Notion, Perplexity, and Linear with dark/light theme support.

## ✨ Features

### Backend (Express.js + MongoDB)

- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **Protected Routes** - Create, update, and delete operations require authentication
- ✅ **User Management** - User model with bcrypt password hashing
- ✅ **Pagination** - Efficient data loading with customizable page size
- ✅ **Rate Limiting** - Production-ready rate limiting (100 requests per 15 minutes)
- ✅ **Search & Filter** - Search by keyword, filter by category and tags
- ✅ **User Ownership** - Users can only edit/delete their own prompts
- ✅ **Like System** - Track likes per prompt with user-specific like status
- ✅ **Comprehensive Categories** - 15+ categories including Music, Fun, Startups, AI Tools, Productivity, Design, Coding, Data Analysis

### Frontend (React + Vite)

- ✅ **Professional UI Design** - Clean, minimalist interface with neutral colors and generous whitespace
- ✅ **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- ✅ **Font Awesome Icons** - Modern icon system (v6.4.2) throughout the application
- ✅ **Split-Screen Auth Pages** - Beautiful login/register pages with background images and hero sections
- ✅ **Instagram-Style Likes** - Heart animation with real-time like count updates
- ✅ **Enhanced Home Page** - Hero section with background image and search/filter capabilities
- ✅ **Authentication Flow** - Complete login, register, and protected routes
- ✅ **CRUD Operations** - Create, read, update, and delete prompts
- ✅ **Real-time Search** - Search and filter prompts dynamically across 15+ categories
- ✅ **Pagination** - Navigate through pages of prompts
- ✅ **Copy to Clipboard** - Quick copy functionality for prompts
- ✅ **Private Routes** - Protected pages for authenticated users only
- ✅ **Auto Logout Redirect** - Automatic redirect to home page with refresh on logout
- ✅ **Responsive Design** - Mobile-friendly layout with smooth transitions

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **React Router** - Navigation and routing
- **Axios** - HTTP client with interceptors
- **Vite** - Build tool and dev server
- **Font Awesome 6.4.2** - Icon library
- **CSS Variables** - Theme system implementation

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-prompts-api
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

## 🚀 Running the Application

### Development Mode (Recommended)

Run both backend and frontend concurrently:
```bash
npm run dev:full
```

This will start:
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:5173`

### Separate Terminals

**Backend only:**
```bash
npm run dev
```

**Frontend only:**
```bash
npm run client
```

### Production Mode

**Backend:**
```bash
npm start
```

**Frontend (build):**
```bash
cd client
npm run build
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Prompts
- `GET /api/prompts` - Get all prompts (with pagination and search)
  - Query params: `page`, `limit`, `q` (search), `category`, `tag`, `sortBy`
- `GET /api/prompts/:id` - Get single prompt with like status
- `POST /api/prompts` - Create prompt (protected)
- `POST /api/prompts/:id/like` - Toggle like on prompt (protected)
- `PUT /api/prompts/:id` - Update prompt (protected, owner only)
- `DELETE /api/prompts/:id` - Delete prompt (protected, owner only)

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication with HTTP-only approach
2. **Password Hashing** - bcrypt with salt rounds for secure password storage
3. **Rate Limiting** - Prevents abuse (100 req/15min per IP)
4. **Ownership Validation** - Users can only modify their own content
5. **Input Validation** - Mongoose schema validation
6. **CORS Enabled** - Cross-origin resource sharing configured
7. **Protected Routes** - Middleware authentication for sensitive operations

## 📱 Frontend Routes

- `/` - Home page with search and filters (public)
- `/login` - Login page with split-screen design (public)
- `/register` - Register page with split-screen design (public)
- `/prompt/:id` - Prompt detail page with like functionality (public)
- `/create` - Create prompt with 15+ categories (protected)

## 🎨 UI Features & Design System

### Theme System
- **Dark/Light Mode** - Toggle between themes with localStorage persistence
- **CSS Variables** - Comprehensive color system for easy customization
- **Smooth Transitions** - 0.15s-0.3s transitions on theme changes
- **System Preference Detection** - Automatically detects user's system theme

### Color Palette
- **Neutral Colors** - Professional gray scale (#171717, #525252, #a3a3a3)
- **Accent Color** - Blue accent (#3b82f6) for interactive elements
- **Surface Colors** - Layered backgrounds for depth
- **Border System** - Subtle borders with 6px border radius

### Components
- **Minimalist Navbar** - 56px height with backdrop blur effect
- **Split-Screen Auth** - Hero section with background image and form section
- **Professional Cards** - Uniform card design with proper spacing
- **Instagram-Style Likes** - Heart animation with 0.6s duration
- **Search Bar** - Real-time search with 15+ category options
- **Pagination Controls** - Clean pagination with page numbers
- **Copy Button** - One-click prompt copying with feedback
- **Protected Actions** - Edit/delete buttons only for owners
- **Responsive Grid** - 3-column layout (desktop) to single column (mobile)

### Typography
- **Letter Spacing** - -0.01em to -0.03em for professional look
- **Font Hierarchy** - Consistent sizing from 0.75rem to 3rem
- **Line Height** - 1.5 base for readability

### Available Categories
1. General
2. Creative Writing
3. Writing
4. Business
5. Education
6. Technical
7. Music
8. Fun
9. Startups
10. AI Tools
11. Productivity
12. Marketing
13. Design
14. Coding
15. Data Analysis

## 🔧 Configuration

### Rate Limiting
Modify in `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

### Pagination
Default: 9 items per page. Change in frontend `Home.jsx`:
```javascript
const params = { page, limit: 9 }; // Modify limit here
```

### Theme Colors
Customize in `client/src/index.css`:
```css
:root {
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-accent: #3b82f6;
  /* ... more variables */
}

[data-theme="dark"] {
  --color-background: #0a0a0a;
  --color-surface: #171717;
  /* ... more variables */
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Prompt Model
```javascript
{
  title: String (required),
  content: String (required),
  category: String (required),
  tags: [String],
  user: ObjectId (ref: User),
  likes: Number (default: 0),
  likedBy: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/prompts` or MongoDB Atlas URL |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key_123` |
| `PORT` | Server port | `5000` |

## � Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables (MONGO_URI, JWT_SECRET, PORT)
4. Deploy

### Frontend (Netlify/Vercel)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `client/dist` folder to Netlify/Vercel
3. Set environment variable for API URL if needed

### MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Copy the connection string to your `.env` file

## 🎯 Key Features Explained

### Like System
- Users can like/unlike prompts with a single click
- Real-time updates to like count
- Instagram-style heart animation (0.6s heartBeat)
- Backend tracks which users liked each prompt
- Persists to MongoDB with `likedBy` array

### Theme Toggle
- Seamless switching between dark and light modes
- Preferences saved to localStorage
- Automatic system preference detection on first visit
- Smooth CSS transitions on all color changes
- Theme persists across sessions

### Authentication Flow
1. User registers/logs in → JWT token generated
2. Token stored in localStorage
3. Axios interceptor adds token to all requests
4. Protected routes verify token via middleware
5. Logout clears token and redirects to home with refresh

### Search & Filter
- Real-time search across prompt titles and content
- Filter by 15+ categories
- Pagination with customizable page size
- Results update dynamically without page reload

## � Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI in `.env` file
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### Frontend Not Connecting to Backend
- Check API base URL in `client/src/utils/api.js`
- Verify backend is running on correct port
- Check CORS settings in `server.js`

### Theme Not Persisting
- Clear browser cache and localStorage
- Check browser console for errors
- Verify ThemeProvider wraps App component

## 📄 License

MIT

## 👤 Author

Your Name

---

**Built with ❤️ using React, Express.js, MongoDB, and Font Awesome**
