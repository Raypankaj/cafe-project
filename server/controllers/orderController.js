const Order = require("../models/Order");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { io } = req.app.locals;
    const { table, items, total } = req.body;

    if (!table || !Array.isArray(items) || items.length === 0 || Number(total) <= 0) {
      return res.status(400).json({ message: "Missing or invalid order fields" });
    }

    const newOrder = await Order.create({
      table,
      items,
      total: Number(total),
      status: "new"
    });

    if (io) {
      io.emit("newOrder", newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order By Id Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept Order
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

    if (io) {
      io.emit("orderAccepted", {
        id: order._id.toString(),
        time: order.time
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Accept Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark Done
exports.markDone = async (req, res) => {
  try {
    const { io } = req.app.locals;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "done";
    await order.save();

    if (io) {
      io.emit("orderDone", {
        id: order._id.toString()
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Mark Done Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark Collected
exports.markCollected = async (req, res) => {
  try {
    const { io } = req.app.locals;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "collected";
    await order.save();

    if (io) {
      io.emit("orderCollected", {
        id: order._id.toString()
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Mark Collected Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};