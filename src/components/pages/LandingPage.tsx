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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
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
        <section className="relative bg-white py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <Star className="w-8 h-8 text-yellow-500" />
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
                  Featured Events
                </h2>
                <Star className="w-8 h-8 text-yellow-500" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Events picked based on your quiz results
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: idx * 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.2 }
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

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('explore')}
                className="px-8 py-4 bg-pink-400 text-white rounded-xl text-lg font-semibold hover:bg-pink-500 hover:shadow-lg transition-all flex items-center gap-3 mx-auto"
              >
                <Zap className="w-5 h-5" />
                See All Events
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
