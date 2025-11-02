import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../features/event/EventCard';
// import { moods } from '../../lib/mockData';
import { categorizeEvent } from '../../lib/eventCategoriser';
import { SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { BackButton } from '../shared/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { formatDateObjectToDDMMYYYY } from '../../lib/dateUtils';

const MOOD_DISPLAY: Record<string, { emoji: string; color: string; name: string }> = {
  chill:       { emoji: "🌿", color: "#7BD389", name: "Chill & Relax" },
  active:      { emoji: "⚡", color: "#FFB84D", name: "Active" },
  social:      { emoji: "🎉", color: "#FF6B6B", name: "Social" },
  educational: { emoji: "📚", color: "#6B9EFF", name: "Educational" },
};




interface MoodResultsPageProps {
  mood: string;
  onNavigate: (page: string, data?: any) => void;
  bookmarkedEventIds: number[];                              
  rsvpedEventIds: number[];                                  
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
}


export function MoodResultsPage({
  mood,
  events,
  onNavigate,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: MoodResultsPageProps & { events: any[] }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const moodData = MOOD_DISPLAY[mood];
  // auto-categorise events
  const categorized = events.map((e) => {
    if (e.mood && e.category) return e; // already transformed by eventbriteService
    const { mood: eventMood, category } = categorizeEvent(
      e.title || e.name?.text || "",          // title string if transformed, else raw
      e.description || e.description?.text || "", // description string if transformed, else raw
      e.category?.name || e.category          // category string if transformed, else raw name
    );
    return { ...e, mood: eventMood, category };
  });

  // Filter events matching quiz mood
  let filteredEvents = categorized.filter(e => e.mood === mood && !e.isPast);


  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.category === categoryFilter);
  }

  // Apply price filter
  if (priceFilter === 'free') {
    filteredEvents = filteredEvents.filter(e => e.price === 'Free');
  } else if (priceFilter === 'paid') {
    filteredEvents = filteredEvents.filter(e => e.price !== 'Free');
  }

  // Apply date filter
  if (dateFilter) {
    filteredEvents = filteredEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === dateFilter.toDateString();
    });
  }

  // Sort events
  if (sortBy === 'popular') {
    filteredEvents = filteredEvents.sort((a, b) => b.saves - a.saves);
  } else if (sortBy === 'date') {
    filteredEvents = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortBy === 'newest') {
    filteredEvents = filteredEvents.sort((a, b) => b.id - a.id);
  } else if (sortBy === 'nearby') {
    filteredEvents = filteredEvents.sort(() => Math.random() - 0.5);
  } else if (sortBy === 'price-low') {
    filteredEvents = filteredEvents.sort((a, b) => {
      const priceA = a.price === 'Free' ? 0 : parseInt(a.price.replace('$', ''));
      const priceB = b.price === 'Free' ? 0 : parseInt(b.price.replace('$', ''));
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filteredEvents = filteredEvents.sort((a, b) => {
      const priceA = a.price === 'Free' ? 0 : parseInt(a.price.replace('$', ''));
      const priceB = b.price === 'Free' ? 0 : parseInt(b.price.replace('$', ''));
      return priceB - priceA;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="mood-results" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Back Button - Sticky */}
        <BackButton onClick={() => onNavigate('landing')} label="Back to Quiz" />
        {/* Mood Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16 mt-6 sm:mt-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6"
          >
            {moodData?.emoji}
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 px-4">
            You're feeling: <span style={{ color: moodData?.color }}>{moodData?.name}</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Here are events that match your mood perfectly
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg mb-8 sm:mb-12 border border-gray-100"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Filter & Sort Events</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200 focus:border-pink-600 focus:ring-pink-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Chill & Relax">🌿 Chill & Relax</SelectItem>
                  <SelectItem value="Active">⚡ Active</SelectItem>
                  <SelectItem value="Social">🎉 Social</SelectItem>
                  <SelectItem value="Educational">📚 Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200 focus:border-pink-600 focus:ring-pink-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-2xl justify-start text-left font-normal border-gray-200 focus:border-pink-600 focus:ring-pink-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? formatDateObjectToDDMMYYYY(dateFilter) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                  {dateFilter && (
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setDateFilter(undefined)}
                        className="w-full rounded-xl"
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200 focus:border-pink-600 focus:ring-pink-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="date">Upcoming Date</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="nearby">Nearest to Me</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full"
              >
                <EventCard 
                  event={event} 
                  onEventClick={(id) => onNavigate('event-info', { eventId: id })}
                  isBookmarkedInitially={bookmarkedEventIds.includes(event.id)}
                  isRSVPedInitially={rsvpedEventIds.includes(event.id)}
                  onBookmarkChange={onBookmarkChange}
                  onRSVPChange={onRSVPChange}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No events found</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
              No events match your current filters. Try adjusting your search criteria to find more events!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
