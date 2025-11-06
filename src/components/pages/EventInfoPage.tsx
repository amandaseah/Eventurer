import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Header } from "../Header";
import Image from "../common/Image";
import { MessageSquare } from "lucide-react";
import { BackButton } from "../shared/BackButton";
import HowToGetThere from "../features/map/HowToGetThere";
import TopForumPreview from "../features/forum/TopForumPreview";
import EventActions from "../features/eventInfo/EventActions";
import EventDetails from "../features/eventInfo/EventDetails";
import { fetchEventbriteEventsForMe } from "../../lib/eventbriteService";
import { useEventForum } from "../../hooks/useEventForum";
import Footer from "../shared/Footer";
import { toast } from "sonner";
import type { Event as AppEvent } from "../../types/event";

// props interface defining all required data and callbacks for the event info page
interface EventInfoPageProps {
  eventId: string | number;
  events?: AppEvent[];
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
  username: string;
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
  username,
}: EventInfoPageProps) {
  const resolvedUsername =
    username ||
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("username")) ||
    (typeof localStorage !== "undefined" && localStorage.getItem("username")) ||
    "Guest";

  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // local state for bookmark and RSVP status, initialized from parent's arrays
  const [isBookmarked, setIsBookmarked] = useState(bookmarkedEventIds.includes(Number(eventId)));
  const [isRSVPed, setIsRSVPed] = useState(rsvpedEventIds.includes(Number(eventId)));
  const [saves, setSaves] = useState(0);

  // this controls the Confirm RSVP dialog inside EventActions
  const [openDialog, setOpenDialog] = useState(false);

  // hook to fetch forum posts and provide upvote functionality
  const { posts, upvotePost } = useEventForum(Number(eventId));

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);

        let eventData = events?.find((e) => String(e.id) === String(eventId));

        // if not found in props, fetch from Eventbrite API
        if (!eventData) {
          const allEvents = await fetchEventbriteEventsForMe();
          eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
        }

        // handle event not found scenario
        if (!eventData) {
          setError("Event not found");
        } else {
          setEvent(eventData);
          setSaves(eventData.saves ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Event not found"}
      </div>
    );
  }

  // toggle bookmark status and update saves count accordingly
  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    onBookmarkChange(Number(eventId), newBookmarked);
  };

  // payment logic is handled INSIDE EventActions
  const confirmRSVP = () => {
    if (isRSVPed) {
      setIsRSVPed(false);
      onRSVPChange(Number(eventId), false);
      toast.success("RSVP cancelled successfully.");
    } else {
      setIsRSVPed(true);
      onRSVPChange(Number(eventId), true);
      toast.success("RSVP confirmed! See you at the event!");
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl">
        <BackButton onClick={onGoBack} />

        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 h-64 sm:h-96"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Image src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white pr-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl">{event.title}</h1>
            <p className="text-sm sm:text-lg opacity-90">Organized by {event.organizer}</p>
          </div>
        </motion.div>

        {/* Two-column layout: main content (left) and sidebar (right) */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EventDetails event={event} saves={saves} />

            {/* Preview of top 3 forum posts */}
            <TopForumPreview
              posts={posts.slice(0, 3)}
              onViewAll={() => onNavigate("event-forum", { eventId, username: resolvedUsername })}
              onPostClick={(postId) => onNavigate("event-forum", { eventId, postId, username: resolvedUsername })}
              upvotePost={(postId) => upvotePost(postId, resolvedUsername)}
              username={resolvedUsername}
            />

            {/* Map and directions component */}
            <HowToGetThere event={event} />
          </div>

          {/* Sidebar column with sticky positioning on larger screens */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Primary action buttons (RSVP, bookmark) with payment handling */}
            <EventActions
              event={event}
              isRSVPed={isRSVPed}
              isBookmarked={isBookmarked}
              price={event.price}
              onConfirmRSVP={confirmRSVP}
              onToggleBookmark={handleBookmark}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />

            {/* Secondary action button to navigate to full forum */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("event-forum", { eventId, username: resolvedUsername })}
              className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-pink-500" />
              <span>Join Discussion</span>
            </motion.button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
