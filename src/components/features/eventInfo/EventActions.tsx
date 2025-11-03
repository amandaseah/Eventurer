// src/features/eventInfo/EventActions.tsx
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog"; // changed from "@/components/ui/alert-dialog"
import { Bookmark } from "lucide-react";
import { formatDateToDDMMYYYY } from "../../../lib/dateUtils"; // changed from "@/lib/dateUtils"
import { useState } from "react";
import StripePaymentFormWrapper from "../payments/StripePaymentFormWrapper";

type EventShape = {
  title: string;
  deadline?: string;
  isPast?: boolean;
};

export default function EventActions({
  isRSVPed,
  isBookmarked,
  price,
  event,                // ✅ accept event prop
  onConfirmRSVP,
  onToggleBookmark,
  openDialog,
  setOpenDialog,
}: {
  isRSVPed: boolean;
  isBookmarked: boolean;
  price: string;
  event: EventShape;     // ✅ typed (only the fields we need)
  onConfirmRSVP: () => void;
  onToggleBookmark: () => void;
  openDialog?: boolean;
  setOpenDialog?: (v: boolean) => void;
}) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // clean numeric price and safely convert to cents
const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ""));
const amountInCents = isNaN(numericPrice) ? 0 : Math.round(numericPrice * 100);

  return (
  <>
    <div className="bg-white rounded-3xl p-6 shadow-md">
      {/* Price and deadline block */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          {price}
        </div>

        {event?.deadline && !event?.isPast && (
          <p className="text-sm text-orange-600">
            Sign-up by {formatDateToDDMMYYYY(event.deadline)}
          </p>
        )}
      </div>

      {/* RSVP button + dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl mb-4 transition-all flex items-center justify-center font-semibold ${
              isRSVPed
                ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                : "bg-pink-200 text-pink-600 hover:bg-pink-300 border border-pink-300 shadow-sm hover:shadow-md"
            }`}
          >
            {isRSVPed ? "✓ RSVP'd" : "RSVP to Event"}
          </motion.button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRSVPed ? "Cancel RSVP" : "Confirm RSVP"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {/* optional: dynamic price/free message */}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ""));
                  const isPaidEvent = !isNaN(numericPrice) && numericPrice > 0;

                  setOpenDialog?.(false);

                  if (isRSVPed) {
                    // if already RSVP'ed, user is canceling
                    onConfirmRSVP(); 
                  } else {
                    // if not RSVP'ed yet, user is confirming RSVP
                    if (isPaidEvent) {
                      // Only open payment modal for paid events
                      setTimeout(() => setShowPaymentModal(true), 50);
                    } else {
                      // free event, just confirm directly
                      onConfirmRSVP();
                    }
                  }
                }}
                className="bg-pink-200 text-pink-600 hover:bg-pink-300 focus:ring-pink-200 focus:ring-offset-2 w-full py-2 rounded-md"
              >
                {isRSVPed ? "Cancel RSVP" : "Confirm RSVP"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggleBookmark}
        className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
          isBookmarked
            ? "bg-pink-100 text-pink-500 border-2 border-pink-200"
            : "border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
        }`}
      >
        <Bookmark className="w-5 h-5" />
        {isBookmarked ? "Saved" : "Save for Later"}
      </motion.button>
    </div>

    {/* Payment modal lives OUTSIDE the main card */}
    {showPaymentModal && (
      <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Pay now to confirm your RSVP for this event.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <StripePaymentFormWrapper
            amount={amountInCents}  // make sure amountInCents is computed above
            onSuccess={() => {
              setShowPaymentModal(false);
              setIsPaid(true);
              onConfirmRSVP();
            }}
          />

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPaymentModal(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}
  </>
);
}
