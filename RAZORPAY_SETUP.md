# Razorpay Setup — OUTFIT

The payment backend is in `functions/`. Your keys go in ONE file: `functions/.env`.
They are never in the React bundle — the browser gets only the public key id at runtime.

## 1. Fill in your keys

Open `functions/.env` and paste your NEW keys (Dashboard → Account & Settings → API Keys):

```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=            ← leave empty for now (optional, see step 4)
```

## 2. Deploy the functions (one time, ~3 minutes)

From the `OUTFIT-customer-side` folder:

```bash
npm install -g firebase-tools     # skip if already installed
firebase login
cd functions && npm install && cd ..
firebase deploy --only functions
```

You should see `createRazorpayOrder`, `verifyPayment`, and `razorpayWebhook`
deployed to region **asia-south1**. That's it — the site is now live-payment ready.

## 3. Test it

- Run the customer site (`npm run dev`), add a product, checkout.
- Choose **UPI** → the Razorpay sheet opens with the exact cart total already
  filled in (the amount is computed on the server from Firestore prices, so it
  can't be tampered with in the browser).
- Choose **Cash on Delivery** → no gateway, order goes straight in as `COD`.
- After a successful payment the order appears in the admin panel with
  `Payment: UPI · Paid` and the Razorpay payment id.

⚠️ These are LIVE keys — a test payment moves real money. Pay yourself ₹1–₹10
by temporarily setting a product's price low, then refund from the Razorpay
dashboard.

## 4. (Recommended, optional) Webhook backup

Covers the edge case where a customer pays but closes the browser before the
site records it.

1. Firebase printed a URL for `razorpayWebhook` during deploy, like:
   `https://asia-south1-outfit-ba0ea.cloudfunctions.net/razorpayWebhook`
2. Razorpay Dashboard → Settings → Webhooks → Add: paste that URL,
   choose events `payment.captured` and `payment.failed`,
   and type any strong random string as the webhook secret.
3. Put that same string in `functions/.env` as `RAZORPAY_WEBHOOK_SECRET`
   and run `firebase deploy --only functions` again.

## Troubleshooting

- **"Razorpay keys are not configured"** → `.env` not filled or not deployed after filling.
- **CORS / internal error on pay** → make sure you are on the Blaze plan and the
  deploy said region `asia-south1`.
- **Payment succeeded but order missing** → check Firestore `payments` collection;
  the webhook (step 4) auto-reconciles these.
