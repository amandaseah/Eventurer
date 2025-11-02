import { motion } from 'motion/react';
import { Calendar, MapPin, Bookmark, Clock } from 'lucide-react';
import { formatDateToDDMMYYYY } from '../../../lib/dateUtils';
import { useMemo } from 'react';

interface EventCalendarViewProps {
  events: any[];
  onEventClick: (id: number) => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
  onRSVPChange?: (id: number, rsvped: boolean) => void;
}

export function EventCalendarView({
  events,
  onEventClick,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: EventCalendarViewProps) {
  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, any[]>();

    events.forEach(event => {
      const dateKey = new Date(event.date).toDateString();
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });

    // Sort dates and events within each date
    const sortedEntries = Array.from(grouped.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, evts]) => [
        date,
        evts.sort((a, b) => {
          const timeA = a.time || '00:00';
          const timeB = b.time || '00:00';
          return timeA.localeCompare(timeB);
        })
      ]);

    return new Map(sortedEntries);
  }, [events]);

  const handleBookmark = (e: React.MouseEvent, eventId: number, isBookmarked: boolean) => {
    e.stopPropagation();
    if (onBookmarkChange) {
      onBookmarkChange(eventId, !isBookmarked);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      {Array.from(eventsByDate.entries()).map(([dateString, dateEvents], dateIndex) => {
        const date = new Date(dateString);
        const isToday = date.toDateString() === new Date().toDateString();
        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

        let dateLabel = formatDateToDDMMYYYY(dateString);
        if (isToday) dateLabel = 'Today';
        else if (isTomorrow) dateLabel = 'Tomorrow';

        return (
          <motion.div
            key={dateString}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
          >
            {/* Date Header - Enhanced with glass morphism */}
            <div className="sticky top-[84px] sm:top-[96px] z-30 bg-gradient-to-b from-gray-50 to-transparent pb-3 sm:pb-6">
              <div className="bg-gradient-to-r from-white to-pink-50/30 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-5 shadow-lg border border-pink-100 backdrop-blur-sm">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg sm:rounded-xl shadow-md">
                    <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent">
                      {dateLabel}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
                      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-600 font-medium sm:hidden">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md flex-shrink-0">
                    {dateEvents.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Events for this date - Enhanced timeline */}
            <div className="space-y-3 sm:space-y-5 pl-3 sm:pl-6 relative">
              {/* Gradient timeline */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 rounded-full" />

              {dateEvents.map((event, eventIndex) => {
                const isBookmarked = bookmarkedEventIds.includes(event.id);
                const isRSVPed = rsvpedEventIds.includes(event.id);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: eventIndex * 0.05 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    onClick={() => onEventClick(event.id)}
                    className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer ml-3 sm:ml-6 group"
                  >
                    {/* Enhanced time indicator dot with pulse */}
                    <div className="absolute -left-[18px] sm:-left-[30px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 sm:border-4 border-white shadow-md relative z-10" />
                      <div className="absolute w-2.5 h-2.5 sm:w-4 sm:h-4 bg-pink-400 rounded-full animate-ping opacity-75" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                      {/* Enhanced Image with subtle shadow */}
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {event.isPast && (
                          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-[10px] sm:text-xs font-semibold text-white">Past</span>
                          </div>
                        )}
                      </div>

                      {/* Event Name & Location - Enhanced typography */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-gray-900 line-clamp-1 mb-1 sm:mb-2 group-hover:text-pink-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                          <span className="line-clamp-1 font-medium">{event.location}</span>
                        </div>
                        {/* Mobile: Show time and price here */}
                        <div className="flex items-center gap-3 mt-2 sm:hidden">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-semibold">{event.time}</span>
                          </div>
                          <span className="text-base font-black bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                            {event.price}
                          </span>
                          {isRSVPed && (
                            <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Bookmark with gradient */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleBookmark(e, event.id, isBookmarked)}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-all flex-shrink-0 shadow-md ${
                          isBookmarked
                            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Bookmark
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                        <span className="text-xs sm:text-sm font-bold">{event.saves || 0}</span>
                      </motion.button>

                      {/* Enhanced Time & Price section - Desktop only */}
                      <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0 min-w-[140px]">
                        {/* Price - More Prominent */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                            {event.price}
                          </span>
                          {isRSVPed && (
                            <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                              ✓
                            </span>
                          )}
                        </div>
                        {/* Time - Simple display without pill */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {eventsByDate.size === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
}
