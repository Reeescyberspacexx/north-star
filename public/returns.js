// public/returns.js
// Task: Returns frontend page (owner: TBD - branch not created yet)
//
// Pre-fills the order ID if we arrived here via a "Return this item"
// link, shows/hides the condition question depending on the reason
// (only "changed_mind" needs it), and submits to the returns API.

const form = document.getElementById("returns-form");
const orderIdInput = document.getElementById("orderId");
const reasonSelect = document.getElementById("reason");
const conditionGroup = document.getElementById("condition-group");
const conditionSelect = document.getElementById("condition");
const resultBox = document.getElementById("returns-result");

init();

function init() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");
  if (orderId) {
    orderIdInput.value = orderId;
  }

  reasonSelect.addEventListener("change", toggleConditionField);
  form.addEventListener("submit", handleSubmit);
}

function toggleConditionField() {
  if (reasonSelect.value === "changed_mind") {
    conditionGroup.classList.remove("hidden");
    conditionSelect.required = true;
  } else {
    conditionGroup.classList.add("hidden");
    conditionSelect.required = false;
    conditionSelect.value = "";
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  resultBox.className = "hidden";

  const payload = {
    orderId: orderIdInput.value.trim(),
    reason: reasonSelect.value,
    condition: conditionSelect.value || undefined,
  };

  try {
    const res = await fetch("/api/returns/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      showResult(data.error || "Something went wrong.", "error");
      return;
    }

    const tone = data.eligible ? "success" : "info";
    showResult(data.message, tone);
  } catch (err) {
    showResult("Couldn't reach the server. Is it running?", "error");
  }
}

function showResult(message, tone) {
  resultBox.textContent = message;
  resultBox.className = `result result-${tone}`;
}
