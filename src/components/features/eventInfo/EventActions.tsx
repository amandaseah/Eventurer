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
  return (
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
            <AlertDialogAction
              onClick={onConfirmRSVP}
              className="bg-pink-200 text-pink-600 hover:bg-pink-300 focus:ring-pink-200 focus:ring-offset-2"
            >
              {isRSVPed ? "Cancel RSVP" : "Confirm RSVP"}
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
  );
}
