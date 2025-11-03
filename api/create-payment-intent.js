// api/create-payment-intent.js
require('dotenv').config({ path: '.env.local' }); // install dotenv so this auto reads .env.local file

console.log("Loaded Stripe key:", process.env.STRIPE_SECRET_KEY ? "✅ Found" : "❌ Missing");

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { amount = 1000, currency = "sgd", description = "Eventurer purchase" } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}

// ✅ Export for Vercel serverless usage
module.exports = handler;

// ✅ Local dev mode: spin up lightweight Express app automatically
if (require.main === module) {
  const app = express();
  app.use(express.json());
  app.post("/api/create-payment-intent", handler);

  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => {
    console.log(`🚀 Local Stripe API running on http://localhost:${PORT}/api/create-payment-intent`);
  });
}
