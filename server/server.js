require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// 🔥 Create server + socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

// 🔌 Socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🔗 Connect DB
connectDB();

// 📝 Menu Schema (Agar DB mein items hain toh ye route unhe fetch karega)
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  category: String,
  image: String
});
// Ye check karega ki agar model pehle se hai toh use kare, warna naya banaye
const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

// 🧠 Middleware
app.use(cors());
app.use(express.json());

// 🔥 Make io accessible globally
app.locals.io = io;

// 📦 ROUTES START HERE

// 👉 1. Menu Route (Frontend menu.html yahan se data lega)
app.get("/api/menu", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// 👉 2. Orders Route (cart.html yahan order bhejega)
app.use("/api/orders", orderRoutes);

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🚀 Cafe Server Running...");
});

// ❌ 404 Handler (Ye hamesha routes ke niche hona chahiye)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global Error Handler (Fixed the syntax error here)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});