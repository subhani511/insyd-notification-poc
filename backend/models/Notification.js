const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // the recipient of the notification
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" }, // related post/content (if any)
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NEW: who triggered it (e.g., the follower)
  type: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
