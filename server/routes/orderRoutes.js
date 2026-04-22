const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  acceptOrder,
  markDone,
  markCollected
} = require("../controllers/orderController");

// Create Order
router.post("/", createOrder);

// Get All Orders
router.get("/", getOrders);

// Get Single Order
router.get("/:id", getOrderById);

// Accept Order
router.put("/:id/accept", acceptOrder);

// Mark Done
router.put("/:id/done", markDone);

// Customer collected order
router.put("/:id/collected", markCollected);

module.exports = router;
