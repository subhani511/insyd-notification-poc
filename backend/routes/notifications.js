const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // FIX: query by "userId" (schema field), not "user"
    // ADD: populate actorId to fetch their "name"
    const notifications = await Notification.find({ userId })
      .populate("actorId", "name email") // fetch actor's name (and email if needed)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error("GET /notifications error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
