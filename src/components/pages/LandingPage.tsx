import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../EventCard';
import { Progress } from '../ui/progress';
import { quizQuestions, moods, events } from '../../lib/mockData';
import { ChevronRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moodScores, setMoodScores] = useState<Record<string, number>>({
    chill: 0,
    active: 0,
    social: 0,
    educational: 0,
  });
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  const handleAnswer = (mood: string) => {
    const newScores = { ...moodScores, [mood]: moodScores[mood] + 1 };
    setMoodScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - determine mood
      const topMood = Object.entries(newScores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      setSelectedMood(topMood);
      setQuizComplete(true);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header currentPage="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
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

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-purple-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Find events that match your mood
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Take our quick mood quiz and discover the perfect events for you
            </p>

            {!quizStarted && !quizComplete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuizStarted(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-full text-lg hover:shadow-2xl transition-all"
              >
                Start Quiz
              </motion.button>
            )}
          </motion.div>

          {/* Quiz Section */}
          <AnimatePresence mode="wait">
            {quizStarted && !quizComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <motion.h3
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl mb-6 text-gray-800"
                >
                  {quizQuestions[currentQuestion].question}
                </motion.h3>

                <div className="grid gap-4">
                  {quizQuestions[currentQuestion].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.mood)}
                      className="p-4 text-left rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <span className="text-gray-700 group-hover:text-purple-700">
                        {option.text}
                      </span>
                      <ChevronRight className="inline-block ml-2 w-4 h-4 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-xl text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-6xl mb-4"
                >
                  {moods.find(m => m.id === selectedMood)?.emoji}
                </motion.div>
                <h3 className="text-3xl mb-2">You're feeling:</h3>
                <p className="text-4xl mb-8" style={{ color: moods.find(m => m.id === selectedMood)?.color }}>
                  {moods.find(m => m.id === selectedMood)?.name}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('mood-results', { mood: selectedMood })}
                  className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-full text-lg hover:shadow-2xl transition-all"
                >
                  See Matching Events
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl text-center mb-12">Featured Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <EventCard event={event} onEventClick={(id) => onNavigate('event-info', { eventId: id })} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
