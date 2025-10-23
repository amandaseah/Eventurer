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
      className="bg-white rounded-3xl p-8 shadow-md mb-8"
    >
      <div className="flex items-center gap-6 justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center text-white text-3xl"
        >
          {initials}
        </motion.div>
        <div>
          <h1 className="text-3xl mb-1">{name}</h1>
          <p className="text-gray-600 mb-1">{email}</p>
          <p className="text-sm text-gray-500">Member since {memberSince}</p>
        </div>
        {onSignOut && (
          <div className="ml-6">
            <button
              onClick={onSignOut}
              className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}