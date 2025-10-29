import HowToGetThere from "../features/map/HowToGetThere";
import TopForumPreview from "../features/forum/TopForumPreview";
import EventActions from "../features/eventInfo/EventActions";
import EventDetails from "../features/eventInfo/EventDetails";

import { useEventForum } from "../../hooks/useEventForum";
import { useState } from "react";
import { motion } from "motion/react";
import { Header } from "../Header";
import Image from "../common/Image";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface EventInfoPageProps {
  eventId: number;
  events: any[];
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
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
    bookmarkedEventIds.includes(eventId)
  );
  const [isRSVPed, setIsRSVPed] = useState(rsvpedEventIds.includes(eventId));
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [saves, setSaves] = useState(event?.saves || 0);

  const { posts, addPost, upvotePost, username } = useEventForum(eventId); // fetch all posts

  if (!event) return <div>Event not found</div>;

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setSaves(newBookmarked ? saves + 1 : saves - 1);
    onBookmarkChange(eventId, newBookmarked);
  };

  const confirmRSVP = () => {
    const isFree = event.price === "Free" || event.price === "$0";
    const newRSVPStatus = !isRSVPed;
    setIsRSVPed(newRSVPStatus);
    onRSVPChange(eventId, newRSVPStatus);
    if (newRSVPStatus) {
      alert(isFree ? "RSVP confirmed!" : "RSVP confirmed with payment info sent!");
    } else {
      alert(isFree ? "RSVP cancelled." : "RSVP cancelled, email sent.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Back Button */}
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
            <h1 className="text-4xl md:text-5xl mb-2">{event.title}</h1>
            <p className="text-lg opacity-90">Organized by {event.organizer}</p>
          </div>
        </motion.div>

        {/* Event Details + Top Forum Preview + Map */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EventDetails event={event} saves={saves} />

            {/* Top 3 Forum Posts */}
            <div>
              <TopForumPreview
                posts={posts.slice(0, 3)}
                onViewAll={() => onNavigate("event-forum", { eventId })}
                onPostClick={(postId) => onNavigate("event-forum", { eventId, postId })}
                upvotePost={(postId) => upvotePost(postId, username)} 
                username={username}
              />
            </div>

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
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Join Discussion</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}