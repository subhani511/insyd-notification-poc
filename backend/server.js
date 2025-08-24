const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // 👈 load .env for MONGO_URI etc.

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // 👈 allow all origins (can restrict later)
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/content", require("./routes/content"));
app.use("/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/insyd-poc";

// Start server with DB connection
async function startServer() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
}

startServer();
