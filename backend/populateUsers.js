// backend/src/populateUsers.js

const mongoose = require("mongoose");
const User = require("./models/UserItem"); // adjust path if needed
require("dotenv").config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/insyd-poc";

const usersData = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" },
  { name: "David", email: "david@example.com" },
  { name: "Eve", email: "eve@example.com" },
];

async function populateUsers() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    for (let u of usersData) {
      // Avoid duplicate users
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const newUser = new User(u);
        await newUser.save();
        console.log(`Added user: ${u.name}`);
      } else {
        console.log(`User already exists: ${u.name}`);
      }
    }

    console.log("✅ Users population finished");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error populating users:", err);
    process.exit(1);
  }
}

populateUsers();
