// data/db.js
// Task: Database & Data Model Transition
//
// Replaces the in-memory mockOrders.js array with a real SQLite database
// using Node's BUILT-IN node:sqlite module (Node 22.5+) — synchronous,
// zero-config, single file on disk, and crucially requires NO native
// compilation. (We originally used better-sqlite3, but that needs a C++
// build toolchain — Visual Studio Build Tools on Windows — which most
// machines don't have installed and which has no prebuilt binary for
// very new Node versions. node:sqlite ships inside Node itself, so
// there's nothing to compile, ever.)
//
// On first boot it creates the schema and seeds it from the original
// mockOrders.js data so nothing you already had breaks.
//
// Schema adds what the logistics flow needs on top of the original
// customer-tracking model:
//   users.role         -> 'customer' | 'retailer' | 'dispatcher' | 'rider'
//   orders.retailer_username -> who created the order
//   orders.dispatcher_username -> who assigned a rider to it
//   orders.rider_username      -> who's delivering it
//   orders.barcode_hash        -> scanned at drop-off to confirm delivery
//   orders.lat / orders.lng    -> live parcel position for the map
//   orders.customer_phone      -> where delivery SMS notifications go
//
// Status lifecycle: preparing -> assigned -> in_transit -> arrived

const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.NORTHSTAR_DB_PATH || path.join(__dirname, "northstar.db");
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");

// Seed volume: your original mockOrders.js has 120 hand-authored orders;
// this tops the DB up to at least this many total so dashboards have a
// realistic amount of data to work with out of the box.
const MIN_SEED_ORDERS = 200;

const SYNTHETIC_ITEMS = [
  "Wireless Earbuds", "Yoga Mat", "Desk Lamp", "Travel Mug", "Phone Case",
  "Bath Towel Set", "Laptop Sleeve", "Ceramic Mug Set", "Throw Pillow",
  "Cast Iron Pan", "Running Shoes", "Sunglasses", "Backpack - Everyday",
  "Bluetooth Speaker - Black", "Water Bottle - 1L", "Notebook Set",
  "Wall Clock", "Table Lamp", "Blender - Compact", "Air Fryer",
  "Office Chair - Black", "Bookshelf - 3 Tier", "Rug - 5x7", "Curtains - Pair",
  "Toaster - 2 Slice", "Electric Fan", "Iron Box", "Cushion Cover Set",
];

const SYNTHETIC_STATUSES = ["preparing", "assigned", "in_transit", "arrived", "arrived", "arrived"];

function randomRecentDate(withinPastDays) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * withinPastDays));
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    orderId TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    item TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'preparing',
    orderDate TEXT,
    eta TEXT,
    deliveredDate TEXT,
    returnWindowDays INTEGER DEFAULT 30,
    retailer_username TEXT,
    dispatcher_username TEXT,
    rider_username TEXT,
    barcode_hash TEXT,
    customer_phone TEXT,
    lat REAL,
    lng REAL
  );
`);

// ---------------------------------------------------------------------
// One-time seed: only runs if the orders table is empty, so re-running
// the server never duplicates data.
// ---------------------------------------------------------------------
function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM orders").get();
  if (count > 0) return;

  const { mockOrders, mockUsers } = require("./mockOrders");

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, name, role, phone)
    VALUES (@username, @password, @name, @role, @phone)
  `);
  const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders
      (orderId, username, item, status, orderDate, eta, deliveredDate, returnWindowDays,
       retailer_username, barcode_hash, customer_phone, lat, lng)
    VALUES
      (@orderId, @username, @item, @status, @orderDate, @eta, @deliveredDate, @returnWindowDays,
       @retailer_username, @barcode_hash, @customer_phone, @lat, @lng)
  `);

  function seedAll() {
    db.exec("BEGIN");
    try {
      mockUsers.forEach((u) =>
        insertUser.run({ ...u, role: "customer", phone: fakePhoneFor(u.username) })
      );

      // Extra role accounts so RBAC has someone to log in as out of the box.
      [
        { username: "retailer1", password: "password123", name: "Amina's Boutique", role: "retailer" },
        { username: "dispatch1", password: "password123", name: "Dispatch - Peris", role: "dispatcher" },
        { username: "rider1", password: "password123", name: "Rider - Kevin", role: "rider" },
        { username: "rider2", password: "password123", name: "Rider - Susan", role: "rider" },
      ].forEach((u) => insertUser.run({ ...u, phone: fakePhoneFor(u.username) }));

      mockOrders.forEach((o) => {
        insertOrder.run({
          orderId: o.orderId,
          username: o.username,
          item: o.item,
          status: o.status,
          orderDate: o.orderDate,
          eta: o.eta,
          deliveredDate: o.deliveredDate,
          returnWindowDays: o.returnWindowDays,
          retailer_username: "retailer1",
          barcode_hash: hashBarcode(o.orderId),
          customer_phone: fakePhoneFor(o.username),
          lat: -1.2864 + (Math.random() - 0.5) * 0.05,
          lng: 36.8172 + (Math.random() - 0.5) * 0.05,
        });
      });

      // Top up to MIN_SEED_ORDERS so the DB has a realistic volume of data
      // to demo dispatcher/rider dashboards and pagination against, without
      // hand-authoring dozens more entries in mockOrders.js.
      const highestNum = mockOrders.reduce(
        (max, o) => Math.max(max, parseInt(o.orderId.split("-")[1], 10)),
        1000
      );
      const usernames = mockUsers.map((u) => u.username);
      const extraNeeded = Math.max(0, MIN_SEED_ORDERS - mockOrders.length);

      for (let i = 0; i < extraNeeded; i++) {
        const orderId = `NS-${highestNum + 1 + i}`;
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const item = SYNTHETIC_ITEMS[Math.floor(Math.random() * SYNTHETIC_ITEMS.length)];
        const status = SYNTHETIC_STATUSES[Math.floor(Math.random() * SYNTHETIC_STATUSES.length)];

        const orderDate = randomRecentDate(45);
        const eta = addDays(orderDate, 3 + Math.floor(Math.random() * 7));
        const deliveredDate = status === "arrived" ? eta : null;

        insertOrder.run({
          orderId,
          username,
          item,
          status,
          orderDate,
          eta,
          deliveredDate,
          returnWindowDays: 30,
          retailer_username: "retailer1",
          barcode_hash: hashBarcode(orderId),
          customer_phone: fakePhoneFor(username),
          lat: -1.2864 + (Math.random() - 0.5) * 0.05,
          lng: 36.8172 + (Math.random() - 0.5) * 0.05,
        });
      }

      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  seedAll();
  const { count: finalCount } = db.prepare("SELECT COUNT(*) as count FROM orders").get();
  console.log(`[db] Seeded ${finalCount} orders and ${mockUsers.length + 4} users into ${DB_PATH}`);
}

function fakePhoneFor(username) {
  let h = 0;
  for (const ch of username) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return "+2547" + String(h % 100000000).padStart(8, "0");
}

function hashBarcode(orderId) {
  return crypto.createHash("sha256").update(orderId + "|northstar-secret").digest("hex").slice(0, 16);
}

seedIfEmpty();

// ---------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------
function findUser(username, password) {
  return db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
}

function usernameExists(username) {
  return !!db.prepare("SELECT 1 FROM users WHERE username = ?").get(username);
}

function createUser({ username, password, name, role = "customer" }) {
  db.prepare("INSERT INTO users (username, password, name, role, phone) VALUES (?, ?, ?, ?, ?)")
    .run(username, password, name, role, fakePhoneFor(username));
  return { username, name, role };
}

function getRiders() {
  return db.prepare("SELECT username, name, phone FROM users WHERE role = 'rider'").all();
}

// ---------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------
function getOrdersByUsername(username) {
  return db.prepare("SELECT * FROM orders WHERE username = ?").all(username);
}

function getOrderById(orderId) {
  return db.prepare("SELECT * FROM orders WHERE orderId = ?").get(orderId);
}

function getOpenOrdersForDispatch() {
  // Anything not yet assigned to a rider.
  return db.prepare("SELECT * FROM orders WHERE rider_username IS NULL AND status != 'arrived'").all();
}

function getOrdersForRider(riderUsername) {
  return db.prepare("SELECT * FROM orders WHERE rider_username = ? AND status != 'arrived'").all(riderUsername);
}

function getOrdersForRetailer(retailerUsername) {
  return db.prepare("SELECT * FROM orders WHERE retailer_username = ? ORDER BY rowid DESC").all(retailerUsername);
}

function createOrder({ username, item, eta, returnWindowDays = 30, retailerUsername, customerPhone }) {
  const nextIdRow = db.prepare(
    "SELECT orderId FROM orders ORDER BY rowid DESC LIMIT 1"
  ).get();
  const nextNum = nextIdRow ? parseInt(nextIdRow.orderId.split("-")[1], 10) + 1 : 1001;
  const orderId = `NS-${nextNum}`;
  const orderDate = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO orders
      (orderId, username, item, status, orderDate, eta, deliveredDate, returnWindowDays,
       retailer_username, barcode_hash, customer_phone, lat, lng)
    VALUES (?, ?, ?, 'preparing', ?, ?, NULL, ?, ?, ?, ?, ?, ?)
  `).run(
    orderId, username, item, orderDate, eta, returnWindowDays,
    retailerUsername, hashBarcode(orderId), customerPhone || fakePhoneFor(username),
    -1.2864, 36.8172
  );

  return getOrderById(orderId);
}

function assignRider(orderId, riderUsername, dispatcherUsername) {
  const order = getOrderById(orderId);
  if (!order) return null;

  db.prepare(`
    UPDATE orders
    SET rider_username = ?, dispatcher_username = ?, status = 'assigned'
    WHERE orderId = ?
  `).run(riderUsername, dispatcherUsername, orderId);

  return getOrderById(orderId);
}

const VALID_STATUSES = ["preparing", "assigned", "in_transit", "arrived"];

function updateOrderStatus(orderId, status, extra = {}) {
  if (!VALID_STATUSES.includes(status)) return null;
  const order = getOrderById(orderId);
  if (!order) return null;

  const deliveredDate = status === "arrived" ? new Date().toISOString().slice(0, 10) : order.deliveredDate;
  const lat = extra.lat ?? order.lat;
  const lng = extra.lng ?? order.lng;

  db.prepare(`
    UPDATE orders SET status = ?, deliveredDate = ?, lat = ?, lng = ?
    WHERE orderId = ?
  `).run(status, deliveredDate, lat, lng, orderId);

  return getOrderById(orderId);
}

function verifyScanAndDeliver(orderId, scannedBarcode) {
  const order = getOrderById(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  if (order.barcode_hash !== scannedBarcode) return { ok: false, error: "Barcode does not match this order." };

  const updated = updateOrderStatus(orderId, "arrived");
  return { ok: true, order: updated };
}

module.exports = {
  db,
  findUser,
  usernameExists,
  createUser,
  getRiders,
  getOrdersByUsername,
  getOrderById,
  getOpenOrdersForDispatch,
  getOrdersForRider,
  getOrdersForRetailer,
  createOrder,
  assignRider,
  updateOrderStatus,
  verifyScanAndDeliver,
  hashBarcode,
};
