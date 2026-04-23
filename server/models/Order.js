const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    default: 1
  }
});

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: Number,
      required: true
    },
    items: {
      type: [itemSchema],
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["new", "accepted", "done", "collected"],
      default: "new"
    },
    time: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
