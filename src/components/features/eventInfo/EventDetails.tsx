{ /*this file will be used for eventinfopage: details of the event displayed */ }

import { motion } from "motion/react";
import { Calendar, MapPin, Users, Bookmark } from "lucide-react";
import { formatDateToDDMMYYYY } from "../../../lib/dateUtils";

export default function EventDetails({
  event,
  saves,
}: {
  event: any;
  saves: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-md mb-8"
    >
      <h2 className="text-2xl mb-6">Event Details</h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-2xl">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="text-lg">
              {formatDateToDDMMYYYY(event.date)} at {event.time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-pink-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="text-lg">{event.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="text-lg">{event.category}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-xl mb-3">About this event</h3>
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Join us for an amazing experience! This event is perfect for anyone
          looking to{" "}
          {event.mood === "chill"
            ? "relax and unwind"
            : event.mood === "active"
            ? "get energized and active"
            : event.mood === "social"
            ? "meet new people and connect"
            : "learn something new"}
          . Don't miss out on this opportunity!
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          <span>{saves} people saved this event</span>
        </div>
      </div>
    </motion.div>
  );
}