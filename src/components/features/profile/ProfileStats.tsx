import { motion } from 'motion/react';
import { Bookmark, CheckCircle } from 'lucide-react';

interface ProfileStatsProps {
  bookmarkedCount: number;
  upcomingCount: number;
  onBookmarkedClick?: () => void;
  onUpcomingClick?: () => void;
  activeSection?: 'bookmarked' | 'upcoming' | null;
}

export default function ProfileStats({
  bookmarkedCount,
  upcomingCount,
  onBookmarkedClick,
  onUpcomingClick,
  activeSection,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Bookmarked',
      value: bookmarkedCount,
      icon: Bookmark,
      color: 'pink',
      bgColor: activeSection === 'bookmarked' ? 'bg-pink-100' : 'bg-pink-50',
      borderColor: activeSection === 'bookmarked' ? 'border-pink-300' : 'border-pink-200',
      iconColor: 'text-pink-500',
      textColor: 'text-pink-600',
      onClick: onBookmarkedClick,
      isActive: activeSection === 'bookmarked',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: CheckCircle,
      color: 'green',
      bgColor: activeSection === 'upcoming' ? 'bg-green-100' : 'bg-green-50',
      borderColor: activeSection === 'upcoming' ? 'border-green-300' : 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-600',
      onClick: onUpcomingClick,
      isActive: activeSection === 'upcoming',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">{stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-5 sm:p-6 text-center cursor-pointer hover:shadow-md transition-all duration-200 ${
            stat.isActive ? 'ring-2 ring-offset-2' : ''
          } ${
            stat.isActive && stat.color === 'pink' ? 'ring-pink-400' : ''
          } ${
            stat.isActive && stat.color === 'green' ? 'ring-green-400' : ''
          }`}
          onClick={stat.onClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center gap-2">
            <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
            <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
