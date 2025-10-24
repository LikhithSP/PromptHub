import mongoose from "mongoose";


const promptSchema = new mongoose.Schema({
title: { type: String, required: true },
category: { type: String, default: "General" },
prompt: { type: String, required: true },
author: { type: String, default: "Anonymous" },
tags: { type: [String], default: [] },
likes: { type: Number, default: 0 },
likedBy: [{ 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "User" 
}],
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false // Optional for backward compatibility
},
createdAt: { type: Date, default: Date.now }
});


const Prompt = mongoose.model("Prompt", promptSchema);
export default Prompt;