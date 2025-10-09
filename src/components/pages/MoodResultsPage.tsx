import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../EventCard';
import { events, moods } from '../../lib/mockData';
import { SlidersHorizontal, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { formatDateObjectToDDMMYYYY } from '../../lib/dateUtils';

interface MoodResultsPageProps {
  mood: string;
  onNavigate: (page: string, data?: any) => void;
}

export function MoodResultsPage({ mood, onNavigate }: MoodResultsPageProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const moodData = moods.find(m => m.id === mood);
  let filteredEvents = events.filter(e => e.mood === mood && !e.isPast);

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
    <div className="min-h-screen">
      <Header currentPage="mood-results" onNavigate={onNavigate} />

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
          <span>Back to Quiz</span>
        </motion.button>

        {/* Mood Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 ml-44"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            {moodData?.emoji}
          </motion.div>
          <h1 className="text-4xl mb-2">You're feeling: <span style={{ color: moodData?.color }}>{moodData?.name}</span></h1>
          <p className="text-gray-600">Here are events that match your mood</p>
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
            <h3>Filter & Sort Events</h3>
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

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <EventCard event={event} onEventClick={(id) => onNavigate('event-info', { eventId: id })} />
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-gray-500">No events match your filters. Try adjusting them!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
