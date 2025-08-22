const express = require("express");
const Content = require("../models/Content");
const Notification = require("../models/Notification");
const User = require("../models/user");

module.exports = (io) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { authorId, text } = req.body;
      if (!authorId || !text) 
        return res.status(400).json({ error: "authorId and text required" });

      // Create content
      const content = new Content({ author: authorId, text });
      await content.save();

      // Populate author name
      const populatedContent = await Content.findById(content._id)
        .populate("author", "name");

      // Notify followers + author themselves
      const author = await User.findById(authorId);
      const recipients = [...(author?.followers || []), author._id];

      const notifications = recipients.map(userId => ({
        user: userId,
        contentId: content._id,
        type: "FOLLOW",  // followers notification
        read: false,
        authorName: author.name
      }));
      await Notification.insertMany(notifications);
      notifications.forEach(n => io.to(n.user.toString()).emit("new-notification", n));

      // Organic discovery notifications (everyone else)
      const allUsers = await User.find({ _id: { $nin: recipients } });
      const organicNotifications = allUsers.map(u => ({
        user: u._id,
        contentId: content._id,
        type: "DISCOVERY", // discovery notification
        read: false,
        authorName: author.name
      }));
      await Notification.insertMany(organicNotifications);
      organicNotifications.forEach(n => io.to(n.user.toString()).emit("new-notification", n));

      res.status(200).json(populatedContent);
    } catch (err) {
      console.error("POST /content error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};
