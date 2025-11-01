import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Header } from "../Header";
import Image from "../common/Image";
import { ArrowLeft, MessageSquare } from "lucide-react";
import HowToGetThere from "../features/map/HowToGetThere";
import TopForumPreview from "../features/forum/TopForumPreview";
import EventActions from "../features/eventInfo/EventActions";
import EventDetails from "../features/eventInfo/EventDetails";
import { fetchEventbriteEvents } from "../../lib/eventbriteService";
import { useEventForum } from "../../hooks/useEventForum";
import Footer from "../shared/Footer";
import { toast } from "sonner";

interface EventInfoPageProps {
  eventId: string | number;
  events?: any[];
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

  //console.log("EventInfoPage loaded with username:", username);

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local states
  const [isBookmarked, setIsBookmarked] = useState(bookmarkedEventIds.includes(Number(eventId)));
  const [isRSVPed, setIsRSVPed] = useState(rsvpedEventIds.includes(Number(eventId)));
  const [saves, setSaves] = useState(0);

  // Forum data
  const { posts, addPost, upvotePost } = useEventForum(Number(eventId));

  // Fetch event details
  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);

        let eventData: any = null;

        // If parent already passed in events, use them
        if (events && events.length > 0) {
          eventData = events.find((e) => String(e.id) === String(eventId));
        }

        // Otherwise, fetch from Eventbrite
        if (!eventData) {
          const allEvents = await fetchEventbriteEvents();
          eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
        }

        if (!eventData) {
          setError("Event not found");
          setEvent(null);
        } else {
          setEvent(eventData);
          setSaves(eventData.saves || 0);
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

  // Loading / Error states
  if (loading) return <div className="p-8 text-center">Loading event details...</div>;
  if (error || !event) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Handlers
  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    onBookmarkChange(Number(eventId), newBookmarked);
  };

  const confirmRSVP = () => {
    const isFree = event.price === "Free" || event.price === "$0";
    const newRSVPStatus = !isRSVPed;
    setIsRSVPed(newRSVPStatus);
    onRSVPChange(Number(eventId), newRSVPStatus);
    if (newRSVPStatus) {
      if (isFree) {
        toast.success("RSVP confirmed! See you at the event.");
      } else {
        toast.success("RSVP confirmed! A confirmation email with payment details is on the way.");
      }
    } else {
      if (isFree) {
        toast.success("RSVP cancelled.");
      } else {
        toast.success("RSVP cancelled. We've sent a confirmation email.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @media (max-width: 639px) {
          .event-info-page {
            font-size: 14px;
          }
        }
      `}</style>
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl event-info-page">
        {/* Back Button - Sticky */}
        <motion.button
          onClick={onGoBack}
          whileHover={{ x: -4 }}
        className="sticky top-[84px] sm:top-[96px] z-40 mb-4 flex items-center gap-2 text-pink-500 hover:text-pink-600 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-md text-sm sm:text-base w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Back</span>
      </motion.button>

        {/* Event Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8 h-64 sm:h-96"
        >
          <Image src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white pr-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl mb-1 sm:mb-2 break-words">{event.title}</h1>
            <p className="text-sm sm:text-lg opacity-90">Organized by {event.organizer}</p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EventDetails event={event} saves={saves} />

            <TopForumPreview
              posts={posts.slice(0, 3)}
              onViewAll={() => onNavigate("event-forum", { eventId, username })}
              onPostClick={(postId) => onNavigate("event-forum", { eventId, postId, username })}
              upvotePost={(postId) => upvotePost(postId, username)}
              username={username}
            />

            <HowToGetThere event={event} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
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
              onClick={() => onNavigate("event-forum", { eventId })}
              className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-pink-500" />
              <span>Join Discussion</span>
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
