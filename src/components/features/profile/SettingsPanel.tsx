import { motion } from "motion/react";

export default function SettingsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-md"
    >
      <style>{`
        .settings-checkbox {
          width: 1rem !important;
          height: 1rem !important;
          min-width: 1rem !important;
          min-height: 1rem !important;
          max-width: 1rem !important;
          max-height: 1rem !important;
          flex-shrink: 0 !important;
        }
        @media (min-width: 640px) {
          .settings-checkbox {
            width: 1.25rem !important;
            height: 1.25rem !important;
            min-width: 1.25rem !important;
            min-height: 1.25rem !important;
            max-width: 1.25rem !important;
            max-height: 1.25rem !important;
          }
        }
      `}</style>
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">Settings & Preferences</h2>
      <div className="space-y-4 sm:space-y-6">
        {/* Email Notifications */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Email Notifications</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Receive updates about events and recommendations</p>
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              defaultChecked
              className="settings-checkbox rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm sm:text-base">Event reminders</span>
          </label>
        </div>

        {/* Mood Preferences */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Mood Preferences</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Your favorite event types</p>
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="settings-checkbox rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Chill & Relax 🌿</span>
            </label>
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="settings-checkbox rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Active ⚡</span>
            </label>
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="settings-checkbox rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Social 🎉</span>
            </label>
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="settings-checkbox rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Educational 📚</span>
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Privacy</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Control your data and visibility</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-100 text-purple-700 rounded-xl sm:rounded-2xl hover:bg-purple-200 transition-all text-sm sm:text-base font-medium"
          >
            Manage Privacy Settings
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}