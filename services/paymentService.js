// services/paymentService.js
// Task: Digital Payment / Mobile Money (M-Pesa Daraja mock)
//
// Fires a Cash-on-Delivery mobile money prompt the moment a rider's
// barcode scan is verified and an order flips to "arrived". This is a
// mock of the M-Pesa Daraja STK Push flow (no sandbox credentials
// required) — it returns immediately with a fake checkout reference so
// the frontend can show a realistic confirmation state.

function triggerCodPayment(order) {
  const checkoutRequestId = `mock-${order.orderId}-${Date.now()}`;

  console.log(
    `[MPESA MOCK] STK Push sent to ${order.customer_phone} for order ${order.orderId}. ` +
    `CheckoutRequestID=${checkoutRequestId}`
  );

  // Real Daraja integration would POST to
  // https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest here,
  // then confirm via the callback URL. We mock an instant "success" so
  // the delivery flow can be demoed end to end without sandbox creds.
  return {
    ok: true,
    checkoutRequestId,
    phone: order.customer_phone,
    status: "STK_PUSH_SENT",
    message: "M-Pesa payment prompt sent to customer's phone.",
  };
}

module.exports = { triggerCodPayment };
