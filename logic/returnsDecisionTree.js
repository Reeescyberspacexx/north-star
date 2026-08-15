// logic/returnsDecisionTree.js
// Task: Returns/refunds decision-tree logic (owner: steve-biko)
//
// This is the "brain" behind the returns flow. Given an order plus the
// customer's answers, it walks the same tree a support agent would use
// and returns a decision + a plain-English explanation.
//
// Decision tree:
//   1. Has the order arrived yet?
//        No  -> NOT ELIGIBLE (can't return something not delivered yet)
//        Yes -> go to 2
//   2. Is it still within the return window (deliveredDate + returnWindowDays)?
//        No  -> NOT ELIGIBLE (window expired)
//        Yes -> go to 3
//   3. What's the reason?
//        "defective" or "wrong_item" -> ELIGIBLE, full refund, free return label
//        "changed_mind":
//             condition "unopened" -> ELIGIBLE, full refund, customer pays return shipping
//             condition "opened"   -> NOT ELIGIBLE for refund, offer store credit instead
//        anything else -> MANUAL REVIEW (send to a human)

const VALID_REASONS = ["defective", "wrong_item", "changed_mind"];
const VALID_CONDITIONS = ["unopened", "opened"];

function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date(dateB) - new Date(dateA)) / msPerDay);
}

/**
 * @param {Object} order - the order record from the mock database
 * @param {Object} answers - { reason, condition }
 * @returns {Object} decision result
 */
function evaluateReturn(order, answers) {
  const { reason, condition } = answers;

  // Step 1: has it arrived?
  if (!order.deliveredDate) {
    return {
      eligible: false,
      outcome: "not_eligible",
      reasonCode: "not_delivered",
      message:
        "This order hasn't arrived yet, so it can't be returned. Once it's marked as delivered, you can start a return within the return window.",
    };
  }

  // Step 2: still within the return window?
  const daysSinceDelivery = daysBetween(order.deliveredDate, todayISO());
  const windowDays = order.returnWindowDays ?? 30;
  if (daysSinceDelivery > windowDays) {
    return {
      eligible: false,
      outcome: "not_eligible",
      reasonCode: "window_expired",
      message: `The ${windowDays}-day return window for this order has passed (it was delivered ${daysSinceDelivery} days ago). It's no longer eligible for a return.`,
    };
  }

  // Validate inputs before branching further
  if (!VALID_REASONS.includes(reason)) {
    return {
      eligible: false,
      outcome: "manual_review",
      reasonCode: "unrecognized_reason",
      message:
        "We couldn't automatically process this reason. It's been flagged for manual review by our support team.",
    };
  }

  // Step 3: branch on reason
  if (reason === "defective" || reason === "wrong_item") {
    return {
      eligible: true,
      outcome: "approved",
      reasonCode: reason,
      refundType: "full_refund",
      shippingCost: "free",
      message:
        "You're eligible for a full refund. We'll email you a free return label — no need to pay for shipping.",
    };
  }

  if (reason === "changed_mind") {
    if (!VALID_CONDITIONS.includes(condition)) {
      return {
        eligible: false,
        outcome: "manual_review",
        reasonCode: "missing_condition",
        message:
          "We need to know the item's condition to process this. It's been flagged for manual review.",
      };
    }

    if (condition === "unopened") {
      return {
        eligible: true,
        outcome: "approved",
        reasonCode: "changed_mind_unopened",
        refundType: "full_refund",
        shippingCost: "customer_pays",
        message:
          "You're eligible for a full refund since the item is unopened. You'll need to cover return shipping — we'll send instructions by email.",
      };
    }

    // condition === "opened"
    return {
      eligible: false,
      outcome: "store_credit_offer",
      reasonCode: "changed_mind_opened",
      message:
        "Since the item's been opened, it's not eligible for a cash refund — but we can offer store credit for the full value instead.",
    };
  }

  // Fallback (shouldn't be reachable given the validation above)
  return {
    eligible: false,
    outcome: "manual_review",
    reasonCode: "unhandled",
    message: "This case needs a human to look at it — flagged for manual review.",
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

module.exports = { evaluateReturn, VALID_REASONS, VALID_CONDITIONS };
