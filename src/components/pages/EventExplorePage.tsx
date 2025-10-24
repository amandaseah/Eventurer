import RecommendationPanel from "../features/recommendation/RecommendationPanel";
import FiltersPanel from "../features/explore/FiltersPanel";
// import { sanityCheckMe, fetchEventbriteEventsForMe } from '../../lib/eventbriteService';



import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../features/event/EventCard';
// import { events } from '../../lib/mockData';
// import { fetchEventbriteEventsForMe } from '../../lib/eventbriteService';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { formatDateObjectToDDMMYYYY } from '../../lib/dateUtils';




interface EventExplorePageProps {
  onNavigate: (page: string, data?: any) => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
}

export function EventExplorePage({ 
  onNavigate, 
  events,
  bookmarkedEventIds, 
  rsvpedEventIds, 
  onBookmarkChange, 
  onRSVPChange 
}: EventExplorePageProps & { events: any[] }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

//   const [fetchedEvents, setFetchedEvents] = useState<any[]>([]);
//   const [loadingEvents, setLoadingEvents] = useState(true);

//  useEffect(() => {
//   async function load() {
//     setLoadingEvents(true);
//     try {
//       await sanityCheckMe();       // ← if this fails, stop and fix token/header
//     } catch {
//       setLoadingEvents(false);
//       return;
//     }
//     const data = await fetchEventbriteEventsForMe();
//     console.log('[Explore] fetched events:', data);  
//     setFetchedEvents(data);
//     console.log("Fetched:", data);
//     setLoadingEvents(false);
//   }
//   load();
// }, []);

  const recommendedEvents = events.filter(e => !e.isPast).slice(0, 4);
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

  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) =>
      prev === recommendedEvents.length - 1 ? 0 : prev + 1
    );
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) =>
      prev === 0 ? recommendedEvents.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="explore" onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12">
        {/* Back Button - Fixed */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => onNavigate('landing')}
          className="fixed top-24 left-6 z-50 flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-8 text-center"
        >
          Explore Events
        </motion.h1>

        <div className="w-full">
          {/* Carousel Section */}
          <RecommendationPanel
            events={events}
            onSelect={(id) => onNavigate("event-info", { eventId: id })}
            bookmarkedEventIds={bookmarkedEventIds}
            rsvpedEventIds={rsvpedEventIds}
            onBookmarkChange={onBookmarkChange}
            onRSVPChange={onRSVPChange}
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
            <h2 className="text-2xl mb-6">All Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
