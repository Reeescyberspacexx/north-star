// routes/orders.js
// Task: Order-status API + logistics endpoints (owner: Nelly)

const express = require("express");
const db = require("../data/db");
const { requireRole } = require("../middleware/rbac");
const { notifyStatusChange } = require("../services/notificationService");
const { triggerCodPayment } = require("../services/paymentService");

const router = express.Router();

// ---------------------------------------------------------------------
// Customer-facing (unchanged behavior)
// ---------------------------------------------------------------------

// GET /api/orders?username=amina
router.get("/", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username query param is required." });
  }

  const orders = db.getOrdersByUsername(username);
  res.json({ orders });
});

// ---------------------------------------------------------------------
// Dispatcher / Rider dashboards
// (declared before "/:orderId" so they aren't swallowed by that route)
// ---------------------------------------------------------------------

// GET /api/orders/dispatch/open  -> unassigned orders, for the dispatcher board
router.get("/dispatch/open", requireRole("dispatcher"), (req, res) => {
  res.json({ orders: db.getOpenOrdersForDispatch(), riders: db.getRiders() });
});

// GET /api/orders/rider/mine -> this rider's active deliveries
router.get("/rider/mine", requireRole("rider"), (req, res) => {
  res.json({ orders: db.getOrdersForRider(req.user.username) });
});

// GET /api/orders/retailer/mine -> every order this retailer has created
router.get("/retailer/mine", requireRole("retailer"), (req, res) => {
  res.json({ orders: db.getOrdersForRetailer(req.user.username) });
});

// GET /api/orders/:orderId
router.get("/:orderId", (req, res) => {
  const order = db.getOrderById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: `No order found with id ${req.params.orderId}.` });
  }

  res.json({ order });
});

// ---------------------------------------------------------------------
// Retailer: create an order
// ---------------------------------------------------------------------

// POST /api/orders  { username, item, eta, customerPhone, returnWindowDays }
router.post("/", requireRole("retailer"), (req, res) => {
  const { username, item, eta, customerPhone, returnWindowDays } = req.body || {};

  if (!username || !item || !eta) {
    return res.status(400).json({ error: "username, item, and eta are required." });
  }

  const order = db.createOrder({
    username,
    item,
    eta,
    returnWindowDays,
    retailerUsername: req.user.username,
    customerPhone,
  });

  req.io.emit("order:updated", order);
  res.status(201).json({ order });
});

// ---------------------------------------------------------------------
// Dispatcher: assign a rider
// ---------------------------------------------------------------------

// PATCH /api/orders/:id/assign  { riderUsername }
router.patch("/:id/assign", requireRole("dispatcher"), (req, res) => {
  const { riderUsername } = req.body || {};

  if (!riderUsername) {
    return res.status(400).json({ error: "riderUsername is required." });
  }

  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `No order found with id ${req.params.id}.` });
  }

  const rider = db.db.prepare("SELECT * FROM users WHERE username = ? AND role = 'rider'").get(riderUsername);
  if (!rider) {
    return res.status(400).json({ error: `${riderUsername} is not a registered rider.` });
  }

  const updated = db.assignRider(req.params.id, riderUsername, req.user.username);

  req.io.emit("order:updated", updated);
  notifyStatusChange(updated);
  res.json({ order: updated });
});

// ---------------------------------------------------------------------
// Rider: update status (e.g. mark picked up / in transit)
// Only the rider actually assigned to the order can update it.
// ---------------------------------------------------------------------

// PATCH /api/orders/:id/status  { status, lat, lng }
router.patch("/:id/status", requireRole("rider"), (req, res) => {
  const { status, lat, lng } = req.body || {};

  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `No order found with id ${req.params.id}.` });
  }

  if (order.rider_username !== req.user.username) {
    return res.status(403).json({ error: "You are not the rider assigned to this order." });
  }

  const updated = db.updateOrderStatus(req.params.id, status, { lat, lng });
  if (!updated) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  req.io.emit("order:updated", updated);
  notifyStatusChange(updated);
  res.json({ order: updated });
});

// ---------------------------------------------------------------------
// Rider: scan barcode/QR to confirm delivery
// ---------------------------------------------------------------------

// POST /api/orders/:id/verify-scan  { barcode }
router.post("/:id/verify-scan", requireRole("rider"), (req, res) => {
  const { barcode } = req.body || {};

  if (!barcode) {
    return res.status(400).json({ error: "barcode is required." });
  }

  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `No order found with id ${req.params.id}.` });
  }

  if (order.rider_username !== req.user.username) {
    return res.status(403).json({ error: "You are not the rider assigned to this order." });
  }

  const result = db.verifyScanAndDeliver(req.params.id, barcode);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  req.io.emit("order:updated", result.order);
  notifyStatusChange(result.order);
  const payment = triggerCodPayment(result.order);

  res.json({ order: result.order, payment });
});

module.exports = router;
