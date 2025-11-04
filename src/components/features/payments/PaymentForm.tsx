import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { auth } from "../../../lib/firebase"; // to call user details in the payment invoice
import { onAuthStateChanged } from "firebase/auth";

// load stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// wrapper that mounts Stripe Elements and shows the inner form
export default function StripePaymentFormWrapper({
    amount = 1000,
    onSuccess,
    eventTitle,
    }: { 
        amount?: number;
        onSuccess?: () => void;
        eventTitle?: string;
     }) {
  // amount in cents (e.g., 1000 = 10.00 SGD)
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} eventTitle={eventTitle}/>
    </Elements>
  );
}

// the actual form that renders CardElement and confirms the payment
function CheckoutForm({
    amount,
    onSuccess,
    eventTitle 
    }: { 
        amount: number;
        onSuccess?: () => void;
        eventTitle?: string;
    }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");        // for receipt
    const [payerName, setPayerName] = useState<string>(""); // include user's name
   // prefill user info from firebase
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
        setEmail(user.email || "");              // auto-fill email
        setPayerName(user.displayName || "");    // auto-fill name if available
        }
    });
    return () => unsubscribe();
    }, []);

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
        body: JSON.stringify({
            amount,
            description: eventTitle ?? "Eventbrite Event",
            receipt_email: email || undefined,
            metadata: {
                eventTitle: eventTitle ?? "Eventbrite Event",
                userName: payerName || "Guest User",
            },
         }), // pass the amount in cents
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to create PaymentIntent");

      const clientSecret = data.clientSecret;
      // confirm the payment on the client with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!, // the CardElement mounted
          // billing details
          billing_details: {
            // displays customer name and email!
            name: payerName || undefined,
            email: email || undefined,
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
  <form onSubmit={handleSubmit} className="p-4 sm:p-5 w-full max-w-md mx-auto space-y-4"> {/* UPDATED container */}
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Review &amp; Pay</h3>
      <div className="text-sm sm:text-base text-gray-700">
        <div className="flex items-start justify-between gap-3">
          <span className="font-medium">Event</span>
          <span className="text-right break-words">{eventTitle ?? "Eventurer Event"}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-semibold">
            {(amount / 100).toFixed(2)} SGD
          </span>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Name (optional)</label>
        <input
          type="text"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Email for receipt (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          placeholder="you@example.com"
        />
      </div>
    </div>

    <label className="block text-sm text-gray-700">Card details</label>
    <div className="p-3 border rounded-md mb-1">
      <CardElement options={{ hidePostalCode: true }} />
    </div>
    {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

    <button
      type="submit"
      disabled={!stripe || loading}
      className="w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 disabled:opacity-60"
    >
      {loading ? "Processing…" : `Pay ${(amount / 100).toFixed(2)} SGD`}
    </button>
  </form>
);
}
