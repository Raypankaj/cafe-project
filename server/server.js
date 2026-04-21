require("dotenv").config();


const express = require("express");
const cors = require("cors");
const http = require("http");
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

// 🧠 Middleware
app.use(cors());
app.use(express.json());

// 🔥 Make io accessible globally
app.locals.io = io;

// 📦 Routes
app.use("/api/orders", orderRoutes);

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🚀 Cafe Server Running...");
});

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {https://brew-haven-backend-pgy1.onrender.com
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});

app.post("/save-menu", async (req, res) => {
  try {
    await Menu.deleteMany();
    await Menu.insertMany(req.body);

    // 🔥 REAL-TIME BROADCAST
    req.app.locals.io.emit("menuUpdated");

    res.json({ message: "Menu saved" });
  } catch (err) {
    res.status(500).json(err);
  }
});