import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { Sparkles, Star, Zap, Heart } from 'lucide-react';
import { EventCard } from '../features/event/EventCard';
// import { events } from '../../lib/mockData';

import Hero from '../features/landing/Hero';
import MoodQuiz from '../features/landing/MoodQuiz';
import Footer from '../shared/Footer';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
  events: any[];
  loading?: boolean;
  bookmarkedEventIds?: number[];
  rsvpedEventIds?: number[];
  onBookmarkChange?: (id: number, bookmarked: boolean) => void;
  onRSVPChange?: (id: number, rsvped: boolean) => void;
}

export function LandingPage({ 
  onNavigate, 
  events = [], 
  loading = false,
  bookmarkedEventIds = [],
  rsvpedEventIds = [],
  onBookmarkChange,
  onRSVPChange
}: LandingPageProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const featuredEvents = (events ?? []).filter(e => !e.isPast).slice(0, 3); // filter out past events
  const skeletonCards = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="min-h-screen relative bg-gray-50">
      <Header currentPage="landing" onNavigate={onNavigate} />

      {/* Hero section */}
      <section className="relative overflow-hidden">

        {!quizStarted && (
          <Hero onStart={() => setQuizStarted(true)} />
        )}

        {quizStarted && (
          <MoodQuiz onComplete={(mood) => onNavigate('mood-results', { mood })} />
        )}
      </section>

      {/* Featured Events */}
      <div className="relative">
        <section className="relative bg-gradient-to-b from-white/50 to-gray-50/80 backdrop-blur-sm py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mb-10 sm:mb-14 lg:mb-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
              >
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  Featured Events
                </h2>
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
              </motion.p>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-16 h-16 text-pink-300"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-4 -left-4 w-12 h-12 text-pink-200"
              >
                <Heart className="w-full h-full" />
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {loading
                ? skeletonCards.map((_, idx) => <FeaturedEventSkeleton key={idx} />)
                : featuredEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        delay: idx * 0.15,
                        duration: 0.7,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                      }}
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

            {!loading && featuredEvents.length === 0 && (
              <div className="mt-10 text-center text-gray-500">
                No upcoming events found yet. Check back soon!
              </div>
            )}

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('explore')}
                className="px-8 py-4 bg-pink-400/90 backdrop-blur-md text-white rounded-xl text-lg font-semibold hover:bg-pink-500/90 hover:shadow-lg transition-all flex items-center gap-3 mx-auto border border-white/30"
                style={{
                  boxShadow: '0 8px 24px 0 rgba(236, 72, 153, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <Zap className="w-5 h-5" />
                See All Events
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function FeaturedEventSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-200 rounded-t-2xl" />
      <div className="p-6 space-y-4">
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
