import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero({ onStart }: { onStart: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Right Now?";

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;

    const typingInterval = setInterval(() => {
      if (!isDeleting) {
        // Typing forward
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Pause at the end before deleting
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        // Deleting backward
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayedText(fullText.slice(0, currentIndex));
        } else {
          // Reset and start typing again
          isDeleting = false;
        }
      }
    }, isDeleting ? 50 : 100); // faster deletion, slower typing

    return () => clearInterval(typingInterval);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-24 md:py-40 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main heading with typing animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 font-bold text-gray-900">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block"
            >
              What's Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-pink-400 block"
            >
              Vibe {displayedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 sm:w-1 h-10 sm:h-12 md:h-16 lg:h-20 bg-pink-400 ml-1"
                style={{ verticalAlign: 'middle' }}
              />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Take a quick 5-question quiz and we'll show you events that actually match how you're feeling.
          </motion.p>

          {/* Quiz button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="px-10 py-5 bg-pink-400 text-white rounded-xl text-lg font-semibold hover:bg-pink-500 shadow-lg transition-all duration-200 flex items-center gap-3 mx-auto"
          >
            <Zap className="w-5 h-5" />
            <span>Take the Quiz</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

        </motion.div>
      </div>
    </section>
  );
}