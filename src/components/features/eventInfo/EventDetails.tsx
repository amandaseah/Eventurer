import { motion } from "motion/react";
import { Calendar, MapPin, Users, Bookmark } from "lucide-react";
import { formatDateToDDMMYYYY } from "../../../lib/dateUtils";

export default function EventDetails({
  event,
  saves = 0,
}: {
  event: any;
  saves?: number;
}) {
  const startDate = event.start?.local
    ? new Date(event.start.local)
    : event.date
    ? new Date(event.date)
    : null;

  const formattedDate = startDate
    ? `${formatDateToDDMMYYYY(startDate.toISOString())} at ${startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Date not available";

  const location =
    event.venue?.name ||
    event.venue?.address?.localized_address_display ||
    event.location ||
    "Location to be announced";

  const category =
    event.category?.name || event.category || "Uncategorized";

  const description =
    event.description?.text || event.description || "No description available.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-md mb-8"
    >
      <h2 className="text-2xl mb-6">{event.name?.text || "Event Details"}</h2>

      <div className="space-y-4 mb-6">
        {/* Date & Time */}
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-2xl">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="text-lg">{formattedDate}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-4">
          <div className="bg-pink-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="text-lg">{location}</p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="text-lg">{category}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-xl mb-3">About this event</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      {/* Saves */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          <span>{saves} people saved this event</span>
        </div>
      </div>
    </motion.div>
  );
}
