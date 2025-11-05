import { useEffect, useState, useRef, useMemo } from "react";
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

<<<<<<< HEAD
export function EventInfoPage({eventId, onNavigate, onGoBack, bookmarkedEventIds, rsvpedEventIds, onBookmarkChange, onRSVPChange, username}: EventInfoPageProps) {
  
  //console.log("EventInfoPage loaded with username:", username);
  
  const event = events.find((e) => e.id === eventId);
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarkedEventIds.includes(eventId)
  );
  const [isRSVPed, setIsRSVPed] = useState(rsvpedEventIds.includes(eventId));
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [saves, setSaves] = useState(event?.saves || 0);

  const { posts, addPost, upvotePost } = useEventForum(eventId); // fetch all posts
=======
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
  // Resolve username: prefer prop, fall back to session/local storage, then 'Guest'
  const resolvedUsername =
    username ||
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("username")) ||
    (typeof localStorage !== "undefined" && localStorage.getItem("username")) ||
    "Guest";

  useEffect(() => {
    console.log("[EventInfoPage] resolved username:", resolvedUsername);
  }, [resolvedUsername]);
>>>>>>> dev

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local states
  const [isBookmarked, setIsBookmarked] = useState(bookmarkedEventIds.includes(Number(eventId)));
  const [isRSVPed, setIsRSVPed] = useState(rsvpedEventIds.includes(Number(eventId)));
  const [saves, setSaves] = useState(0);

  // Forum data
  const { posts, addPost, upvotePost } = useEventForum(Number(eventId));

  useEffect(() => {
    console.log('Posts from useEventForum:', posts);
    console.log('Posts length:', posts.length);
    console.log('Posts data:', posts.map(p => ({
      id: p.id,
      text: p.text?.substring(0, 20),
      timestamp: p.createdAt,
      hasImage: !!p.image
    })));
  }, [posts]);
  
  // Fetch event details
  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);

        let eventData: any = null;

        // If parent already passed in events, use them
        if (events && events.length > 0) {
          eventData = events.find((e) => String(e.id) === String(eventId));

          // If not found in provided events, fetch from Eventbrite
          if (!eventData) {
            console.log('[EventInfoPage] Event not in props, fetching from Eventbrite...');
            const allEvents = await fetchEventbriteEventsForMe();
            eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
          }
        } else {
          // No events provided, fetch from Eventbrite directly
          console.log('[EventInfoPage] No events in props, fetching from Eventbrite...');
          const allEvents = await fetchEventbriteEventsForMe();
          eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
        }

        if (!isMounted) return;

        if (!eventData) {
          setError("Event not found");
          setEvent(null);
        } else {
          setEvent(eventData);
          setSaves(eventData.saves || 0);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        if (isMounted) {
          setError("Failed to load event details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white flex flex-col">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl text-gray-700 font-medium">Loading event details...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white flex flex-col">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md my-auto"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Event Not Found</h2>
            <p className="text-gray-600 mb-12">
              {error || "The event you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('explore')}
                className="bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-pink-600 transition-all"
              >
                Explore Events
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGoBack}
                className="bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                Go Back
              </motion.button>
            </div>
          </motion.div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

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

  console.log('Preview posts being passed:', posts.map(p => ({
    id: p.id,
    timestamp: p.createdAt,
    hasTimestamp: !!p.createdAt,
    timestampType: typeof p.createdAt
  })));

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
        <BackButton onClick={onGoBack} />

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

<<<<<<< HEAD
            {/* Top 3 Forum Posts */}
            <div>
              <TopForumPreview
                posts={posts.slice(0, 3)}
                onViewAll={() => onNavigate("event-forum", { eventId, username })}
                onPostClick={(postId) => onNavigate("event-forum", { eventId, postId, username })}
                upvotePost={(postId) => upvotePost(postId, username)} 
                username={username}
              />
            </div>
=======
            <TopForumPreview
              posts={posts.slice(0, 3)}
              onViewAll={() => onNavigate("event-forum", { eventId, username: resolvedUsername })}
              onPostClick={(postId) => onNavigate("event-forum", { eventId, postId, username: resolvedUsername })}
              upvotePost={(postId) => upvotePost(postId, resolvedUsername)}
              username={resolvedUsername}
            />
>>>>>>> dev

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
<<<<<<< HEAD
              onClick={() => onNavigate("event-forum", { eventId, username })}
=======
              onClick={() => {
                console.log("Navigating to forum with:", eventId, resolvedUsername);
                onNavigate("event-forum", { eventId, username: resolvedUsername });
              }}
>>>>>>> dev
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