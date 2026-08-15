// public/script.js
// Task: Order-status frontend page (owner: Sikhakhane)
//
// Handles: switching between Log In / Sign Up tabs, submitting both
// forms, remembering who's logged in, and fetching + rendering that
// user's orders into the three status columns.

const loginScreen = document.getElementById("login-screen");
const boardScreen = document.getElementById("board-screen");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authError = document.getElementById("auth-error");
const authTabs = document.querySelectorAll(".auth-tab");
const logoutBtn = document.getElementById("logout-btn");
const welcomeHeading = document.getElementById("welcome-heading");

const columns = {
  preparing: document.getElementById("col-preparing"),
  in_transit: document.getElementById("col-transit"),
  arrived: document.getElementById("col-arrived"),
};

init();

function init() {
  const savedUsername = localStorage.getItem("ns_username");
  if (savedUsername) {
    showBoard(savedUsername);
  }

  authTabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
  logoutBtn.addEventListener("click", handleLogout);
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

    localStorage.setItem("ns_username", data.username);
    localStorage.setItem("ns_name", data.name);
    showBoard(data.username, data.name);
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

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      authError.textContent = data.error || "Couldn't create your account.";
      return;
    }

    // Signup succeeded — log them straight in, same as a real signup flow would.
    localStorage.setItem("ns_username", data.username);
    localStorage.setItem("ns_name", data.name);
    showBoard(data.username, data.name);
  } catch (err) {
    authError.textContent = "Couldn't reach the server. Is it running?";
  }
}

function handleLogout() {
  localStorage.removeItem("ns_username");
  localStorage.removeItem("ns_name");
  boardScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
  signupForm.reset();
  switchTab("login");
}

async function showBoard(username, name) {
  loginScreen.classList.add("hidden");
  boardScreen.classList.remove("hidden");
  welcomeHeading.textContent = name ? `Welcome back, ${name.split(" ")[0]}` : "Your Orders";

  Object.values(columns).forEach((col) => (col.innerHTML = ""));

  try {
    const res = await fetch(`/api/orders?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load orders.");
    }

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
