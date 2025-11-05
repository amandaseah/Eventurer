import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChoicePageProps {
  onChoice: (choice: '3d' | 'direct') => void;
}

const APPLE_FONT = "'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif";

export function ChoicePage({ onChoice }: ChoicePageProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen bg-white text-gray-900"
      style={{ fontFamily: APPLE_FONT }}
    >

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/90 px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md z-50"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16"
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 shadow-sm shadow-pink-100/60"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              Choose how you explore
            </motion.span>

            <motion.h1
              className="mt-6 text-[2.4rem] sm:text-[3rem] md:text-[3.4rem] leading-tight font-light tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
            >
              Two ways to feel what Eventurer does best.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Whether you want the show-stopping 3D intro or to dive straight into the mood-matched
              feed, pick the journey that suits you.
            </motion.p>
          </motion.div>

          {/* Choice Cards */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* 3D Experience Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice('3d')}
              className="group relative overflow-hidden rounded-[26px] sm:rounded-[32px] border border-gray-200 bg-rose-100/70 p-7 sm:p-8 lg:p-9 text-left shadow-[0_14px_32px_rgba(236,72,153,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(236,72,153,0.18)]"
            >
              <span aria-hidden className="choice-card-gradient choice-card-gradient-pink" />
              <span aria-hidden className="choice-card-dim" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-rose-300 shadow-sm font-semibold text-base sm:text-lg">
                  3D
                </div>
                <h2 className="mt-5 sm:mt-6 text-[1.75rem] sm:text-[2.1rem] font-semibold tracking-tight text-gray-900">
                  Immersive 3D showcase
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                  Step into the Eventurer world on a floating screen. Perfect for wow moments and
                  demo sessions.
                </p>

                <div className="mt-auto pt-6 sm:pt-8">
                  <div className="inline-flex items-center gap-2 text-rose-400 transition-all duration-200 group-hover:gap-3 text-sm font-medium">
                    <span>View showcase</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Direct Access Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice('direct')}
              className="group relative overflow-hidden rounded-[26px] sm:rounded-[32px] border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-7 sm:p-8 lg:p-9 text-left shadow-[0_14px_32px_rgba(120,122,130,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(120,122,130,0.18)]"
            >
              <span aria-hidden className="choice-card-gradient choice-card-gradient-neutral" />
              <span aria-hidden className="choice-card-dim" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm">
                  <ArrowRight className="h-7 w-7" />
                </div>
                <h2 className="mt-5 sm:mt-6 text-[1.75rem] sm:text-[2.1rem] font-semibold tracking-tight text-gray-900">
                  Go straight to the app
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                  Drop right into the Eventurer experience and let the mood quiz start curating for
                  you.
                </p>

                <div className="mt-auto pt-6 sm:pt-8">
                  <div className="inline-flex items-center gap-2 text-gray-700 transition-all duration-200 group-hover:gap-3 text-sm font-medium">
                    <span>Open app</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
