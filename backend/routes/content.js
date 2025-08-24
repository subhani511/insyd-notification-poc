const express = require("express");
const Content = require("../models/Content");
const User = require("../models/User");
const Notification = require("../models/Notification");

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

    // 🔹 Populate author name before returning
    const populatedPost = await Content.findById(newPost._id)
      .populate("author", "name")
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
    const posts = await Content.find().sort({ createdAt: -1 });

    // Fetch author name for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.author); // authorId
        return {
          _id: post._id,
          text: post.text,
          createdAt: post.createdAt,
          author: user ? { name: user.name } : { name: "Unknown Author" },
        };
      })
    );

    res.json(postsWithAuthors);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
