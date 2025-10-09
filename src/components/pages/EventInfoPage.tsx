import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "../Header";
import { events, forumPosts } from "../../lib/mockData";
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
  onNavigate,
  onGoBack,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: EventInfoPageProps) {
  const event = events.find((e) => e.id === eventId);
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

  const eventForumPosts = forumPosts
    .filter((p) => p.eventId === eventId)
    .slice(0, 3);

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

        {/* Event Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-md mb-8"
            >
              <h2 className="text-2xl mb-6">Event Details</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-2xl">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Date & Time
                    </p>
                    <p className="text-lg">
                      {formatDateToDDMMYYYY(event.date)} at{" "}
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Location
                    </p>
                    <p className="text-lg">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Category
                    </p>
                    <p className="text-lg">{event.category}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-xl mb-3">
                  About this event
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Join us for an amazing experience! This event
                  is perfect for anyone looking to{" "}
                  {event.mood === "chill"
                    ? "relax and unwind"
                    : event.mood === "active"
                      ? "get energized and active"
                      : event.mood === "social"
                        ? "meet new people and connect"
                        : "learn something new"}
                  . Don't miss out on this opportunity!
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{saves} people saved this event</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Top Forum Posts Preview */}
            {eventForumPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl p-8 shadow-md mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Top Forum Posts</h2>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onNavigate("event-forum", { eventId })
                    }
                    className="rounded-full"
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {eventForumPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ x: 4 }}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">
                          {post.username}
                        </p>
                        <span className="text-xs text-gray-500">
                          {post.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        {post.comment}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.upvotes} upvotes</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* How to Get There */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <Navigation className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl">How to Get There</h2>
              </div>

              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                  <p>Interactive Map</p>
                  <p className="text-sm">
                    (OneMap API Integration)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">
                    Nearest MRT
                  </p>
                  <p>Downtown MRT (5 min walk)</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">
                    Bus Stops
                  </p>
                  <p>Bus 123, 456 (2 min walk)</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">
                    {event.price}
                  </div>
                  {event.deadline && !event.isPast && (
                    <p className="text-sm text-orange-600">
                      Sign-up by{" "}
                      {formatDateToDDMMYYYY(event.deadline)}
                    </p>
                  )}
                </div>

                {!event.isPast && (
                  <>
                    <AlertDialog
                      open={showRSVPDialog}
                      onOpenChange={setShowRSVPDialog}
                    >
                      <AlertDialogTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-4 rounded-2xl mb-4 transition-all flex items-center justify-center ${
                            isRSVPed
                              ? "bg-green-500 text-white border-2 border-green-600"
                              : "bg-gradient-to-r from-purple-400 to-pink-300 text-white hover:shadow-xl"
                          }`}
                        >
                          <span className="flex items-center justify-center">
                            {isRSVPed
                              ? "✓ RSVP'd"
                              : "RSVP to Event"}
                          </span>
                        </motion.button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {isRSVPed
                              ? "Cancel RSVP"
                              : "Confirm RSVP"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {isRSVPed
                              ? `Are you sure you want to cancel your RSVP for "${event.title}"?`
                              : `Are you sure you want to RSVP for "${event.title}"?`}
                            {!isRSVPed &&
                              event.price !== "Free" &&
                              event.price !== "$0" && (
                                <span className="block mt-2 text-sm font-medium">
                                  This is a paid event (
                                  {event.price}). Payment
                                  details will be sent via email
                                  after confirmation.
                                </span>
                              )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmRSVP}
                          >
                            {isRSVPed
                              ? "Cancel RSVP"
                              : "Confirm RSVP"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookmark}
                      className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                        isBookmarked
                          ? "bg-pink-100 text-pink-700 border-2 border-pink-300"
                          : "border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <Bookmark
                        className="w-5 h-5"
                        fill={
                          isBookmarked ? "currentColor" : "none"
                        }
                      />
                      {isBookmarked
                        ? "Saved"
                        : "Save for Later"}
                    </motion.button>
                  </>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onNavigate("event-forum", { eventId })
                }
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