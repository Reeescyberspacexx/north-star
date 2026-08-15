// routes/orders.js
// Task: Order-status API endpoint (owner: Nelly)

const express = require("express");
const { getOrdersByUsername, getOrderById } = require("../data/mockOrders");

const router = express.Router();

// GET /api/orders?username=amina
// Returns every order belonging to that user (used to fill the board).
router.get("/", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username query param is required." });
  }

  const orders = getOrdersByUsername(username);
  res.json({ orders });
});

// GET /api/orders/:orderId
// Returns the status of a single order.
router.get("/:orderId", (req, res) => {
  const order = getOrderById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: `No order found with id ${req.params.orderId}.` });
  }

  res.json({ order });
});

module.exports = router;
