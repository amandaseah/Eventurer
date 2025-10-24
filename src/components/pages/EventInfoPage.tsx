import HowToGetThere from "../features/map/HowToGetThere";
import TopForumPreview from "../features/forum/TopForumPreview";
import EventActions from "../features/eventInfo/EventActions";
import EventDetails from "../features/eventInfo/EventDetails";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "../Header";
// import { events, forumPosts } from "../../lib/mockData";
import { forumPosts } from '../../lib/mockData';
import Image from "../common/Image";
import {
  Calendar,
  MapPin,
  Users,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { formatDateToDDMMYYYY } from "../../lib/dateUtils";

interface EventInfoPageProps {
  eventId: number;
  events: any[];
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (
    eventId: number,
    isBookmarked: boolean,
  ) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
}

export function EventInfoPage({
  eventId,
  events,
  onNavigate,
  onGoBack,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: EventInfoPageProps) {
  const event = events.find((e) => String(e.id) === String(eventId));
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarkedEventIds.includes(eventId),
  );
  const [isRSVPed, setIsRSVPed] = useState(
    rsvpedEventIds.includes(eventId),
  );
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [saves, setSaves] = useState(event?.saves || 0);

  if (!event) {
    return <div>Event not found</div>;
  }

  // const eventForumPosts = forumPosts
  //   .filter((p) => p.eventId === eventId)
  //   .slice(0, 3);

  const eventForumPosts: any[] = [];

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    onBookmarkChange(eventId, newBookmarked);
  };

  const handleRSVP = () => {
    setShowRSVPDialog(true);
  };

  const confirmRSVP = () => {
    const isFree =
      event.price === "Free" || event.price === "$0";
    const newRSVPStatus = !isRSVPed;

    setIsRSVPed(newRSVPStatus);
    setShowRSVPDialog(false);
    onRSVPChange(eventId, newRSVPStatus);

    if (newRSVPStatus) {
      // Confirming RSVP
      if (isFree) {
        toast.success("RSVP confirmed! See you at the event!");
      } else {
        toast.success(
          "RSVP confirmed! A confirmation email with payment details has been sent to you.",
        );
      }
    } else {
      // Cancelling RSVP
      if (isFree) {
        toast.success("RSVP cancelled successfully.");
      } else {
        toast.success(
          "RSVP cancelled. A cancellation email has been sent to you.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Back Button - Fixed */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={onGoBack}
          className="fixed top-24 left-6 z-50 flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        {/* Event Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8 h-96"
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl mb-2"
            >
              {event.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg opacity-90"
            >
              Organized by {event.organizer}
            </motion.p>
          </div>
        </motion.div>

        {/* Event Details + Forum + Map + Sidebar */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: details + forum preview + map */}
            <div className="lg:col-span-2">
              {/* Event Details */}
              <EventDetails event={event} saves={saves} />

              {/* Top Forum Posts Preview */}
              <TopForumPreview
                posts={eventForumPosts}
                onViewAll={() => onNavigate('event-forum', { eventId })}
              />

              {/* How to Get There */}
              <HowToGetThere event={event} />
            </div>

            {/* RIGHT: sidebar (separate column) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-1"
            >
              {/* was: className="sticky top-24 space-y-4" */}
              <div className="space-y-4 lg:sticky lg:top-24">
                <EventActions
                  event={event}
                  isRSVPed={isRSVPed}
                  isBookmarked={isBookmarked}
                  price={event.price}
                  onConfirmRSVP={confirmRSVP}
                  onToggleBookmark={handleBookmark}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('event-forum', { eventId })}
                  className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span>Join Discussion</span>
                </motion.button>
              </div>
            </motion.div>
            </div>          
          
        </div>
      </div>
   
  );
}