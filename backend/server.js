const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io accessible in routes
app.set("io", io);

// Models
const User = require("./models/user");
const Content = require("./models/Content");
const Notification = require("./models/Notification");

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

// Routes
app.use("/users", require("./routes/users"));
app.use("/content", require("./routes/content")(io));
app.use("/notifications", require("./routes/notifications"));

const PORT = 5000;

// Wrap DB connection and server start in async function
async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/insyd-poc", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

startServer();
