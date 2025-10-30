import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { formatDateObjectToDDMMYYYY } from '../lib/dateUtils';

interface EventData {
  id: number;
  title: string;
  date?: string;
  imageUrl?: string;
  start?: {
    local?: string;
    utc?: string;
  };
  startDate?: string;
}

interface CountdownWidgetProps {
  bookmarkedEvents: EventData[];
  rsvpedEvents: EventData[];
  fallbackEvents: EventData[];
  onEventClick: (id: number) => void;
}

type EventSource = 'bookmarked' | 'rsvped' | 'general';

interface CountdownEvent extends EventData {
  source: EventSource;
  sources: EventSource[];
  countdownDays: number;
  eventDate: Date;
}

const MAX_DISPLAYED_EVENTS = 5;
const IMAGE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80';

const sourceLabels: Record<EventSource, string> = {
  bookmarked: 'Bookmarked',
  rsvped: "RSVP'd",
  general: '',
};

const sourceChipClasses: Record<EventSource, string> = {
  bookmarked: 'bg-pink-100 text-pink-600 border border-pink-200',
  rsvped: 'bg-purple-100 text-purple-600 border border-purple-200',
  general: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const pluraliseDays = (days: number) => (days === 1 ? 'day' : 'days');

export function CountdownWidget({
  bookmarkedEvents,
  rsvpedEvents,
  fallbackEvents,
  onEventClick,
}: CountdownWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const parseEventDate = (event: EventData) => {
    const rawDate = event?.date || event?.start?.local || event?.start?.utc || event?.startDate;
    if (!rawDate) return null;
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const calculateCountdown = (eventDate: Date) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfEvent = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const diffMs = startOfEvent.getTime() - startOfToday.getTime();
    if (diffMs < 0) return null;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  const normalizeEvents = (events: EventData[], source: EventSource): CountdownEvent[] => {
    return events.reduce<CountdownEvent[]>((acc, event) => {
      const eventDate = parseEventDate(event);
      if (!eventDate) return acc;
      const countdownDays = calculateCountdown(eventDate);
      if (countdownDays === null) return acc;
      acc.push({
        ...event,
        source,
        sources: [source],
        eventDate,
        countdownDays,
      });
      return acc;
    }, []);
  };

  // Only show events from bookmarked or rsvped lists. Do not fall back to general events.
  // For events that are in both lists, we'll track both sources
  const visibleEvents = useMemo(() => {
    const eventMap = new Map<number, CountdownEvent & { sources: EventSource[] }>();

    // Process bookmarked events
    normalizeEvents(bookmarkedEvents, 'bookmarked').forEach(event => {
      if (!eventMap.has(event.id)) {
        eventMap.set(event.id, { ...event, sources: ['bookmarked'] });
      }
    });

    // Process RSVPed events and merge sources if already bookmarked
    normalizeEvents(rsvpedEvents, 'rsvped').forEach(event => {
      const existing = eventMap.get(event.id);
      if (existing) {
        existing.sources.push('rsvped');
      } else {
        eventMap.set(event.id, { ...event, sources: ['rsvped'] });
      }
    });

    // Convert to array and sort by date
    const combined = Array.from(eventMap.values()).sort(
      (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
    );

    return combined.slice(0, MAX_DISPLAYED_EVENTS);
  }, [bookmarkedEvents, rsvpedEvents]);

  if (visibleEvents.length === 0) return null;

  const nextEvent = visibleEvents[0];
  const additionalEventCount = Math.max(0, visibleEvents.length - 1);

  return (
    <motion.div
      ref={widgetRef}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-80 max-h-[28rem] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white z-10 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Calendar className="w-4 h-4 text-purple-600" />
                Event countdowns
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
            
            <div className="overflow-y-auto px-5 py-4 pt-3">
              <div className="space-y-3">
                {visibleEvents.map((event) => {
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        onEventClick(event.id);
                        setIsExpanded(false);
                      }}
                      className="p-3 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={event.imageUrl || IMAGE_PLACEHOLDER}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {event.sources.includes('bookmarked') && (
                              <span
                                className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${sourceChipClasses['bookmarked']}`}
                              >
                                {sourceLabels['bookmarked']}
                              </span>
                            )}
                            {event.sources.includes('rsvped') && (
                              <span
                                className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${sourceChipClasses['rsvped']}`}
                              >
                                {sourceLabels['rsvped']}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-white rounded-xl px-3 py-2 min-w-[72px] flex flex-col items-center justify-center flex-none"
                        >
                          <div className="text-2xl font-semibold text-purple-600 leading-none">
                            {event.countdownDays}
                          </div>
                          <div className="text-xs text-gray-500 leading-none mt-1">
                            {pluraliseDays(event.countdownDays)}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="relative bg-purple-600 text-white rounded-2xl px-4 py-3 shadow-lg flex flex-col items-center gap-1 min-w-[128px]"
          >
            <Calendar className="w-4 h-4 opacity-90" />
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-2xl font-semibold">{nextEvent.countdownDays}</span>
              <span className="text-sm uppercase tracking-wide">{pluraliseDays(nextEvent.countdownDays)}</span>
            </div>
            <div className="flex gap-1 mt-1 flex-wrap justify-center">
              {nextEvent.sources.includes('bookmarked') && (
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] opacity-95 px-2 py-0.5 rounded-full ${sourceChipClasses['bookmarked']}`}
                >
                  {sourceLabels['bookmarked']}
                </span>
              )}
              {nextEvent.sources.includes('rsvped') && (
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] opacity-95 px-2 py-0.5 rounded-full ${sourceChipClasses['rsvped']}`}
                >
                  {sourceLabels['rsvped']}
                </span>
              )}
            </div>
            {additionalEventCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full px-2 py-[2px] text-xs font-medium shadow-lg border border-purple-100">
                +{additionalEventCount}
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
