const express = require("express");
const Content = require("../models/Content");
const User = require("../models/UserItem");

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "Author and text are required" });
    }

    const newPost = new Content({ author, text });
    await newPost.save();

    // Populate author name before sending response
    const populatedPost = await Content.findById(newPost._id)
      .populate("author", "name") // crucial fix
      .exec();

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Content.find()
      .sort({ createdAt: -1 })
      .populate("author", "name"); // crucial fix

    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
