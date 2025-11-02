import LoginForm from '../features/signup/LoginForm';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 w-full max-w-md mx-4 relative"
      >
        {/* Back button to marketing page */}
        <button
          onClick={() => {
            // Break out of iframe if we're inside one
            if (window.top && window.top !== window.self) {
              window.top.location.href = '/';
            } else {
              window.location.href = '/';
            }
          }}
          className="absolute left-3 sm:left-4 top-3 sm:top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex flex-col items-center mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="mb-3 sm:mb-4"
          >
            <img src="/favicon.png" alt="Eventurer" className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Eventurer
          </h1>
          <p className="text-gray-500 mt-2">Welcome back</p>
        </motion.div>

        {/* Login Form */}
        <LoginForm onNavigate={onNavigate} />

      </motion.div>
    </div>
  );
}
