import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
// import { events } from '../../lib/mockData';


import Hero from '../features/landing/Hero';
import MoodQuiz from '../features/landing/MoodQuiz';
import FeaturedEvents from '../features/landing/FeaturedEvents';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
  events: any[];
  loading?: boolean;
}

export function LandingPage({ onNavigate, events = [], loading = false }: LandingPageProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const featuredEvents = (events ?? []).slice(0, 3); // guard against undefined



  return (
    <div className="min-h-screen">
      <Header currentPage="landing" onNavigate={onNavigate} />

      
      {/* Hero + animated background */}
      <section className="relative overflow-hidden py-12 md:py-20 mb-24 md:mb-32">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(224, 212, 255, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 30%, rgba(195, 228, 255, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 70%, rgba(255, 212, 195, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(224, 212, 255, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {!quizStarted && (
          <Hero onStart={() => setQuizStarted(true)} />
        )}

        {quizStarted && (
          <MoodQuiz onComplete={(mood) => onNavigate('mood-results', { mood })} />
        )}

        {/* bottom fade to prevent visual cutoff into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Featured Events */}
      <FeaturedEvents
        events={featuredEvents}
        onEventClick={(id) => onNavigate('event-info', { eventId: id })}
      />
    </div>
  );
}