require("dotenv").config({path: ".env.local"});
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// universal handler (used in both local & vercel)
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { 
      amount = 1000,
      currency = "sgd",
      description = "Eventurer purchase",
      receipt_email,
      metadata = {},
     } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      receipt_email,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}

// export for vercel serverless usage
module.exports = handler;

// local dev mode only
if (require.main === module) {
  // load keys from .env.local if running on localhost
  const app = express();
  app.use(express.json());
  app.post("/api/create-payment-intent", handler);

  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => {
    console.log(`🚀 Local Stripe API running on http://localhost:${PORT}/api/create-payment-intent`);
  });
}

