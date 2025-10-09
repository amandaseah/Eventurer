import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Bookmark } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDateToDDMMYYYY } from '../lib/dateUtils';

interface Event {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
}

interface CountdownWidgetProps {
  bookmarkedEvents: Event[];
  upcomingEvents: Event[];
  onEventClick: (id: number) => void;
}

export function CountdownWidget({ bookmarkedEvents, upcomingEvents, onEventClick }: CountdownWidgetProps) {
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

  const getCountdown = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const allEvents = [
    ...bookmarkedEvents.map(e => ({ ...e, type: 'bookmarked' as const })),
    ...upcomingEvents.map(e => ({ ...e, type: 'upcoming' as const }))
  ];

  // Remove duplicates
  const uniqueEvents = allEvents.filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  ).slice(0, 5);

  if (uniqueEvents.length === 0) return null;

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
            className="bg-white rounded-3xl shadow-2xl w-80 max-h-96 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-white z-10 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg">Event Countdown</h3>
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
            
            <div className="overflow-y-auto p-6 pt-3">
              <div className="space-y-3">
                {uniqueEvents.map((event) => {
                  const countdown = getCountdown(event.date);
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 4 }}
                      onClick={() => onEventClick(event.id)}
                      className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl cursor-pointer hover:shadow-md transition-all border border-purple-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {event.type === 'bookmarked' && (
                              <Bookmark className="w-3 h-3 text-pink-500" fill="currentColor" />
                            )}
                            <p className="text-xs text-gray-600">{formatDateToDDMMYYYY(event.date)}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-center bg-white rounded-xl p-2 min-w-[60px]"
                        >
                          <div className="text-2xl text-purple-600">{countdown}</div>
                          <div className="text-xs text-gray-500">days</div>
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
            className="bg-gradient-to-br from-purple-500 to-pink-400 text-white rounded-full p-4 shadow-2xl flex items-center gap-2"
          >
            <Calendar className="w-6 h-6" />
            <div className="flex items-center gap-1">
              <span className="text-2xl">{getCountdown(uniqueEvents[0].date)}</span>
              <span className="text-sm">days</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
