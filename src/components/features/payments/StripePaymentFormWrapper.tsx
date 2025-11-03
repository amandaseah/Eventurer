// src/features/payments/StripePaymentFormWrapper.tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

// Load your publishable Stripe key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripePaymentFormWrapper({
  amount = 1000,
  onSuccess,
}: {
  amount?: number;
  onSuccess?: () => void;
}) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}

function CheckoutForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!stripe || !elements) {
      setErrorMsg("Stripe has not loaded yet. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Correct endpoint: matches your renamed backend file
      const resp = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to create PaymentIntent");

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess?.();
      } else {
        setErrorMsg("Payment did not complete. Please check your card details.");
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
        {loading ? "Processing…" : `Pay ${(amount / 100).toFixed(2)} SGD`}
      </button>
    </form>
  );
}
