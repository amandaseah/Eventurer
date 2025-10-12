import { motion } from 'motion/react';
import { EventCard } from '../../features/event/EventCard';

export default function FeaturedEvents({
  events,
  onEventClick,
}: {
  events: any[];
  onEventClick: (id: number) => void;
}) {
  return (
    <section className="container mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <h2 className="text-3xl text-center mb-12">Featured Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <EventCard event={event} onEventClick={onEventClick} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}