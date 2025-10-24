import express from "express";
import Prompt from "../models/Prompt.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();


// Create a prompt (Protected)
router.post("/", protect, async (req, res) => {
try {
const data = {
  ...req.body,
  user: req.user._id,
  author: req.user.username // Set author to logged-in username
};
const prompt = await Prompt.create(data);
res.status(201).json(prompt);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// Read all prompts (with pagination and search support)
router.get("/", async (req, res) => {
try {
// support ?q=keyword, ?tag=tagName, pagination, sorting
const { q, tag, category, sortBy, page = 1, limit = 10 } = req.query;
const filter = {};
if (q) filter.$or = [
{ title: { $regex: q, $options: "i" } },
{ prompt: { $regex: q, $options: "i" } },
{ tags: { $regex: q, $options: "i" } }
];
if (tag) filter.tags = tag;
if (category) filter.category = category;

// Pagination
const pageNum = parseInt(page);
const limitNum = parseInt(limit);
const skip = (pageNum - 1) * limitNum;

// Build query
let query = Prompt.find(filter).populate("user", "username email");
if (sortBy === "likes") query = query.sort({ likes: -1 });
else query = query.sort({ createdAt: -1 }); // Default sort by newest

// Execute with pagination
const prompts = await query.skip(skip).limit(limitNum).exec();
const total = await Prompt.countDocuments(filter);

// Add isLiked field if user is authenticated
const userId = req.user?._id;
const promptsWithLikeStatus = prompts.map(prompt => {
  const promptObj = prompt.toObject();
  promptObj.isLiked = userId ? prompt.likedBy.some(id => id.toString() === userId.toString()) : false;
  return promptObj;
});

res.json({
prompts: promptsWithLikeStatus,
pagination: {
  page: pageNum,
  limit: limitNum,
  total,
  pages: Math.ceil(total / limitNum)
}
});
} catch (err) {
res.status(500).json({ error: err.message });
}
});


// Read one prompt
router.get("/:id", async (req, res) => {
try {
const prompt = await Prompt.findById(req.params.id);
if (!prompt) return res.status(404).json({ message: "Prompt not found" });

// Add isLiked field if user is authenticated
const userId = req.user?._id;
const promptObj = prompt.toObject();
promptObj.isLiked = userId ? prompt.likedBy.some(id => id.toString() === userId.toString()) : false;

res.json(promptObj);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


// Update a prompt (Protected - owner only)
router.put("/:id", protect, async (req, res) => {
try {
const prompt = await Prompt.findById(req.params.id);
if (!prompt) return res.status(404).json({ message: "Prompt not found" });

// Check if user owns the prompt
if (prompt.user && prompt.user.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "Not authorized to update this prompt" });
}

const updated = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
} catch (err) {
res.status(400).json({ error: err.message });
}
});

// Delete a prompt (Protected - owner only)
router.delete("/:id", protect, async (req, res) => {
try {
const prompt = await Prompt.findById(req.params.id);
if (!prompt) return res.status(404).json({ message: "Prompt not found" });

// Check if user owns the prompt
if (prompt.user && prompt.user.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "Not authorized to delete this prompt" });
}

await Prompt.findByIdAndDelete(req.params.id);
res.json({ message: "Prompt deleted successfully" });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Like/Unlike a prompt (Protected)
router.post("/:id/like", protect, async (req, res) => {
try {
const prompt = await Prompt.findById(req.params.id);
if (!prompt) return res.status(404).json({ message: "Prompt not found" });

const userId = req.user._id;
const hasLiked = prompt.likedBy.includes(userId);

if (hasLiked) {
  // Unlike
  prompt.likedBy = prompt.likedBy.filter(id => id.toString() !== userId.toString());
  prompt.likes = Math.max(0, prompt.likes - 1);
} else {
  // Like
  prompt.likedBy.push(userId);
  prompt.likes += 1;
}

await prompt.save();
res.json({ 
  likes: prompt.likes, 
  isLiked: !hasLiked 
});
} catch (err) {
res.status(500).json({ error: err.message });
}
});

export default router;