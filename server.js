// server.js
// Task: Backend server + database setup (owner: Marion)
//
// This is the entry point. It:
//   1. Starts an Express server wrapped in a raw Node HTTP server
//      (needed so Socket.io can share the same port)
//   2. Initializes Socket.io for real-time order updates
//   3. Serves the frontend (public/) as static files
//   4. Mounts our API routes:
//        /api/auth     -> login / signup
//        /api/orders   -> order-status + logistics endpoints
//        /api/returns  -> returns/refund endpoints

const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const returnsRoutes = require("./routes/returns");

const app = express();
const PORT = process.env.PORT || 3000;

// Wrap Express in a plain HTTP server so Socket.io can attach to the
// same server/port instead of needing a second one.
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`[socket] client connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`[socket] client disconnected: ${socket.id}`));
});

// Make io available to every route handler as req.io, so any route can
// do `req.io.emit('order:updated', order)` without importing sockets
// directly.
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/returns", returnsRoutes);

// Simple health check - handy for confirming the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

httpServer.listen(PORT, () => {
  console.log(`Northstar server running at http://localhost:${PORT}`);
});
