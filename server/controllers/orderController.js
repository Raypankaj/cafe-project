const Order = require("../models/Order");

// 📦 Create Order
exports.createOrder = async (req, res) => {
  try {
    const { io } = req.app.locals;

    const { table, items, total } = req.body;

    // ❗ Validation
    if (!table || !items || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = await Order.create({
      table,
      items,
      total,
      status: "new"
    });

    // 🔥 Emit new order
    io.emit("newOrder", newOrder);

    res.status(201).json(newOrder);

  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📥 Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Accept Order
exports.acceptOrder = async (req, res) => {
  try {
    const { io } = req.app.locals;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "accepted";
    order.time = Number(req.body.time) || 10;

    await order.save();

    // 🔥 Emit timer start
    io.emit("orderAccepted", {
      id: order._id.toString(),
      time: order.time
    });

    res.json(order);

  } catch (error) {
    console.error("Accept Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Mark Done
exports.markDone = async (req, res) => {
  try {
    const { io } = req.app.locals;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "done";
    await order.save();

    // 🔥 Notify customer
    io.emit("orderDone", {
      id: order._id.toString()
    });

    res.json(order);

  } catch (error) {
    console.error("Mark Done Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
exports.markCollected = async (req, res) => {
  const { io } = req.app.locals;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "collected";
  await order.save();

  io.emit("orderCollected", {
    id: order._id.toString()
  });

  res.json(order);
};