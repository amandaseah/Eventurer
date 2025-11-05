import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { signInWithGoogle } from '../../../lib/firebase';
import { friendlyAuthError } from '../../../lib/authErrorMessages';

interface GoogleSignInButtonProps {
  onNavigate: (page: string) => void;
  text?: string;
}

export default function GoogleSignInButton({ onNavigate, text = "Continue with Google" }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // On successful login, navigate to landing
      onNavigate('landing');
    } catch (err: any) {
      setError(friendlyAuthError(err, 'Unable to sign in with Google'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-3"
        >
          {!loading && (
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
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
          )}
          {loading ? 'Signing in...' : text}
        </Button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-3 rounded-lg border border-pink-200 bg-pink-50"
        >
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-pink-500">Google sign in failed</p>
            <p className="text-sm text-pink-500">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}