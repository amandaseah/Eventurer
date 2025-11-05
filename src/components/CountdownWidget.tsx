import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { bringToFront } from '../directives/draggable';
import { X, Calendar } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { formatDateObjectToDDMMYYYY } from '../lib/dateUtils';
import { registerFloating, unregisterFloating, updateFloatingCorner, subscribeOffset, unsubscribeOffset, getOffsetFor, triggerRelayout } from '../lib/floatingRegistry';

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
  bookmarked: 'bg-pink-100 text-pink-500 border border-pink-200',
  rsvped: 'bg-pink-200 text-pink-500 border border-pink-200',
  general: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const pluraliseDays = (days: number) => (days === 1 ? 'day' : 'days');

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const getSpacing = () => {
  if (typeof window === 'undefined') return 16;
  return window.innerWidth >= 640 ? 24 : 16;
};

const getTopOffset = () => {
  if (typeof window === 'undefined') return 72;
  return window.innerWidth >= 640 ? 96 : 72;
};

const getCornerStyle = (corner: Corner, spacing: number) => {
  const style: Record<'top' | 'bottom' | 'left' | 'right', number | 'auto'> = {
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  };

  if (corner.startsWith('top')) {
    style.top = getTopOffset() + spacing;
  } else {
    style.bottom = spacing;
  }

  if (corner.endsWith('left')) {
    style.left = spacing;
  } else {
    style.right = spacing;
  }

  return style;
};

const determineCorner = (pointX: number, pointY: number): Corner => {
  if (typeof window === 'undefined') return 'bottom-right';
  const horizontal = pointX < window.innerWidth / 2 ? 'left' : 'right';
  const vertical = pointY < window.innerHeight / 2 ? 'top' : 'bottom';
  return `${vertical}-${horizontal}` as Corner;
};

export function CountdownWidget({
  bookmarkedEvents,
  rsvpedEvents,
  fallbackEvents: _fallbackEvents,
  onEventClick,
}: CountdownWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [spacing, setSpacing] = useState(() => getSpacing());
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const idRef = useRef('countdown-widget');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => setSpacing(getSpacing());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cornerStyle = useMemo(() => getCornerStyle(corner, spacing), [corner, spacing]);
  
  const appliedCornerStyle = useMemo(() => {
    const s: any = { ...cornerStyle };
    if (typeof s.top === 'number') s.top = (s.top as number) + offset;
    if (typeof s.bottom === 'number') s.bottom = (s.bottom as number) + offset;
    console.log(`[CountdownWidget] Applied offset: ${offset}px, corner: ${corner}`, s);
    return s;
  }, [cornerStyle, offset, corner]);

  useEffect(() => {
    const id = idRef.current;
    const el = widgetRef.current;
    if (!el) return;
    registerFloating(id, el, corner, 1); // Lower priority (bottom of stack)
    subscribeOffset(id, setOffset);
    // initialize offset from registry
    setOffset(getOffsetFor(id));
    return () => {
      unsubscribeOffset(id);
      unregisterFloating(id);
    };
    // register once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFloatingCorner(idRef.current, corner);
  }, [corner]);

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

  // Show events from bookmarked or rsvped lists only
  // For events that are in both lists, we'll track both sources
  const visibleEvents = useMemo(() => {
    const eventMap = new Map<number, CountdownEvent & { sources: EventSource[] }>();

    const normalizedBookmarked = normalizeEvents(bookmarkedEvents, 'bookmarked');
    const normalizedRsvped = normalizeEvents(rsvpedEvents, 'rsvped');

    if (normalizedBookmarked.length === 0 && normalizedRsvped.length === 0) {
      return [];
    }

    normalizedBookmarked.forEach(event => {
      if (!eventMap.has(event.id)) {
        eventMap.set(event.id, { ...event, sources: ['bookmarked'] });
      }
    });

    normalizedRsvped.forEach(event => {
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

  // Trigger relayout when visibility changes (events appear/disappear)
  useEffect(() => {
    // Add a small delay to ensure the DOM has updated
    const timer = setTimeout(() => {
      triggerRelayout(corner);
    }, 50);
    return () => clearTimeout(timer);
  }, [visibleEvents.length, corner]);

  console.log(`[CountdownWidget] visibleEvents.length: ${visibleEvents.length}`, visibleEvents);

  const nextEvent = visibleEvents[0];
  const additionalEventCount = Math.max(0, visibleEvents.length - 1);
  const hasEvents = visibleEvents.length > 0;

  return (
    <motion.div
      ref={widgetRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: hasEvents ? 1 : 0, scale: hasEvents ? 1 : 0.95 }}
      drag
      dragMomentum={false}
      dragElastic={0.2}
      dragListener={!isExpanded && hasEvents}
      onPointerDown={() => hasEvents && bringToFront(widgetRef.current)}
      style={{
        ...appliedCornerStyle,
        x,
        y,
        position: 'fixed',
        zIndex: 40,
        pointerEvents: hasEvents ? 'auto' : 'none'
      }}
      onDragEnd={(_, info) => {
        const newCorner = determineCorner(info.point.x, info.point.y);
        setCorner(newCorner);
        x.set(0);
        y.set(0);
      }}
    >
      <AnimatePresence>
        {hasEvents && isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl w-72 sm:w-80 max-h-[28rem] overflow-hidden flex flex-col border border-white/50"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white/60 backdrop-blur-md z-10 border-b border-white/30">
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
                      className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl cursor-pointer hover:shadow-md hover:bg-white/70 transition-all border border-white/40"
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
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{event.title}</p>
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
                          className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[72px] flex flex-col items-center justify-center flex-none"
                        >
                          <div className="text-2xl font-semibold text-pink-500 leading-none">
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
        ) : hasEvents ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="relative bg-pink-400/80 backdrop-blur-md text-white rounded-2xl shadow-lg border border-white/30"
            style={{
              boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Mobile: Compact version */}
            <div className="sm:hidden flex items-center gap-2 px-3 py-2">
              <Calendar className="w-3.5 h-3.5 opacity-90" />
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-xl font-semibold">{nextEvent.countdownDays}</span>
                <span className="text-xs uppercase tracking-wide">{pluraliseDays(nextEvent.countdownDays)}</span>
              </div>
              {additionalEventCount > 0 && (
                <div className="bg-white text-pink-500 rounded-full px-1.5 py-[1px] text-[10px] font-medium">
                  +{additionalEventCount}
                </div>
              )}
            </div>

            {/* Desktop: Full version */}
            <div className="hidden sm:flex flex-col items-center gap-1 px-4 py-3 min-w-[128px]">
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
                <div className="absolute -top-2 -right-2 bg-white text-pink-500 rounded-full px-2 py-[2px] text-xs font-medium shadow-lg border border-pink-200">
                  +{additionalEventCount}
                </div>
              )}
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
