import RecommendationPanel from "../features/recommendation/RecommendationPanel";
import FiltersPanel from "../features/explore/FiltersPanel";
import Footer from "../shared/Footer";
import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../features/event/EventCard';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { formatDateObjectToDDMMYYYY } from '../../lib/dateUtils';
import { Star } from 'lucide-react';




interface EventExplorePageProps {
  onNavigate: (page: string, data?: any) => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
  loading?: boolean;
}

export function EventExplorePage({ 
  onNavigate, 
  events,
  bookmarkedEventIds, 
  rsvpedEventIds, 
  onBookmarkChange, 
  onRSVPChange,
  loading = false,
}: EventExplorePageProps & { events: any[] }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // FIXME: Performance issue - filtering on every render. Move to useMemo
  let allEvents = [...events.filter(e => !e.isPast)];


  if (categoryFilter !== 'all') {
    allEvents = allEvents.filter(e => e.category === categoryFilter);
  }

  if (priceFilter === 'free') {
    allEvents = allEvents.filter(e => e.price === 'Free');
  } else if (priceFilter === 'paid') {
    allEvents = allEvents.filter(e => e.price !== 'Free');
  }

  if (dateFilter) {
    allEvents = allEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === dateFilter.toDateString();
    });
  }

  // Sort events
  if (sortBy === 'popular') {
    allEvents = allEvents.sort((a, b) => b.saves - a.saves);
  } else if (sortBy === 'date') {
    allEvents = allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortBy === 'newest') {
    // In a real app, events would have a created_at timestamp
    allEvents = allEvents.sort((a, b) => b.id - a.id);
  } else if (sortBy === 'nearby') {
    // In a real app, this would use geolocation
    // For now, just shuffle to simulate
    allEvents = allEvents.sort(() => Math.random() - 0.5);
  } else if (sortBy === 'price-low') {
    allEvents = allEvents.sort((a, b) => {
      const priceA = a.price === 'Free' ? 0 : parseInt(a.price.replace('$', ''));
      const priceB = b.price === 'Free' ? 0 : parseInt(b.price.replace('$', ''));
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    allEvents = allEvents.sort((a, b) => {
      const priceA = a.price === 'Free' ? 0 : parseInt(a.price.replace('$', ''));
      const priceB = b.price === 'Free' ? 0 : parseInt(b.price.replace('$', ''));
      return priceB - priceA;
    });
  }

  const skeletonItems = Array.from({ length: 6 })

  return (
    <div className="min-h-screen">
      <Header currentPage="explore" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button - Sticky */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => onNavigate('landing')}
          className="sticky top-[84px] sm:top-[96px] z-40 flex items-center gap-2 text-pink-500 hover:text-pink-600 bg-white/90 backdrop-blur-sm rounded-full shadow-md w-fit px-3 sm:px-4 py-2 text-sm sm:text-base mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              Explore Events
            </h1>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Filter by mood, price, date, or just browse everything
          </p>
        </motion.div>

        <div className="w-full space-y-6">
          {/* Carousel Section */}
          <RecommendationPanel
            events={events.filter(e => !e.isPast)}
            onSelect={(id) => onNavigate("event-info", { eventId: id })}
            bookmarkedEventIds={bookmarkedEventIds}
            rsvpedEventIds={rsvpedEventIds}
            onBookmarkChange={onBookmarkChange}
            onRSVPChange={onRSVPChange}
            loading={loading}
          />
          
          {/* Filters */}
          <FiltersPanel
            title="Filter & Sort All Events"
            category={categoryFilter} setCategory={setCategoryFilter}
            price={priceFilter} setPrice={setPriceFilter}
            sortBy={sortBy} setSortBy={setSortBy}
            date={dateFilter} setDate={setDateFilter}
          />

          {/* All Events Grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col items-center gap-3 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  All Events
                </h2>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Browse all available events
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {loading
                ? skeletonItems.map((_, idx) => <ExploreCardSkeleton key={idx} />)
                : allEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
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
            {!loading && allEvents.length === 0 && (
              <div className="mt-8 text-center text-gray-500">
                No events match your filters yet. Try adjusting them.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ExploreCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse h-full">
      <div className="h-48 bg-gray-200 rounded-t-2xl" />
      <div className="p-5 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}
