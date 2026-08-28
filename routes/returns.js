// routes/returns.js
// Task: Returns API endpoint (owner: TBD - branch not created yet)
//
// Thin HTTP layer that takes the customer's answers, hands them to the
// decision-tree logic (logic/returnsDecisionTree.js), and sends back
// the result as JSON.

const express = require("express");
const { getOrderById } = require("../data/mockOrders");
const { evaluateReturn } = require("../logic/returnsDecisionTree");

const router = express.Router();

// POST /api/returns/check
// body: { orderId, reason, condition }
router.post("/check", (req, res) => {
  const { orderId, reason, condition } = req.body || {};

  if (!orderId || !reason) {
    return res.status(400).json({ error: "orderId and reason are required." });
  }

  const order = getOrderById(orderId);

  if (!order) {
    return res.status(404).json({ error: `No order found with id ${orderId}.` });
  }

  const decision = evaluateReturn(order, { reason, condition });

  res.json({ orderId, ...decision });
});

module.exports = router;
