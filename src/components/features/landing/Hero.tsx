import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative">
      <div className="container mx-auto px-6 py-24 md:py-40 relative z-10 mb-24 md:mb-32">
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-full text-lg hover:shadow-2xl transition-all"
          >
            Start Quiz
          </motion.button>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}