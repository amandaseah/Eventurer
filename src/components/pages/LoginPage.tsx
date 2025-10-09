import { motion } from 'motion/react';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradients */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.15) 0%, transparent 50%)',
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
        {/* Logo */}
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
            Eventurer
          </h1>
          <p className="text-gray-500 mt-2">Discover events that match your mood</p>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm mb-2 text-gray-700">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your email"
                className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm mb-2 text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Enter your password"
                className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-300 hover:shadow-xl transition-all"
            >
              Login
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 hover:bg-purple-50"
            >
              Sign Up
            </Button>
          </motion.div>
        </form>

        {/* Social Login */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm">Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm">Facebook</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
