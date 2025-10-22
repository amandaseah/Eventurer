import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { events as allEvents } from "../../../lib/mockData";               // no alias
import { EventCard } from "../event/EventCard";                  // no alias

type Props = {
  events: any[] // receive events from parent
  mood?: string;                                                         // "chill" | "active" | "social" | etc
  limit?: number;                                                        // how many to show (default 4)
  title?: string;                                                        // heading text
  onSelect: (eventId: number) => void;                                   // navigate callback
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
};

export default function RecommendationPanel({
  events,
  mood,
  limit = 4,
  title = "Recommended Events (based on your mood)",
  onSelect,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: Props) {
  // pick recommended events
  const recommended = useMemo(() => {
    const pool = events.filter(e => !e.isPast);
    const byMood = mood ? pool.filter(e => e.mood === mood) : pool;
    return byMood.slice(0, limit);
  }, [events, mood, limit]);

  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(p => (p === recommended.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent(p => (p === 0 ? recommended.length - 1 : p - 1));

  if (recommended.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl mb-6 text-center">{title}</h2>

      <div className="relative max-w-2xl mx-auto">
        <div className="overflow-hidden rounded-3xl">
          <motion.div
            animate={{ x: `-${current * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex"
          >
            {recommended.map((event) => (
              <div key={event.id} className="min-w-full px-4">
                <EventCard
                  event={event}
                  onEventClick={(id) => onSelect(id)}
                  isBookmarkedInitially={bookmarkedEventIds.includes(event.id)}
                  isRSVPedInitially={rsvpedEventIds.includes(event.id)}
                  onBookmarkChange={onBookmarkChange}
                  onRSVPChange={onRSVPChange}
                  centerText={true}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* arrows */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 hover:bg-white"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </motion.button>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-6">
          {recommended.map((_, idx) => (
            <motion.div
              key={idx}
              onClick={() => setCurrent(idx)}
              animate={{
                scale: idx === current ? 1.2 : 1,
                backgroundColor: idx === current ? "#a78bfa" : "#e5e7eb",
              }}
              className="w-3 h-3 rounded-full cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}