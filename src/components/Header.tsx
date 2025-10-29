import { Home, Search, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentPage?: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <img src="/favicon.png" alt="Eventurer" className="w-10 h-10 rounded-2xl" />
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Eventurer
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Home', id: 'landing', icon: Home },
              { name: 'Explore', id: 'explore', icon: Search },
              { name: 'My Events', id: 'profile', icon: Calendar },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  currentPage === item.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </motion.button>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('profile')}
            className="bg-gradient-to-r from-purple-400 to-pink-300 p-2 rounded-full hover:shadow-lg transition-shadow"
          >
            <User className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
