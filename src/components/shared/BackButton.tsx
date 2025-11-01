import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -4 }}
      onClick={onClick}
      className="sticky top-20 sm:top-24 z-40 flex items-center gap-2 text-pink-500 hover:text-pink-600 bg-white/90 backdrop-blur-sm rounded-full shadow-md px-4 py-2 text-sm sm:text-base mb-6 w-fit -ml-2 sm:-ml-4"
    >
      <ArrowLeft className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
