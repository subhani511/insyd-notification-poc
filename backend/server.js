const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
  "https://insyd-notification-poc-alpha.vercel.app", // production frontend
  "http://localhost:3000", // local dev frontend
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Socket.IO setup with same CORS
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});
app.set("io", io);

// Middleware
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/content", require("./routes/content"));
app.use("/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;

// Ensure Mongo URI always points to INSYD-POC
let mongoURI = process.env.MONGO_URI;
if (mongoURI && !mongoURI.includes("INSYD-POC")) {
  if (mongoURI.endsWith("/")) {
    mongoURI = mongoURI + "INSYD-POC";
  } else {
    mongoURI = mongoURI + "/INSYD-POC";
  }
}

async function startServer() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected to:", mongoURI);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
}

startServer();
