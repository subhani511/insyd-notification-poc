const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// ✅ Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId })
      .populate("actorId", "name")
      .populate("contentId", "text")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
