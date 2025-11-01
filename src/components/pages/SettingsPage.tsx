import { motion } from 'motion/react';
import { Header } from '../Header';
import Footer from '../shared/Footer';
import { ArrowLeft, User, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
  onGoBack: () => void;
}

export function SettingsPage({ onNavigate, onGoBack }: SettingsPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setEmail(user.email || '');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
        }
      } catch (err) {
        console.warn('Failed to load user data', err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveAccountSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to save account settings');
        return;
      }

      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        displayName,
        email: user.email,
      }, { merge: true });

      toast.success('Account settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save account settings', err);
      toast.error('Failed to save account settings');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not yet implemented');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="settings" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={onGoBack}
          className="sticky top-[84px] sm:top-[96px] z-40 flex items-center gap-1.5 sm:gap-2 text-pink-500 hover:text-pink-600 bg-white/90 backdrop-blur-sm rounded-full shadow-md w-fit px-2.5 sm:px-4 py-2 text-xs sm:text-base mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back</span>
        </motion.button>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Account Settings</h1>
          </div>
          <p className="text-gray-600">Manage your profile information and preferences</p>
        </motion.div>

        {/* Account Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl sm:text-2xl font-semibold">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveAccountSettings}
              className="px-6 py-3 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition-all font-semibold"
            >
              Update Password
            </motion.button>
          </div>
        </motion.section>

        {/* Notification Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl sm:text-2xl font-semibold">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-pink-500 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-pink-500 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about upcoming events</p>
              </div>
              <input
                type="checkbox"
                checked={eventReminders}
                onChange={(e) => setEventReminders(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-pink-500 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              />
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePreferences}
              className="px-6 py-3 bg-pink-200 text-pink-600 rounded-2xl hover:bg-pink-300 transition-all font-semibold"
            >
              Save Preferences
            </motion.button>
          </div>
        </motion.section>

        {/* Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl sm:text-2xl font-semibold">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Data Sharing</p>
                <p className="text-sm text-gray-600">Allow anonymous usage data collection</p>
              </div>
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-pink-500 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              />
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePreferences}
              className="px-6 py-3 bg-pink-200 text-pink-600 rounded-2xl hover:bg-pink-300 transition-all font-semibold"
            >
              Save Privacy Settings
            </motion.button>
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl sm:text-2xl font-semibold">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Event View
              </label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="grid">Grid View</option>
                <option value="calendar">Calendar View</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePreferences}
              className="px-6 py-3 bg-pink-200 text-pink-600 rounded-2xl hover:bg-pink-300 transition-all font-semibold"
            >
              Save Preferences
            </motion.button>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-semibold text-red-700">Delete Account</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-semibold"
            >
              Delete Account
            </motion.button>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
