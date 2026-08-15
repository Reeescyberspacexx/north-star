// routes/auth.js
// Task: Backend server + database setup (owner: Marion)
//
// Login + signup. No real sessions/JWT — this just checks credentials
// against our mock user list (login) or adds a new one to it (signup).
// That's enough for an MVP proving the order-status and returns flows
// work end to end, including a real "create an account" path.

const express = require("express");
const { findUser, usernameExists, createUser } = require("../data/mockOrders");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { username, password, name } = req.body || {};

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

  const user = createUser({ username: username.trim(), password, name: name.trim() });
  res.status(201).json({ username: user.username, name: user.name });
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

  res.json({ username: user.username, name: user.name });
});

module.exports = router;
