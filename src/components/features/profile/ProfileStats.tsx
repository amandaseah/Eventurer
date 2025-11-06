import { motion } from 'motion/react';
import { Bookmark, CheckCircle } from 'lucide-react';

interface ProfileStatsProps {
  bookmarkedCount: number;
  upcomingCount: number;
  onTabChange?: (tab: 'bookmarked' | 'upcoming') => void;
}

export default function ProfileStats({
  bookmarkedCount,
  upcomingCount,
  onTabChange,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Bookmarked',
      value: bookmarkedCount,
      icon: Bookmark,
      iconColor: 'text-rose-400',
      textColor: 'text-gray-900',
      bgColor: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      borderColor: 'border-gray-200',
      shadowColor: 'shadow-[0_8px_20px_rgba(120,122,130,0.12)] hover:shadow-[0_16px_32px_rgba(120,122,130,0.18)]',
      tab: 'bookmarked' as const,
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: CheckCircle,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-900',
      bgColor: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      borderColor: 'border-gray-200',
      shadowColor: 'shadow-[0_8px_20px_rgba(120,122,130,0.12)] hover:shadow-[0_16px_32px_rgba(120,122,130,0.18)]',
      tab: 'upcoming' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">{stats.map((stat, index) => (
        <motion.button
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onTabChange?.(stat.tab)}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-5 sm:p-6 text-center ${stat.shadowColor} transition-all cursor-pointer hover:border-gray-300 active:scale-[0.98]`}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center gap-2">
            <stat.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${stat.iconColor} stroke-[1.5]`} />
            <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
