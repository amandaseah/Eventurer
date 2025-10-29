import { motion } from "motion/react";

export default function SettingsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-md"
    >
      <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">Settings & Preferences</h2>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <h3 className="mb-2">Email Notifications</h3>
          <p className="text-sm text-gray-600 mb-3">Receive updates about events and recommendations</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            <span>Event reminders</span>
          </label>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl">
          <h3 className="mb-2">Mood Preferences</h3>
          <p className="text-sm text-gray-600 mb-3">Your favorite event types</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <span>Chill & Relax 🌿</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <span>Active ⚡</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <span>Social 🎉</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <span>Educational 📚</span>
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl">
          <h3 className="mb-2">Privacy</h3>
          <p className="text-sm text-gray-600 mb-3">Control your data and visibility</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all"
          >
            Manage Privacy Settings
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}