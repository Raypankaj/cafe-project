const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  acceptOrder,
  markDone,
  markCollected   // ✅ YE MUST HAI
} = require("../controllers/orderController");

// 📦 Create Order
router.post("/", createOrder);

// 📥 Get All Orders
router.get("/", getOrders);

// ✅ Accept Order
router.put("/:id/accept", acceptOrder);

// 🟢 Mark Done
router.put("/:id/done", markDone);

// 💳 Customer collected order (NEW)
router.put("/:id/collected", markCollected);

module.exports = router;