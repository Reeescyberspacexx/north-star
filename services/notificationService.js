// services/notificationService.js
// Task: SMS / WhatsApp Customer Notifications
//
// Sends a text to the customer whenever their order is Assigned or
// Delivered. By default this just logs to the console (so the feature
// is fully demoable with zero API keys). Drop in real Africa's Talking
// or Twilio credentials via env vars to send real SMS — see the
// commented block below.

// Uncomment after `npm install africastalking` and setting env vars:
//
// const AfricasTalking = require("africastalking")({
//   apiKey: process.env.AT_API_KEY,
//   username: process.env.AT_USERNAME,
// });
// const sms = AfricasTalking.SMS;

async function sendSMS(toPhoneNumber, message) {
  if (!toPhoneNumber) {
    console.warn("[SMS] Skipped — no phone number on file.");
    return { ok: false, error: "No phone number on file." };
  }

  // Real send (uncomment once AT_API_KEY / AT_USERNAME are set):
  //
  // try {
  //   const result = await sms.send({ to: [toPhoneNumber], message });
  //   console.log(`[SMS] Sent to ${toPhoneNumber}:`, result);
  //   return { ok: true, result };
  // } catch (err) {
  //   console.error(`[SMS] Failed to send to ${toPhoneNumber}:`, err.message);
  //   return { ok: false, error: err.message };
  // }

  console.log(`[SMS ALERT -> ${toPhoneNumber}]: ${message}`);
  return { ok: true, mocked: true };
}

function notifyStatusChange(order) {
  if (order.status === "assigned") {
    return sendSMS(
      order.customer_phone,
      `Northstar: your order ${order.orderId} (${order.item}) has been picked up by a rider and is on its way soon.`
    );
  }
  if (order.status === "in_transit") {
    return sendSMS(
      order.customer_phone,
      `Northstar: your order ${order.orderId} is now in transit. ETA ${order.eta}.`
    );
  }
  if (order.status === "arrived") {
    return sendSMS(
      order.customer_phone,
      `Northstar: your order ${order.orderId} has been delivered. Thank you for shopping with us!`
    );
  }
  return null;
}

module.exports = { sendSMS, notifyStatusChange };
