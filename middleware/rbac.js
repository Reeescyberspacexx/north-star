// middleware/rbac.js
// Task: Role-Based Access Control (RBAC) Hardening
//
// This MVP has no JWT/session store (see routes/auth.js), so the
// frontend sends the logged-in user's identity on every API call as
// two headers, populated from what login/signup returned:
//
//   x-user-username: "amina"
//   x-user-role:     "retailer"
//
// requireRole() re-verifies that (username, role) pair against the
// database on every request — a spoofed header alone isn't enough,
// the username has to actually exist with that exact role — then
// attaches req.user for the route handler to use.

const db = require("../data/db");

function requireRole(...allowedRoles) {
  return function (req, res, next) {
    const username = req.headers["x-user-username"];
    const claimedRole = req.headers["x-user-role"];

    if (!username || !claimedRole) {
      return res.status(401).json({ error: "Missing user identity headers." });
    }

    const user = db.db.prepare("SELECT username, name, role FROM users WHERE username = ?").get(username);

    if (!user || user.role !== claimedRole) {
      return res.status(401).json({ error: "Could not verify user identity." });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `This action requires role: ${allowedRoles.join(" or ")}.` });
    }

    req.user = user;
    next();
  };
}

module.exports = { requireRole };
