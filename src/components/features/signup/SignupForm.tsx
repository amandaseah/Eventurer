import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

interface SignupFormProps {
  onNavigate: (page: string) => void;
}

export default function SignupForm({ onNavigate }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Please enter an email');
    if (!password) return setError('Please enter a password');
    if (password !== confirm) return setError("Passwords don't match");

    // TODO: call signup API
    onNavigate('landing');
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="email" className="block text-sm mb-2 text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <Label htmlFor="confirm" className="block text-sm mb-2 text-gray-700">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="confirm"
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-3 rounded-lg border border-pink-200 bg-gradient-to-r from-white to-pink-50"
        >
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-pink-700">Something went wrong</p>
            <p className="text-sm text-pink-600">{error}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button type="submit" className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-300 hover:shadow-xl transition-all">
          Create account
        </Button>
      </motion.div>

      <div className="text-center mt-3 text-sm text-gray-500">
        Already have an account?{' '}
        <button type="button" onClick={() => onNavigate('login')} className="text-purple-600 hover:underline font-medium">
          Log in
        </button>
      </div>
    </motion.form>
  );
}
