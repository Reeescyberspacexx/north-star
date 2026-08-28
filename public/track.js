// public/track.js
// Powers the "Track an order" page — order lookup + checkpoint route
// (unchanged from before), plus three additions:
//   1. Socket.io: re-renders live when the server broadcasts
//      `order:updated` for the order currently on screen.
//   2. Leaflet map: shows the parcel's current lat/lng and re-centers
//      whenever it moves.
//   3. Rider-only barcode/QR scanner ("Scan to Deliver"): opens the
//      camera, reads the code, and posts it to /verify-scan.

const form = document.getElementById("track-form");
const orderIdInput = document.getElementById("orderId");
const resultBox = document.getElementById("track-result");
const mapEl = document.getElementById("map");
const scanSection = document.getElementById("scan-section");
const scanBtn = document.getElementById("scan-btn");
const scanReader = document.getElementById("scan-reader");
const scanMsg = document.getElementById("scan-msg");

const STEPS = [
  { key: "preparing", label: "Preparing" },
  { key: "assigned", label: "Preparing" },
  { key: "in_transit", label: "In Transit" },
  { key: "arrived", label: "Arrived" },
];

let currentOrderId = null;
let map = null;
let marker = null;
let socket = null;
let html5QrCode = null;

init();

function init() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");
  const wantsScan = params.get("scan") === "1";

  connectSocket();

  if (orderId) {
    orderIdInput.value = orderId;
    lookupOrder(orderId);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    lookupOrder(orderIdInput.value.trim());
  });

  // Only riders get the scanner — gate on the role stored at login.
  if (wantsScan && localStorage.getItem("ns_role") === "rider") {
    scanSection.classList.remove("hidden");
  }
  scanBtn.addEventListener("click", startScanner);
}

function connectSocket() {
  if (typeof io !== "function") return; // socket.io script failed to load (offline demo, etc.)
  socket = io();
  socket.on("order:updated", (order) => {
    if (order.orderId === currentOrderId) {
      renderOrder(order);
      updateMap(order);
    }
  });
}

async function lookupOrder(orderId) {
  if (!orderId) return;
  currentOrderId = orderId;

  resultBox.className = "hidden";

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Couldn't find that order.");
      return;
    }

    renderOrder(data.order);
    updateMap(data.order);
  } catch (err) {
    showError("Couldn't reach the server. Is it running?");
  }
}

function renderOrder(order) {
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  const routeHtml = STEPS.map((step, i) => {
    let state = "upcoming";
    if (i < currentIndex) state = "done";
    if (i === currentIndex) state = order.status === "arrived" ? "done" : "current";

    return `
      <div class="checkpoint checkpoint-${state}">
        <span class="checkpoint-dot"></span>
        <span class="checkpoint-label">${step.label}</span>
      </div>
    `;
  }).join('<span class="checkpoint-track"></span>');

  const dateLine = order.status === "arrived"
    ? `Delivered ${order.deliveredDate}`
    : `Estimated arrival ${order.eta}`;

  resultBox.innerHTML = `
    <div class="label-card">
      <div class="label-card-top">
        <span class="label-code">${order.orderId}</span>
        <span class="label-status label-status-${order.status}">${STEPS[currentIndex]?.label ?? order.status}</span>
      </div>
      <div class="label-item">${order.item}</div>
      <div class="route">${routeHtml}</div>
      <div class="label-date">${dateLine}</div>
      <a class="link-button small" href="returns.html?orderId=${encodeURIComponent(order.orderId)}">Return this item</a>
    </div>
  `;
  resultBox.className = "";
}

function showError(message) {
  resultBox.innerHTML = `<div class="result result-error">${message}</div>`;
  resultBox.className = "";
  mapEl.classList.add("hidden");
}

// ---------------------------------------------------------------------
// Live map
// ---------------------------------------------------------------------
function updateMap(order) {
  if (typeof L === "undefined" || order.lat == null || order.lng == null) return;

  mapEl.classList.remove("hidden");

  if (!map) {
    map = L.map("map").setView([order.lat, order.lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    marker = L.marker([order.lat, order.lng]).addTo(map);
  } else {
    marker.setLatLng([order.lat, order.lng]);
    map.panTo([order.lat, order.lng]);
  }
}

// ---------------------------------------------------------------------
// Rider: scan to deliver
// ---------------------------------------------------------------------
function startScanner() {
  if (!currentOrderId) {
    scanMsg.textContent = "Look up an order first.";
    return;
  }
  if (typeof Html5Qrcode === "undefined") {
    scanMsg.textContent = "Scanner library failed to load.";
    return;
  }

  scanBtn.disabled = true;
  scanMsg.textContent = "Requesting camera access...";
  html5QrCode = new Html5Qrcode("scan-reader");

  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 220 },
      onScanSuccess,
      () => {} // ignore per-frame "no code found" errors
    )
    .catch((err) => {
      scanMsg.textContent = `Couldn't start camera: ${err}`;
      scanBtn.disabled = false;
    });
}

async function onScanSuccess(decodedText) {
  await html5QrCode.stop().catch(() => {});
  scanMsg.textContent = "Verifying barcode...";

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(currentOrderId)}/verify-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-username": localStorage.getItem("ns_username") || "",
        "x-user-role": localStorage.getItem("ns_role") || "",
      },
      body: JSON.stringify({ barcode: decodedText.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      scanMsg.textContent = data.error || "Barcode didn't match this order.";
      scanBtn.disabled = false;
      return;
    }

    renderOrder(data.order);
    updateMap(data.order);
    scanMsg.textContent = data.payment
      ? `Delivered! ${data.payment.message}`
      : "Delivered!";
  } catch (err) {
    scanMsg.textContent = "Couldn't reach the server.";
    scanBtn.disabled = false;
  }
}
