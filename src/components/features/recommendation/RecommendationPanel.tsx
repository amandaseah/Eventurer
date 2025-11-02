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
  loading?: boolean;
};

export default function RecommendationPanel({
  events,
  mood,
  limit = 4,
  title = "Recommended Events",
  onSelect,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
  loading = false,
}: Props) {
  // pick recommended events
  const recommended = useMemo(() => {
    // Filter out past events explicitly
    const pool = events.filter(e => e.isPast !== true);
    const byMood = mood ? pool.filter(e => e.mood === mood) : pool;
    return byMood.slice(0, limit);
  }, [events, mood, limit]);

  const [current, setCurrent] = useState(0);
  // if no events yet, don't render
  if (!events || events.length === 0) {
    if (loading) {
      return (
        <section className="mb-12">
          <RecommendationHeader title={title} />
          <div className="max-w-2xl mx-auto">
            <RecommendationCardSkeleton />
          </div>
        </section>
      )
    }
    return null;
  }

  const next = () => setCurrent(p => (p === recommended.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent(p => (p === 0 ? recommended.length - 1 : p - 1));

  if (recommended.length === 0) {
    if (loading) {
      return (
        <section className="mb-12">
          <RecommendationHeader title={title} />
          <div className="max-w-2xl mx-auto">
            <RecommendationCardSkeleton />
          </div>
        </section>
      )
    }
    return null;
  }

  return (
    <section className="mb-12">
      <RecommendationHeader title={title} />

      <div className="relative max-w-2xl mx-auto px-2 sm:px-0">
        <div className="overflow-hidden rounded-3xl">
          {loading ? (
            <RecommendationCardSkeleton />
          ) : (
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
          )}
        </div>

        {!loading && recommended.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="absolute left-1 sm:-left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg z-10 hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="absolute right-1 sm:-right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg z-10 hover:bg-white"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </motion.button>

            <div className="flex justify-center gap-2 mt-6">
              {recommended.map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  animate={{
                    scale: idx === current ? 1.2 : 1,
                    backgroundColor: idx === current ? "#f472b6" : "#fde2f2",
                  }}
                  className="w-3 h-3 rounded-full cursor-pointer"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function RecommendationHeader({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
        {title}
      </h2>
      <p className="text-[11px] sm:text-sm text-gray-500">
        Curated picks just for you
      </p>
    </motion.div>
  )
}

function RecommendationCardSkeleton() {
  return (
    <div className="min-w-full px-4">
      <div className="h-72 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse flex flex-col">
        <div className="h-40 bg-gray-200 rounded-t-3xl" />
        <div className="p-6 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
