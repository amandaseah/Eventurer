import { motion } from "motion/react";

export default function ProfileHeader({
  name,
  email,
  memberSince,
  onSignOut,
  onSettings,
}: {
  name: string;
  email: string;
  memberSince: string;
  onSignOut?: () => void;
  onSettings?: () => void;
}) {
  const initials = name.split(" ").map((n) => n.charAt(0)).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-sm mb-6 sm:mb-8"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold flex-shrink-0 shadow-md"
          >
            {initials}
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-1 break-words">
              {name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-1 break-all">{email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-600">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Member since {memberSince}
            </div>
          </div>
        </div>
        {(onSignOut || onSettings) && (
          <div className="w-full sm:w-auto sm:ml-6 flex flex-col gap-2">
            {onSettings && (
              <button
                onClick={onSettings}
                className="w-full sm:w-auto px-5 py-2.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-2xl text-sm font-medium hover:bg-pink-100 transition-colors"
              >
                Settings
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-medium shadow-md hover:bg-gray-800 transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
