import { motion } from 'motion/react';
import { Header } from '../Header';
import Footer from '../shared/Footer';
import { User, Trash2, Bell, Lock, Settings as SettingsIcon, KeyRound, LogOut, ChevronLeft, ChevronRight, HelpCircle, Shield } from 'lucide-react';
import { BackButton } from '../shared/BackButton';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../lib/firebase';
import { updateProfile, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider, signOut } from 'firebase/auth';
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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [defaultView, setDefaultView] = useState<'grid' | 'calendar'>('grid');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('account');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
          setEmailNotifications(data.preferences?.emailNotifications ?? true);
          setPushNotifications(data.preferences?.pushNotifications ?? true);
          setEventReminders(data.preferences?.eventReminders ?? true);
          setDataSharing(data.preferences?.dataSharing ?? true);
          setDefaultView(data.preferences?.defaultView ?? 'grid');
        }
      } catch (err) {
        console.warn('Failed to load user data', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if scroll arrows should be shown
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(checkScroll, 300);
  };

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

  const handleSavePreferences = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to save preferences');
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        preferences: {
          emailNotifications,
          pushNotifications,
          eventReminders,
          dataSharing,
          defaultView,
        },
      }, { merge: true });

      toast.success('Preferences updated');
    } catch (err: any) {
      console.error('Failed to save preferences', err);
      toast.error('Failed to save preferences');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error('Please sign in again to change your password');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (err: any) {
      console.error('Failed to update password', err);
      const message = err?.code === 'auth/wrong-password'
        ? 'Current password is incorrect'
        : err?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Failed to update password';
      toast.error(message);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not yet implemented');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      onNavigate('login');
    } catch (err) {
      console.error('Failed to sign out', err);
      toast.error('Failed to sign out');
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { id: 'account', label: 'Account Info', icon: User, type: 'scroll' as const },
    { id: 'password', label: 'Password', icon: KeyRound, type: 'scroll' as const },
    { id: 'notifications', label: 'Notifications', icon: Bell, type: 'scroll' as const },
    { id: 'privacy', label: 'Privacy', icon: Lock, type: 'scroll' as const },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon, type: 'scroll' as const },
    { id: 'help', label: 'Help & Safety', icon: HelpCircle, type: 'scroll' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="settings" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-7xl">
        {/* Back Button */}
        <BackButton onClick={onGoBack} />

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

        {/* Horizontal Navigation - Visible on all screen sizes */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 relative">
          {/* Left scroll arrow - only show on small screens when scrollable */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:hidden hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Right scroll arrow - only show on small screens when scrollable */}
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:hidden hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto pb-2 hide-scrollbar justify-evenly"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                  activeSection === item.id
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
            {/* Account Information */}
            <motion.section
              id="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
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
                  Save Account Information
                </motion.button>
              </div>
            </motion.section>

            {/* Password */}
            <motion.section
              id="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <KeyRound className="w-5 h-5 text-pink-500" />
                <h2 className="text-xl sm:text-2xl font-semibold">Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Create a new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition-all font-semibold"
                >
                  Update Password
                </motion.button>
              </div>
            </motion.section>

            {/* Notification Preferences */}
            <motion.section
              id="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
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
              id="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-pink-500" />
                <h2 className="text-xl sm:text-2xl font-semibold">Privacy</h2>
              </div>

              <div className="space-y-4">
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
              id="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
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
                    onChange={(e) => setDefaultView(e.target.value as 'grid' | 'calendar')}
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

            {/* Help & Safety Section */}
            <motion.section
              id="help"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Help & Safety</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Need help or want to learn about staying safe? Check out our resources.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('faq')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all font-semibold"
                  >
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span>FAQ</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('safety')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all font-semibold"
                  >
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Safety Guidelines</span>
                  </motion.button>
                </div>
              </div>
            </motion.section>

            {/* Sign Out Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <LogOut className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl sm:text-2xl font-semibold">Sign Out</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Sign out of your account on this device.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="px-6 py-3 bg-gray-700 text-white rounded-2xl hover:bg-gray-800 transition-all font-semibold"
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8"
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
      </div>

      <Footer onNavigate={onNavigate} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
