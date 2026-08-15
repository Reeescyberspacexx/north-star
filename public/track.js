// public/track.js
// Powers the "Track an order" page — takes an order ID typed directly
// by the customer (no login) and renders its status as a checkpoint
// route, the same way the returns page renders an eligibility result.

const form = document.getElementById("track-form");
const orderIdInput = document.getElementById("orderId");
const resultBox = document.getElementById("track-result");

const STEPS = [
  { key: "preparing", label: "Preparing" },
  { key: "in_transit", label: "In Transit" },
  { key: "arrived", label: "Arrived" },
];

init();

function init() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");
  if (orderId) {
    orderIdInput.value = orderId;
    lookupOrder(orderId);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    lookupOrder(orderIdInput.value.trim());
  });
}

async function lookupOrder(orderId) {
  if (!orderId) return;

  resultBox.className = "hidden";

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Couldn't find that order.");
      return;
    }

    renderOrder(data.order);
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
}
