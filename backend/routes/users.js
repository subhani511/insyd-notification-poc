const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notification = require("../models/Notification"); // add Notification model

// Create user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("name followers");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId)
      return res.status(400).json({ error: "followerId and followingId required" });

    const following = await User.findById(followingId);
    if (!following) return res.status(404).json({ error: "User to follow not found" });

    const isFollowing = following.followers.includes(followerId);
    if (isFollowing) {
      following.followers = following.followers.filter(id => id.toString() !== followerId);
    } else {
      following.followers.push(followerId);

      // Create NEW_FOLLOW notification for author
      const follower = await User.findById(followerId);
      if (follower) {
        const newFollowNotif = new Notification({
          user: followingId,
          type: "NEW_FOLLOW",
          read: false,
          authorName: follower.name,
        });
        await newFollowNotif.save();

        const io = req.app.get("io");
        if (io) {
          io.to(followingId.toString()).emit("new-notification", newFollowNotif);
        }
      }
    }

    await following.save();
    res.json({ success: true, following: !isFollowing });
  } catch (err) {
    console.error(err);
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

    // Toggle follow: if already following, unfollow
    const isFollowing = following.followers.includes(followerId);
    if (isFollowing) {
      following.followers = following.followers.filter(id => id.toString() !== followerId);
    } else {
      following.followers.push(followerId);

      // Create NEW_FOLLOW notification for author
      const follower = await User.findById(followerId);
      if (follower) {
        const newFollowNotif = new Notification({
          user: followingId,       // the author being followed
          type: "NEW_FOLLOW",
          read: false,
          authorName: follower.name,  // name of the follower
        });
        await newFollowNotif.save();

        // Emit live notification via Socket.IO
        const io = req.app.get("io"); // make sure io is attached in server.js: app.set("io", io)
        if (io) {
          io.to(followingId.toString()).emit("new-notification", newFollowNotif);
        }
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
