import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface ChoicePageProps {
  onChoice: (choice: '3d' | 'direct') => void;
}

export function ChoicePage({ onChoice }: ChoicePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 sm:p-8">
      {/* Back button */}
      <button
        onClick={() => window.location.href = '/'}
        className="fixed left-4 top-4 sm:left-6 sm:top-6 p-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all z-50"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/favicon.png"
              alt="Eventurer"
              className="h-12 w-12 rounded-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-xl tracking-tight text-gray-900 font-semibold">Eventurer</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
            How do you want to start?
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Pick your path to discovering events
          </p>
        </motion.div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* 3D Experience Card */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice('3d')}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative p-8 h-full flex flex-col items-center text-center">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-transparent opacity-30 rounded-3xl" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-5 shadow-md"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-7 h-7" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Interactive Showcase
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed max-w-xs">
                  View the app in 3D on a floating monitor
                </p>

                {/* Button */}
                <div className="flex items-center gap-2 text-purple-600 font-medium group-hover:gap-3 transition-all text-sm">
                  <span>View Showcase</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* Direct Access Card */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice('direct')}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative p-8 h-full flex flex-col items-center text-center">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-transparent opacity-30 rounded-3xl" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-5 shadow-md"
                  animate={{ rotate: [0, -5, 0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-7 h-7" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Jump Right In
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed max-w-xs">
                  Start finding events that match your mood
                </p>

                {/* Button */}
                <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all text-sm">
                  <span>Open App</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
