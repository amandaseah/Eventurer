import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// load stripe with your publishable key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// simple wrapper that mounts Stripe Elements and shows the inner form
export default function StripePaymentFormWrapper({ amount = 1000, onSuccess }: { amount?: number, onSuccess?: () => void }) {
  // amount in cents (e.g., 1000 = 10.00 SGD)
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}

// the actual form that renders CardElement and confirms the payment
function CheckoutForm({ amount, onSuccess }: { amount: number, onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // called when user submits the payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!stripe || !elements) {
      setErrorMsg("Stripe has not loaded yet. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      // ask your serverless endpoint to create a PaymentIntent
      const resp = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // pass the amount in cents
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to create PaymentIntent");

      const clientSecret = data.clientSecret;
      // confirm the payment on the client with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!, // the CardElement we mounted
          // Optional billing details:
          billing_details: {
            // name: 'Customer Name', email can be added if you collect it.
          },
        },
      });

      if (result.error) {
        // payment failed — show error to user
        setErrorMsg(result.error.message || "Payment failed");
      } else {
        // payment succeeded
        if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg("Payment did not complete. Please check your card details.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <label className="block mb-2">Card details</label>
      <div className="p-3 border rounded mb-4">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing…" : `Pay ${(amount/100).toFixed(2)} SGD`}
      </button>
    </form>
  );
}
