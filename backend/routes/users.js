const express = require("express");
const router = express.Router();
const User = require("../models/UserItem");
const Notification = require("../models/Notification");

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "Author and text are required" });
    }

    let newPost = new Content({ author, text });
    await newPost.save();

    // 🔹 Populate before sending response
    newPost = await newPost.populate("author", "name");

    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Content.find()
      .populate("author", "name") // 🔹 THIS is critical
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// Follow a user
router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId)
      return res.status(400).json({ error: "followerId and followingId required" });

    const following = await User.findById(followingId);
    if (!following) return res.status(404).json({ error: "User to follow not found" });

    // Toggle follow
    const isFollowing = following.followers.includes(followerId);
    if (isFollowing) {
      following.followers = following.followers.filter(id => id.toString() !== followerId);
    } else {
      following.followers.push(followerId);

      // Create NEW_FOLLOW notification
      const follower = await User.findById(followerId);
      if (follower) {
        const newFollowNotif = new Notification({
          userId: followingId,       // recipient
          type: "NEW_FOLLOW",
          read: false,
          actorId: follower._id,     // reference to follower
        });
        await newFollowNotif.save();

        // Emit live notification via Socket.IO
        const io = req.app.get("io");
        if (io) io.to(followingId.toString()).emit("new-notification", newFollowNotif);
      }
    }

    await following.save();
    res.json({ success: true, following: !isFollowing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
