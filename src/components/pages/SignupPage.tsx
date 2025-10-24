import SignupForm from '../features/signup/SignupForm';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md mx-4 relative z-10"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex flex-col items-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200 p-4 rounded-3xl mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Create account
          </h1>
          <p className="text-gray-500 mt-2">Join Eventurer and discover events that match your mood</p>
        </motion.div>

        <SignupForm onNavigate={onNavigate} />
      </motion.div>
    </div>
  );
}

export default SignupPage;
