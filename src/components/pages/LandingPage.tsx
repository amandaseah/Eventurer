import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { Sparkles, Star, Zap, Heart } from 'lucide-react';
import { EventCard } from '../features/event/EventCard';
// import { events } from '../../lib/mockData';

import Hero from '../features/landing/Hero';
import MoodQuiz from '../features/landing/MoodQuiz';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
  events: any[];
  loading?: boolean;
}

export function LandingPage({ onNavigate, events = [], loading = false }: LandingPageProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const featuredEvents = (events ?? []).slice(0, 3); // guard against undefined

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header currentPage="landing" onNavigate={onNavigate} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Large floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20"
          animate={{
            y: [0, 30, 0],
            x: [0, 10, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20"
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero + animated background */}
      <section className="relative overflow-hidden">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(224, 212, 255, 0.6) 0%, transparent 60%)',
              'radial-gradient(circle at 80% 30%, rgba(195, 228, 255, 0.6) 0%, transparent 60%)',
              'radial-gradient(circle at 50% 70%, rgba(255, 212, 195, 0.6) 0%, transparent 60%)',
              'radial-gradient(circle at 20% 30%, rgba(224, 212, 255, 0.6) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {!quizStarted && (
          <Hero onStart={() => setQuizStarted(true)} />
        )}

        {quizStarted && (
          <MoodQuiz onComplete={(mood) => onNavigate('mood-results', { mood })} />
        )}
      </section>

      {/* Seamless transition to Featured Events */}
      <div className="relative">
        {/* Gradient bridge */}
        <div className="h-16 bg-gradient-to-b from-transparent via-white/50 to-white" />
        
        {/* Featured Events with enhanced design */}
        <section className="relative bg-gradient-to-b from-white via-purple-50/30 to-white py-20">
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
                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
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
                Discover amazing events curated just for you
              </motion.p>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-16 h-16 text-purple-200"
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
                  <EventCard event={event} onEventClick={onNavigate} />
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('explore')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Zap className="w-5 h-5" />
                Explore All Events
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
