import { motion } from 'motion/react';
import { Bookmark, CheckCircle } from 'lucide-react';

interface ProfileStatsProps {
  bookmarkedCount: number;
  upcomingCount: number;
}

export default function ProfileStats({
  bookmarkedCount,
  upcomingCount,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Bookmarked',
      value: bookmarkedCount,
      icon: Bookmark,
      color: 'pink',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-500',
      textColor: 'text-pink-600',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">{stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-5 sm:p-6 text-center`}
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
