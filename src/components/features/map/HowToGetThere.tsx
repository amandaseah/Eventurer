import { motion } from 'motion/react';
import { Navigation } from 'lucide-react';
import Map from "./Map";

export default function HowToGetThere({ event }: { event: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <Navigation className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold">How to Get There</h2>
      </div>

      {/* 🌍 Embedded Map */}
      <div className="mb-6">
        <Map location={event.location} />
      </div>

      {/* 🚌 Transport details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">Nearest MRT</p>
          <p>Downtown MRT (5 min walk)</p>
        </div>
        <div className="p-4 bg-green-50 rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">Bus Stops</p>
          <p>Bus 123, 456 (2 min walk)</p>
        </div>
      </div>
    </motion.div>
  );
}