import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import promptRoutes from "./routes/promptRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

app.use(cors());
app.use(express.json());


// connect to MongoDB
connectDB();


app.get("/", (req, res) => {
res.send("🚀 AI Prompts API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));