import { motion } from "motion/react";
import { EventCard } from "../../features/event/EventCard";

export default function EventsGrid({
  events,
  onEventClick,
  bookmarkedEventIds = [],
  rsvpedEventIds = [],
  onBookmarkChange,
  onRSVPChange,
}: {
  events: any[];
  onEventClick: (id: number) => void;
  bookmarkedEventIds?: number[];
  rsvpedEventIds?: number[];
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
  onRSVPChange?: (id: number, rsvped: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {events.map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <EventCard
            event={event}
            onEventClick={onEventClick}
            isBookmarkedInitially={bookmarkedEventIds.includes(event.id)}
            isRSVPedInitially={rsvpedEventIds.includes(event.id)}
            onBookmarkChange={onBookmarkChange}
            onRSVPChange={onRSVPChange}
          />
        </motion.div>
      ))}
    </div>
  );
}