// server.js
// Task: Backend server + database setup (owner: Marion)
//
// This is the entry point. It:
//   1. Starts an Express server
//   2. Serves the frontend (public/) as static files
//   3. Mounts our API routes:
//        /api/auth     -> login
//        /api/orders   -> order-status endpoints
//        /api/returns  -> returns/refund endpoints

const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const returnsRoutes = require("./routes/returns");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/returns", returnsRoutes);

// Simple health check - handy for confirming the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Northstar server running at http://localhost:${PORT}`);
});
