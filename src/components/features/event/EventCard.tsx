import { Calendar, MapPin, Bookmark, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from '../../common/Image';
import { useState, useEffect } from 'react';
import { formatDateToDDMMYYYY } from '../../../lib/dateUtils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { toast } from 'sonner';

interface EventCardProps {
  event: any;
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

  // Update states when props change
  useEffect(() => {
    setIsBookmarked(isBookmarkedInitially);
  }, [isBookmarkedInitially]);

  useEffect(() => {
    setIsRSVPed(isRSVPedInitially);
  }, [isRSVPedInitially]);

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    if (onBookmarkChange) {
      onBookmarkChange(event.id, newBookmarked);
    }
  };

  const handleRSVP = () => {
    setShowRSVPDialog(true);
  };

  const confirmRSVP = () => {
    const isFree = event.price === 'Free' || event.price === '$0';
    const newRSVPStatus = !isRSVPed;
    
    setIsRSVPed(newRSVPStatus);
    setShowRSVPDialog(false);
    
    if (onRSVPChange) {
      onRSVPChange(event.id, newRSVPStatus);
    }

    if (newRSVPStatus) {
      // Confirming RSVP
      if (isFree) {
        toast.success('RSVP confirmed! See you at the event!');
      } else {
        toast.success('RSVP confirmed! A confirmation email with payment details has been sent to you.');
      }
    } else {
      // Cancelling RSVP
      if (isFree) {
        toast.success('RSVP cancelled successfully.');
      } else {
        toast.success('RSVP cancelled. A cancellation email has been sent to you.');
      }
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
      className="bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer group relative transition-all border border-white/50"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
      }}
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

      <div className="relative overflow-hidden h-48" onClick={() => onEventClick(event.id)}>
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

        {/* Bookmark button */}
        <div className="absolute top-3 right-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isBookmarked ? 'bg-pink-400 text-white' : 'bg-white/95 text-gray-700 hover:bg-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs font-semibold">{saves}</span>
          </motion.button>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
            <span className="text-sm font-bold text-pink-500">{event.price}</span>
          </div>
        </div>
      </div>

      <div className={`p-5 ${centerText ? 'text-center' : ''}`} onClick={() => onEventClick(event.id)}>
        <h3 className="mb-2 line-clamp-1 font-semibold text-lg text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${centerText ? 'justify-center' : ''}`}>
            <Calendar className="w-4 h-4 text-pink-500" />
            <span>{formatDateToDDMMYYYY(event.date)} at {event.time}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${centerText ? 'justify-center' : ''}`}>
            <MapPin className="w-4 h-4 text-pink-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {isClosingSoon() && !event.isPast && (
            <div className={`flex items-center gap-2 text-sm ${centerText ? 'justify-center' : ''}`}>
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-orange-600">Closing soon!</span>
            </div>
          )}
        </div>

        {/* Show user comment for past events or RSVP button for upcoming events */}
        {event.isPast && event.userComment ? (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
            <p className="text-xs text-pink-600 mb-1">Your comment:</p>
            <p className="text-sm text-gray-700 italic">&quot;{event.userComment}&quot;</p>
          </div>
        ) : !event.isPast ? (
          <AlertDialog open={showRSVPDialog} onOpenChange={setShowRSVPDialog}>
            <AlertDialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`w-full py-3 rounded-xl transition-all flex items-center justify-center font-semibold ${
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
                  onClick={confirmRSVP}
                  className="bg-pink-200 text-pink-600 hover:bg-pink-300 focus:ring-pink-200 focus:ring-offset-2"
                >
                  {isRSVPed ? 'Cancel RSVP' : 'Confirm RSVP'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </motion.div>
  );
}
