import { Calendar, MapPin, Bookmark, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from '../../common/Image';
import { useState, useEffect } from 'react';
import { formatDateToDDMMYYYY } from '../../../lib/dateUtils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { toast } from 'sonner';
import StripePaymentFormWrapper from "../payments/PaymentForm";
import type { Event as AppEvent } from '../../../types/event';
import { getEventSlots, getSlotStatus } from '../../../lib/eventSlotService';

interface EventCardProps {
  event: AppEvent;
  onEventClick: (id: number) => void;
  isBookmarkedInitially?: boolean;
  isRSVPedInitially?: boolean;
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
  onRSVPChange?: (id: number, rsvped: boolean) => void;
  centerText?: boolean;
}

export function EventCard({ 
  event, 
  onEventClick, 
  isBookmarkedInitially = false, 
  isRSVPedInitially = false,
  onBookmarkChange,
  onRSVPChange,
  centerText = false
}: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);
  const [isRSVPed, setIsRSVPed] = useState(isRSVPedInitially);
  const [showRSVPPopup, setShowRSVPPopup] = useState(false);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [saves, setSaves] = useState(event.saves || 0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [availableSlots, setAvailableSlots] = useState<number | undefined>(undefined);
  const [totalSlots, setTotalSlots] = useState<number | undefined>(undefined);

  // Update states when props change
  useEffect(() => {
    setIsBookmarked(isBookmarkedInitially);
    setIsRSVPed(isRSVPedInitially);
  }, [isBookmarkedInitially, isRSVPedInitially]);

  // Load slot data
  useEffect(() => {
    const loadSlotData = async () => {
      const slotData = await getEventSlots(event.id);
      if (slotData) {
        setAvailableSlots(slotData.availableSlots);
        setTotalSlots(slotData.totalSlots);
      }
    };
    loadSlotData();
  }, [event.id]);

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    // TODO: Sync bookmark state with backend API
    if (onBookmarkChange) {
      onBookmarkChange(event.id, newBookmarked);
    }
  };

  const handleRSVP = () => {
    setShowRSVPDialog(true);
  };

const confirmRSVP = () => {
  const isFree = event.price === 'Free' || event.price === '$0';
  const numericPrice = parseFloat(String(event.price).replace(/[^0-9.]/g, ""));
  const isPaidEvent = !isFree && !isNaN(numericPrice) && numericPrice > 0;
  const newRSVPStatus = !isRSVPed;

  setShowRSVPDialog(false);

  if (!newRSVPStatus) {
    // Cancelling RSVP
    setIsRSVPed(false);
    onRSVPChange?.(event.id, false);
    // Update slot count locally
    if (availableSlots !== undefined && totalSlots !== undefined) {
      setAvailableSlots(Math.min(availableSlots + 1, totalSlots));
    }
    toast.success(isFree ? 'RSVP cancelled successfully.' : 'RSVP cancelled. A cancellation email has been sent.');
    return;
  }

  // Check if event is full before allowing RSVP
  if (availableSlots !== undefined && availableSlots === 0) {
    toast.error('Sorry, this event is full!');
    return;
  }

  if (isPaidEvent) {
    // Open stripe payment modal
    setPaymentAmount(Math.round(numericPrice * 100));
    setShowPaymentModal(true);
  } else {
    // Free event so can directly confirm
    setIsRSVPed(true);
    onRSVPChange?.(event.id, true);
    // Update slot count locally
    if (availableSlots !== undefined) {
      setAvailableSlots(Math.max(availableSlots - 1, 0));
    }
    toast.success('RSVP confirmed! See you at the event!');
  }
};

  // Check if deadline is less than 3 days away
  const isClosingSoon = () => {
    if (!event.deadline || event.isPast) return false;
    const today = new Date();
    const deadline = new Date(event.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  // Get mood-based accent color
  const getMoodColor = () => {
    switch(event.mood) {
      case 'chill': return 'border-blue-400 bg-blue-50/30';
      case 'active': return 'border-green-400 bg-green-50/30';
      case 'social': return 'border-pink-400 bg-pink-50/30';
      case 'educational': return 'border-pink-500 bg-pink-50/30';
      default: return 'border-gray-300 bg-gray-50/30';
    }
  };

  const getMoodAccent = () => {
    switch(event.mood) {
      case 'chill': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'social': return 'bg-pink-500';
      case 'educational': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer group relative transition-all border border-gray-200"
    >

      {/* RSVP Popup */}
      <AnimatePresence>
        {showRSVPPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl p-6 border-2 border-green-400"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.1 }}
                className="text-5xl mb-2"
              >
                🎉
              </motion.div>
              <p className="text-xl text-green-700 font-semibold">You're going!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden h-40 sm:h-48" onClick={() => onEventClick(event.id)}>
        <Image
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Past Event Overlay */}
        {event.isPast && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-400">
              <span className="text-sm font-semibold text-gray-200">Past Event</span>
            </div>
          </div>
        )}

        {/* Top badges row */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between">
          {/* Left side badges */}
          <div className="flex items-center gap-1.5">
            {/* Closing Soon badge */}
            {isClosingSoon() && !event.isPast && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-red-500/95 backdrop-blur-md shadow-lg"
              >
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                <span className="text-[10px] sm:text-xs font-bold text-white">Closing Soon</span>
              </motion.div>
            )}

            {/* Slot warning badge */}
            {availableSlots !== undefined && totalSlots !== undefined && !event.isPast && (() => {
              const slotStatus = getSlotStatus(availableSlots, totalSlots);
              if (slotStatus.status === 'available') return null;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full backdrop-blur-md shadow-lg ${
                    slotStatus.status === 'full' ? 'bg-red-600/95' :
                    slotStatus.status === 'almost-full' ? 'bg-red-500/95' :
                    'bg-orange-500/95'
                  }`}
                >
                  <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  <span className="text-[10px] sm:text-xs font-bold text-white">{slotStatus.message}</span>
                </motion.div>
              );
            })()}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bookmark button - right side */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isBookmarked ? 'bg-pink-400 text-white' : 'bg-white/95 text-gray-700 hover:bg-white'
            }`}
          >
            <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-[10px] sm:text-xs font-semibold">{saves}</span>
          </motion.button>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          <div className="bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
            <span className="text-xs sm:text-sm font-bold text-pink-500">{event.price}</span>
          </div>
        </div>
      </div>

      <div className={`p-3 sm:p-5 ${centerText ? 'text-center' : ''}`} onClick={() => onEventClick(event.id)}>
        <h3 className="mb-1.5 sm:mb-2 line-clamp-1 font-semibold text-base sm:text-lg text-gray-900">{event.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 ${centerText ? 'justify-center' : ''}`}>
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            <span>{formatDateToDDMMYYYY(event.date)} at {event.time}</span>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 ${centerText ? 'justify-center' : ''}`}>
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Show user comment for past events or RSVP button for upcoming events */}
        {event.isPast && (event as any).userComment ? (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
            <p className="text-xs text-pink-600 mb-1">Your comment:</p>
            <p className="text-sm text-gray-700 italic">&quot;{(event as any).userComment}&quot;</p>
          </div>
        ) : !event.isPast ? (
          (() => {
            const isFull = availableSlots !== undefined && availableSlots === 0;

            // If event is full and user hasn't RSVP'd, show disabled button
            if (isFull && !isRSVPed) {
              return (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => e.stopPropagation()}
                  disabled
                  className="w-full py-2 sm:py-3 rounded-xl transition-all flex items-center justify-center text-sm sm:text-base font-semibold bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Event Full
                  </span>
                </motion.button>
              );
            }

            return (
              <AlertDialog open={showRSVPDialog} onOpenChange={setShowRSVPDialog}>
                <AlertDialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`w-full py-2 sm:py-3 rounded-xl transition-all flex items-center justify-center text-sm sm:text-base font-semibold ${
                      isRSVPed
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                        : 'bg-pink-200 text-pink-600 border border-pink-300 hover:bg-pink-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isRSVPed ? '✓ RSVP\'d' : 'RSVP'}
                    </span>
                  </motion.button>
                </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isRSVPed ? 'Cancel RSVP' : 'Confirm RSVP'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isRSVPed 
                    ? `Are you sure you want to cancel your RSVP for "${event.title}"?`
                    : `Are you sure you want to RSVP for "${event.title}"?`
                  }
                  {!isRSVPed && event.price !== 'Free' && event.price !== '$0' && (
                    <span className="block mt-2 text-sm font-medium">
                      This is a paid event ({event.price}). Payment details will be sent via email after confirmation.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); confirmRSVP(); }}
                  className="bg-pink-200 text-pink-600 hover:bg-pink-300 focus:ring-pink-200 focus:ring-offset-2"
                >
                  {isRSVPed ? 'Cancel RSVP' : 'Confirm RSVP'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
            );
          })()
        ) : null}
      </div>
      {/* Stripe Payment Modal */}
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
        amount={paymentAmount}
        eventTitle={event.title}
        onSuccess={() => {
          setShowPaymentModal(false);
          setIsRSVPed(true);
          onRSVPChange?.(event.id, true);
          // Update slot count locally
          if (availableSlots !== undefined) {
            setAvailableSlots(Math.max(availableSlots - 1, 0));
          }
          toast.success('Payment successful! You\'re RSVP\'d 🎉');
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
    </motion.div>
  );
}
