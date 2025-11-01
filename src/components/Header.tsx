import { Home, Search, Calendar, User, Menu, X, Settings, LogOut, HelpCircle, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface HeaderProps {
  currentPage?: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserName('');
        return;
      }

      // Try to get name from auth first
      if (user.displayName) {
        // Extract first name only
        const firstName = user.displayName.split(' ')[0];
        setUserName(firstName);
      } else {
        // Try to get from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Use firstName only
            setUserName(data.firstName || 'User');
          } else {
            setUserName('User');
          }
        } catch (err) {
          console.warn('Failed to load user name', err);
          setUserName('User');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: 'Home', id: 'landing', icon: Home },
    { name: 'Explore', id: 'explore', icon: Search },
    { name: 'My Events', id: 'profile', icon: Calendar },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm"
        style={{
          boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.1), inset 0 -1px 0 0 rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavClick('landing')}
            >
              <img src="/favicon.png" alt="Eventurer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl" />
              <span className="text-base sm:text-xl font-semibold text-gray-900">
                Eventurer
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-full transition-all text-xs lg:text-base ${
                    currentPage === item.id
                      ? 'bg-pink-200 text-pink-600'
                      : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* Mobile & Desktop Right Side */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-pink-400 px-3 py-2 rounded-lg hover:bg-pink-500 hover:shadow-md transition-all"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    {userName ? (
                      <span className="text-white font-medium text-sm max-w-[100px] truncate">
                        {userName}
                      </span>
                    ) : (
                      <span className="text-white/50 font-medium text-xs">Loading...</span>
                    )}
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border border-pink-100 bg-white/95 shadow-xl">
                  <DropdownMenuItem
                    onClick={() => handleNavClick('profile')}
                    className="text-gray-600 focus:bg-pink-50 focus:text-pink-600"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavClick('settings')}
                    className="text-gray-600 focus:bg-pink-50 focus:text-pink-600"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem
                    onClick={() => handleNavClick('faq')}
                    className="text-gray-600 focus:bg-pink-50 focus:text-pink-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>FAQ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavClick('safety')}
                    className="text-gray-600 focus:bg-pink-50 focus:text-pink-600"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Safety Guidelines</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={async () => {
                      try {
                        await signOut(auth);
                        handleNavClick('login');
                      } catch (e) {
                        console.warn('Sign out failed', e);
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-pink-500"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-[73px] right-0 bottom-0 w-64 bg-white/70 backdrop-blur-xl shadow-2xl z-40 md:hidden border-l border-white/50"
              style={{
                boxShadow: '-4px 0 24px 0 rgba(31, 38, 135, 0.15), inset 1px 0 0 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              <nav className="flex flex-col p-6 gap-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      currentPage === item.id
                        ? 'bg-pink-200 text-pink-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                ))}

                <div className="h-px bg-gray-200 my-2" />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick('faq')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-gray-600 hover:bg-gray-50"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">FAQ</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick('safety')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-gray-600 hover:bg-gray-50"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Safety Guidelines</span>
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
