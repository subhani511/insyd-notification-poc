const express = require("express");
const router = express.Router();
const User = require("../models/UserItem");
const Notification = require("../models/Notification");

// ------------------------------
// GET all users
// ------------------------------
router.get("/", async (req, res) => {
  try {
    console.log("🔹 Fetching all users...");

    // Fetch only _id, name, email to prevent sending passwords
    const users = await User.find().select("_id name email");

    console.log(`🔹 Users fetched: ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({
      error: "Server error while fetching users",
      message: err.message,
      stack: err.stack,
    });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password required" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ------------------------------
// FOLLOW / UNFOLLOW a user
// ------------------------------
router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: "followerId and followingId required" });
    }

    const following = await User.findById(followingId);
    if (!following) return res.status(404).json({ error: "User to follow not found" });

    // Toggle follow
    const isFollowing = following.followers.some((id) => id.toString() === followerId);

    if (isFollowing) {
      following.followers = following.followers.filter(
        (id) => id.toString() !== followerId
      );
    } else {
      following.followers.push(followerId);

      // Create NEW_FOLLOW notification
      const follower = await User.findById(followerId);
      if (follower) {
        const newFollowNotif = new Notification({
          userId: followingId, // recipient
          type: "NEW_FOLLOW",
          read: false,
          actorId: follower._id,
        });

        await newFollowNotif.save();

        // Emit live notification via Socket.IO
        const io = req.app.get("io");
        if (io) {
          io.to(followingId.toString()).emit("new-notification", {
            _id: newFollowNotif._id,
            type: newFollowNotif.type,
            actorName: follower.name,
            read: false,
            createdAt: newFollowNotif.createdAt,
          });
        }
      }
    }

    await following.save();
    res.json({ success: true, following: !isFollowing });
  } catch (err) {
    console.error("❌ Follow/unfollow error:", err);
    res.status(500).json({
      error: "Server error while following/unfollowing user",
      message: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;
