const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Content", contentSchema);
