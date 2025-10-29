import { motion } from "motion/react";

export default function ProfileHeader({
  name,
  email,
  memberSince,
  onSignOut,
}: {
  name: string;
  email: string;
  memberSince: string;
  onSignOut?: () => void;
}) {
  const initials = name.split(" ").map((n) => n.charAt(0)).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 sm:p-8 shadow-md mb-8"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center text-white text-2xl sm:text-3xl flex-shrink-0"
          >
            {initials}
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl mb-1 break-words">{name}</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-1 break-all">{email}</p>
            <p className="text-xs sm:text-sm text-gray-500">Member since {memberSince}</p>
          </div>
        </div>
        {onSignOut && (
          <div className="w-full sm:w-auto sm:ml-6">
            <button
              onClick={onSignOut}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}