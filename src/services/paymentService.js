// ============================================================================
//  paymentService.js — client side of the Razorpay flow
// ----------------------------------------------------------------------------
//  The amount is computed on the SERVER (Cloud Function prices the cart from
//  Firestore), so the UPI/card app automatically shows the correct total.
//  No Razorpay keys live in this bundle — the public key id is returned by
//  the createRazorpayOrder function at runtime.
// ============================================================================
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";

const createOrderFn = httpsCallable(functions, "createRazorpayOrder");
const verifyPaymentFn = httpsCallable(functions, "verifyPayment");

// Load checkout.js once
let scriptPromise = null;
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => { scriptPromise = null; reject(new Error("Could not load Razorpay — check your connection")); };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Full online-payment flow.
 * @param {Object} opts
 * @param {Array}  opts.items      cart items [{id, qty}]
 * @param {string} opts.couponCode applied coupon code or ''
 * @param {Object} opts.customer   { name, email, phone }
 * @param {string} opts.method     'Card' | 'UPI' (preselects the tab)
 * @returns {Promise<{paymentId, razorpayOrderId, amountPaid}>}
 *          resolves on VERIFIED payment; rejects on cancel/failure
 */
export async function payWithRazorpay({ items, couponCode, customer, method }) {
  await loadRazorpay();

  const { data } = await createOrderFn({
    items: items.map((i) => ({ id: i.id, qty: i.qty })),
    couponCode: couponCode || "",
  });

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,        // paise — auto-shown in the UPI app
      currency: data.currency,
      order_id: data.orderId,
      name: "OUTFIT",
      description: "Order payment",
      prefill: {
        name: customer?.name || "",
        email: customer?.email || "",
        contact: customer?.phone || "",
      },
      // Preselect the tab matching what the user chose in checkout
      config: method === "UPI"
        ? { display: { blocks: { upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] } }, sequence: ["block.upi"], preferences: { show_default_blocks: true } } }
        : undefined,
      theme: { color: "#5C4330" },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
      handler: async (resp) => {
        try {
          const { data: v } = await verifyPaymentFn({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
          resolve({
            paymentId: resp.razorpay_payment_id,
            razorpayOrderId: resp.razorpay_order_id,
            amountPaid: v.amountPaid, // paise, server-verified
          });
        } catch (e) {
          reject(new Error("Payment verification failed — contact support with payment id " + resp.razorpay_payment_id));
        }
      },
    });
    rzp.on("payment.failed", (r) => {
      reject(new Error(r?.error?.description || "Payment failed"));
    });
    rzp.open();
  });
}
