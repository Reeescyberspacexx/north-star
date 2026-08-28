// public/script.js
// Task: Order-status frontend page (owner: Sikhakhane)
//
// Handles: auth (login/signup, now role-aware), and rendering one of
// four dashboards depending on the logged-in user's role:
//   customer   -> the original 3-column order board
//   retailer   -> order-creation form + a live feed of their orders
//   dispatcher -> open (unassigned) orders + rider assignment
//   rider      -> orders assigned to them, with a link to scan-to-deliver
//
// Real-time: connects to Socket.io and re-renders the active dashboard
// whenever the server broadcasts `order:updated`, so nobody has to
// refresh the page to see a status change.

const loginScreen = document.getElementById("login-screen");
const boardScreen = document.getElementById("board-screen");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authError = document.getElementById("auth-error");
const authTabs = document.querySelectorAll(".auth-tab");
const logoutBtn = document.getElementById("logout-btn");
const welcomeHeading = document.getElementById("welcome-heading");

const panels = {
  customer: document.getElementById("customer-panel"),
  retailer: document.getElementById("retailer-panel"),
  dispatcher: document.getElementById("dispatcher-panel"),
  rider: document.getElementById("rider-panel"),
};

const columns = {
  preparing: document.getElementById("col-preparing"),
  assigned: document.getElementById("col-preparing"), // assigned still reads as "preparing" to the customer
  in_transit: document.getElementById("col-transit"),
  arrived: document.getElementById("col-arrived"),
};

let currentUsername = null;
let currentRole = null;
let socket = null;

init();

function init() {
  const savedUsername = localStorage.getItem("ns_username");
  const savedRole = localStorage.getItem("ns_role");
  if (savedUsername && savedRole) {
    showBoard(savedUsername, localStorage.getItem("ns_name"), savedRole);
  }

  authTabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
  logoutBtn.addEventListener("click", handleLogout);

  const createOrderForm = document.getElementById("create-order-form");
  if (createOrderForm) createOrderForm.addEventListener("submit", handleCreateOrder);
}

function switchTab(tabName) {
  authError.textContent = "";
  authTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  loginForm.classList.toggle("hidden", tabName !== "login");
  signupForm.classList.toggle("hidden", tabName !== "signup");
}

async function handleLogin(e) {
  e.preventDefault();
  authError.textContent = "";

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      authError.textContent = data.error || "Login failed.";
      return;
    }

    persistSession(data);
    showBoard(data.username, data.name, data.role);
  } catch (err) {
    authError.textContent = "Couldn't reach the server. Is it running?";
  }
}

async function handleSignup(e) {
  e.preventDefault();
  authError.textContent = "";

  const name = document.getElementById("signup-name").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      authError.textContent = data.error || "Couldn't create your account.";
      return;
    }

    persistSession(data);
    showBoard(data.username, data.name, data.role);
  } catch (err) {
    authError.textContent = "Couldn't reach the server. Is it running?";
  }
}

function persistSession(data) {
  localStorage.setItem("ns_username", data.username);
  localStorage.setItem("ns_name", data.name);
  localStorage.setItem("ns_role", data.role);
}

function handleLogout() {
  localStorage.removeItem("ns_username");
  localStorage.removeItem("ns_name");
  localStorage.removeItem("ns_role");
  if (socket) socket.disconnect();
  boardScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
  signupForm.reset();
  switchTab("login");
}

// Small fetch wrapper that attaches the RBAC identity headers every
// protected route expects (see middleware/rbac.js).
function authedFetch(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "x-user-username": currentUsername,
    "x-user-role": currentRole,
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

async function showBoard(username, name, role) {
  currentUsername = username;
  currentRole = role;

  loginScreen.classList.add("hidden");
  boardScreen.classList.remove("hidden");
  welcomeHeading.textContent = name ? `Welcome back, ${name.split(" ")[0]}` : "Your Orders";

  Object.values(panels).forEach((p) => p && p.classList.add("hidden"));
  const panel = panels[role] || panels.customer;
  panel.classList.remove("hidden");

  connectSocket();

  if (role === "customer") await loadCustomerBoard(username);
  else if (role === "retailer") await loadRetailerFeed();
  else if (role === "dispatcher") await loadDispatchBoard();
  else if (role === "rider") await loadRiderBoard();
}

function connectSocket() {
  if (socket) socket.disconnect();
  socket = io();
  socket.on("order:updated", () => {
    // Simplest correct approach: re-fetch whichever dashboard is open.
    // Avoids juggling partial DOM patches across four very different views.
    if (currentRole === "customer") loadCustomerBoard(currentUsername);
    else if (currentRole === "retailer") loadRetailerFeed();
    else if (currentRole === "dispatcher") loadDispatchBoard();
    else if (currentRole === "rider") loadRiderBoard();
  });
}

// ---------------------------------------------------------------------
// Customer board
// ---------------------------------------------------------------------
async function loadCustomerBoard(username) {
  ["preparing", "in_transit", "arrived"].forEach((k) => (columns[k].innerHTML = ""));

  try {
    const res = await fetch(`/api/orders?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load orders.");

    if (data.orders.length === 0) {
      columns.preparing.innerHTML = "<p class='empty'>No orders yet.</p>";
      return;
    }
    data.orders.forEach(renderCard);
  } catch (err) {
    columns.preparing.innerHTML = `<p class='empty'>${err.message}</p>`;
  }
}

function renderCard(order) {
  const col = columns[order.status];
  if (!col) return;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="code">${order.orderId}</div>
    <div class="item">${order.item}</div>
    <div class="eta">${order.status === "arrived" ? "Delivered " + order.deliveredDate : "ETA " + order.eta}</div>
    <div class="card-actions">
      <a class="text-button small" href="track.html?orderId=${encodeURIComponent(order.orderId)}">Track</a>
      <a class="text-button small" href="returns.html?orderId=${encodeURIComponent(order.orderId)}">Return</a>
    </div>
  `;
  col.appendChild(card);
}

// ---------------------------------------------------------------------
// Retailer dashboard
// ---------------------------------------------------------------------
async function handleCreateOrder(e) {
  e.preventDefault();
  const msg = document.getElementById("retailer-msg");
  msg.textContent = "";

  const username = document.getElementById("new-order-username").value.trim();
  const item = document.getElementById("new-order-item").value.trim();
  const eta = document.getElementById("new-order-eta").value;
  const customerPhone = document.getElementById("new-order-phone").value.trim();

  try {
    const res = await authedFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ username, item, eta, customerPhone }),
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.error || "Couldn't create order.";
      return;
    }
    msg.textContent = `Created ${data.order.orderId} for ${username}.`;
    e.target.reset();
    loadRetailerFeed();
  } catch (err) {
    msg.textContent = "Couldn't reach the server.";
  }
}

async function loadRetailerFeed() {
  const feed = document.getElementById("retailer-feed");
  try {
    const res = await authedFetch("/api/orders/retailer/mine");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load orders.");

    feed.innerHTML = "";
    if (data.orders.length === 0) {
      feed.innerHTML = "<p class='empty'>No orders yet — create one above.</p>";
      return;
    }
    data.orders.forEach((order) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="code">${order.orderId}</div>
        <div class="item">${order.item} &rarr; ${order.username}</div>
        <div class="eta">Status: ${order.status}${order.rider_username ? " &middot; rider: " + order.rider_username : ""}</div>
      `;
      feed.appendChild(card);
    });
  } catch (err) {
    feed.innerHTML = `<p class='empty'>${err.message}</p>`;
  }
}

// ---------------------------------------------------------------------
// Dispatcher dashboard
// ---------------------------------------------------------------------
async function loadDispatchBoard() {
  const list = document.getElementById("dispatch-list");
  try {
    const res = await authedFetch("/api/orders/dispatch/open");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load open orders.");

    list.innerHTML = "";
    if (data.orders.length === 0) {
      list.innerHTML = "<p class='empty'>No open orders right now.</p>";
      return;
    }

    data.orders.forEach((order) => {
      const card = document.createElement("div");
      card.className = "card";
      const riderOptions = data.riders
        .map((r) => `<option value="${r.username}">${r.name}</option>`)
        .join("");
      card.innerHTML = `
        <div class="code">${order.orderId}</div>
        <div class="item">${order.item} &rarr; ${order.username}</div>
        <div class="eta">Status: ${order.status}</div>
        <div class="card-actions">
          <select id="rider-select-${order.orderId}">${riderOptions}</select>
          <button type="button" class="text-button small" data-order="${order.orderId}">Assign</button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => assignRider(order.orderId));
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = `<p class='empty'>${err.message}</p>`;
  }
}

async function assignRider(orderId) {
  const select = document.getElementById(`rider-select-${orderId}`);
  const riderUsername = select.value;

  const res = await authedFetch(`/api/orders/${encodeURIComponent(orderId)}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ riderUsername }),
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Couldn't assign rider.");
    return;
  }
  loadDispatchBoard();
}

// ---------------------------------------------------------------------
// Rider dashboard
// ---------------------------------------------------------------------
async function loadRiderBoard() {
  const list = document.getElementById("rider-list");
  try {
    const res = await authedFetch("/api/orders/rider/mine");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load your deliveries.");

    list.innerHTML = "";
    if (data.orders.length === 0) {
      list.innerHTML = "<p class='empty'>Nothing assigned to you right now.</p>";
      return;
    }

    data.orders.forEach((order) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="code">${order.orderId}</div>
        <div class="item">${order.item} &rarr; ${order.username}</div>
        <div class="eta">Status: ${order.status}</div>
        <div class="hint">Package barcode: <code>${order.barcode_hash}</code></div>
        <div class="card-actions">
          <a class="text-button small" href="track.html?orderId=${encodeURIComponent(order.orderId)}&scan=1">Scan to Deliver</a>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = `<p class='empty'>${err.message}</p>`;
  }
}
