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

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/accept", acceptOrder);
router.put("/:id/done", markDone);
router.put("/:id/collected", markCollected);

module.exports = router;
