import { motion } from 'motion/react';
import { Bookmark, CheckCircle, History } from 'lucide-react';

interface ProfileStatsProps {
  bookmarkedCount: number;
  upcomingCount: number;
  pastCount: number;
}

export default function ProfileStats({
  bookmarkedCount,
  upcomingCount,
  pastCount,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Bookmarked',
      value: bookmarkedCount,
      icon: Bookmark,
      accentClass: 'text-pink-500 bg-pink-50',
      iconColor: 'text-pink-500',
      textColor: 'text-pink-600',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: CheckCircle,
      accentClass: 'text-emerald-500 bg-emerald-50',
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Past Attended',
      value: pastCount,
      icon: History,
      accentClass: 'text-slate-500 bg-slate-50',
      iconColor: 'text-slate-500',
      textColor: 'text-slate-600',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-10">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${stat.accentClass}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div className={`text-3xl sm:text-4xl font-semibold tracking-tight ${stat.textColor}`}>
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-[0.22em]">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
