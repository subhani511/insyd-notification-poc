const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ user: userId }) // corrected field
      .populate("actor", "name")  // populate the actor's name
      .populate("post", "text")   // populate the post text
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
