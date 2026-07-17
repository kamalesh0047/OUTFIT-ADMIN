// ============================================================================
//  OUTFIT — Razorpay Cloud Functions
// ----------------------------------------------------------------------------
//  createRazorpayOrder  (callable)  → prices the cart SERVER-side from
//                                     Firestore and creates a Razorpay order.
//                                     The amount shown in UPI/card checkout
//                                     comes from here automatically.
//  verifyPayment        (callable)  → verifies the payment signature with the
//                                     key secret before the order is trusted.
//  razorpayWebhook      (HTTP)      → optional backup confirmation from
//                                     Razorpay's servers.
//
//  Keys live in functions/.env (never in the frontend bundle).
// ============================================================================

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// Mumbai region → lowest latency for Razorpay India
setGlobalOptions({ region: "asia-south1", maxInstances: 10 });

function rzp() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new HttpsError(
      "failed-precondition",
      "Razorpay keys are not configured. Fill functions/.env and redeploy."
    );
  }
  return new Razorpay({ key_id, key_secret });
}

// ── Pricing rules: MUST mirror src/context/CartContext.jsx ─────────────────
const COUPONS = { OUTFIT10: 0.10, STYLE20: 0.20 };

function shippingFor(subtotal) {
  if (subtotal >= 1500 || subtotal === 0) return 0;
  if (subtotal >= 1000) return 50;
  if (subtotal >= 300) return 75;
  return 0;
}

async function priceCart(items, couponCode) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError("invalid-argument", "Cart is empty.");
  }
  if (items.length > 50) {
    throw new HttpsError("invalid-argument", "Too many items.");
  }

  let subtotal = 0;
  for (const it of items) {
    if (!it || typeof it.id !== "string") {
      throw new HttpsError("invalid-argument", "Bad cart item.");
    }
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    const snap = await db.collection("products").doc(it.id).get();
    if (!snap.exists) {
      throw new HttpsError("not-found", `Product no longer available (${it.id}).`);
    }
    const price = Number(snap.data().price) || 0;
    subtotal += price * qty;
  }

  const rate = COUPONS[(couponCode || "").toUpperCase()] || 0;
  const discount = Math.round(subtotal * rate);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.05);
  const shipping = shippingFor(subtotal);
  const total = taxable + tax + shipping;
  return { subtotal, discount, tax, shipping, total };
}

// ── 1) Create a Razorpay order (amount auto-derived from the cart) ─────────
exports.createRazorpayOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please sign in to pay.");
  }
  const { items, couponCode } = request.data || {};
  const totals = await priceCart(items, couponCode);
  if (totals.total < 1) {
    throw new HttpsError("invalid-argument", "Order total is invalid.");
  }

  const client = rzp();
  const order = await client.orders.create({
    amount: totals.total * 100, // paise — UPI/card apps read this automatically
    currency: "INR",
    receipt: `outfit_${request.auth.uid.slice(0, 12)}_${Date.now()}`,
    notes: { uid: request.auth.uid },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID, // public key — safe for the client
    totals,
  };
});

// ── 2) Verify the payment signature before trusting it ─────────────────────
exports.verifyPayment = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please sign in.");
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    request.data || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new HttpsError("invalid-argument", "Missing payment details.");
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new HttpsError("permission-denied", "Payment verification failed.");
  }

  // Pull the authoritative paid amount from Razorpay
  const order = await rzp().orders.fetch(razorpay_order_id);

  // Audit trail (also lets the webhook reconcile later)
  await db.collection("payments").doc(razorpay_order_id).set(
    {
      uid: request.auth.uid,
      paymentId: razorpay_payment_id,
      amount: order.amount,
      status: "verified",
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { verified: true, amountPaid: order.amount };
});

// ── 3) Optional webhook (backup confirmation from Razorpay's servers) ──────
exports.razorpayWebhook = onRequest(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).send("Webhook not configured");
    return;
  }
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");
  if (signature !== expected) {
    res.status(400).send("Invalid signature");
    return;
  }

  const event = req.body?.event;
  const payment = req.body?.payload?.payment?.entity;
  if (payment?.order_id) {
    const status = event === "payment.captured" ? "Paid"
                 : event === "payment.failed" ? "Failed" : null;
    if (status) {
      await db.collection("payments").doc(payment.order_id).set(
        {
          paymentId: payment.id,
          amount: payment.amount,
          status: status.toLowerCase(),
          webhookAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      // Reconcile any order already written with this razorpay order id
      const orders = await db.collection("orders")
        .where("razorpayOrderId", "==", payment.order_id)
        .limit(1).get();
      if (!orders.empty) {
        await orders.docs[0].ref.update({ paymentStatus: status });
      }
    }
  }
  res.json({ ok: true });
});
