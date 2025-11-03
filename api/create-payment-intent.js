// api/create-payment-intent.js
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- Universal handler (used in both local + Vercel) ---
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { amount = 1000, currency = "sgd", description = "Eventurer purchase" } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}

// ✅ Export for Vercel serverless usage
module.exports = handler;

// ✅ Local dev mode only
if (require.main === module) {
  require("dotenv").config({ path: ".env.local" }); // load keys locally
  const app = express();
  app.use(express.json());
  app.post("/api/create-payment-intent", handler);

  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => {
    console.log(`🚀 Local Stripe API running on http://localhost:${PORT}/api/create-payment-intent`);
  });
}
