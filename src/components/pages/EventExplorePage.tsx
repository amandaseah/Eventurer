import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../EventCard';
import { events } from '../../lib/mockData';
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
  bookmarkedEventIds, 
  rsvpedEventIds, 
  onBookmarkChange, 
  onRSVPChange 
}: EventExplorePageProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl mb-6 text-center">Recommended Events (based on your mood)</h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ x: `-${currentCarouselIndex * 100}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex"
                >
                  {recommendedEvents.map((event) => (
                    <div key={event.id} className="min-w-full px-4">
                      <EventCard 
                        event={event} 
                        onEventClick={(id) => onNavigate('event-info', { eventId: id })}
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

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevCarousel}
                className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextCarousel}
                className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 hover:bg-white"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </motion.button>

              <div className="flex justify-center gap-2 mt-6">
                {recommendedEvents.map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx === currentCarouselIndex ? 1.2 : 1,
                      backgroundColor: idx === currentCarouselIndex ? '#a78bfa' : '#e5e7eb',
                    }}
                    className="w-3 h-3 rounded-full cursor-pointer"
                    onClick={() => setCurrentCarouselIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-md mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <h3>Filter & Sort All Events</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="rounded-2xl">
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
              <div>
                <label className="block text-sm mb-2 text-gray-700">Price</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free Only</SelectItem>
                    <SelectItem value="paid">Paid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl justify-start text-left font-normal"
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
              <div>
                <label className="block text-sm mb-2 text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-2xl">
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
