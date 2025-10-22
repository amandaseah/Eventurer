import { motion } from 'motion/react';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

interface LoginFormProps {
  onNavigate: (page: string) => void;
}

export default function LoginForm({ onNavigate }: LoginFormProps) {
  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        onNavigate('landing');
      }}
      className="space-y-5"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="email" className="block text-sm mb-2 text-gray-700">
          Email or Username
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
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
        <Label htmlFor="password" className="block text-sm mb-2 text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
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

      <div className="text-center mt-3 text-sm text-gray-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="text-purple-600 hover:underline font-medium"
        >
          Sign up here!
        </button>
      </div>
    </motion.form>
  );
}