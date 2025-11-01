import { motion } from 'motion/react';
import { Calendar, MapPin, Bookmark, DollarSign, Clock } from 'lucide-react';
import { formatDateToDDMMYYYY } from '../../../lib/dateUtils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface EventListItemProps {
  event: any;
  onEventClick: (id: number) => void;
  isBookmarkedInitially?: boolean;
  isRSVPedInitially?: boolean;
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
  onRSVPChange?: (id: number, rsvped: boolean) => void;
}

export function EventListItem({
  event,
  onEventClick,
  isBookmarkedInitially = false,
  isRSVPedInitially = false,
  onBookmarkChange,
  onRSVPChange,
}: EventListItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);
  const [isRSVPed, setIsRSVPed] = useState(isRSVPedInitially);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [saves, setSaves] = useState(event.saves || 0);

  useEffect(() => {
    setIsBookmarked(isBookmarkedInitially);
    setIsRSVPed(isRSVPedInitially);
  }, [isBookmarkedInitially, isRSVPedInitially]);

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    if (onBookmarkChange) {
      onBookmarkChange(event.id, newBookmarked);
    }
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
      if (isFree) {
        toast.success('RSVP confirmed! See you at the event!');
      } else {
        toast.success('RSVP confirmed! A confirmation email with payment details has been sent to you.');
      }
    } else {
      if (isFree) {
        toast.success('RSVP cancelled successfully.');
      } else {
        toast.success('RSVP cancelled. A cancellation email has been sent to you.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 cursor-pointer"
      onClick={() => onEventClick(event.id)}
    >
      <div className="flex flex-row items-center gap-4 p-4">
        {/* Small Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.isPast && (
            <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">Past</span>
            </div>
          )}
        </div>

        {/* Event Name - Prominent */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
            {event.description}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>{formatDateToDDMMYYYY(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-pink-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="truncate max-w-[200px]">{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="w-4 h-4 text-pink-500" />
              <span className="font-semibold text-pink-500">{event.price}</span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              className={`p-2 rounded-full transition-all ${
                isBookmarked
                  ? 'bg-pink-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </motion.button>

            {!event.isPast && (
              <AlertDialog open={showRSVPDialog} onOpenChange={setShowRSVPDialog}>
                <AlertDialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`py-2 px-6 rounded-xl transition-all font-semibold text-sm whitespace-nowrap ${
                      isRSVPed
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-pink-200 text-pink-600 hover:bg-pink-300'
                    }`}
                  >
                    {isRSVPed ? '✓ RSVP\'d' : 'RSVP'}
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
                      className="bg-pink-200 text-pink-600 hover:bg-pink-300 focus:ring-pink-200"
                    >
                      {isRSVPed ? 'Cancel RSVP' : 'Confirm RSVP'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
