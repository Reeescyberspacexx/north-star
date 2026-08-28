// routes/auth.js
// Task: Backend server + database setup (owner: Marion)
//
// Login + signup, now backed by SQLite (data/db.js) instead of an
// in-memory array. Still no real JWT/session store — this is an MVP —
// but every user now carries a `role` (customer / retailer / dispatcher
// / rider) that the frontend stores and the RBAC middleware checks on
// every protected request.

const express = require("express");
const { findUser, usernameExists, createUser } = require("../data/db");

const router = express.Router();

const ALLOWED_SIGNUP_ROLES = ["customer", "retailer", "dispatcher", "rider"];

router.post("/signup", (req, res) => {
  const { username, password, name, role } = req.body || {};

  if (!username || !password || !name) {
    return res.status(400).json({ error: "Name, username, and password are all required." });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  if (usernameExists(username)) {
    return res.status(409).json({ error: "That username is already taken." });
  }

  const safeRole = ALLOWED_SIGNUP_ROLES.includes(role) ? role : "customer";
  const user = createUser({ username: username.trim(), password, name: name.trim(), role: safeRole });
  res.status(201).json({ username: user.username, name: user.name, role: user.role });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const user = findUser(username, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  res.json({ username: user.username, name: user.name, role: user.role });
});

module.exports = router;
