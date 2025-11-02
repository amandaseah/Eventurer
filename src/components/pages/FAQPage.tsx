import { motion } from 'motion/react';
import { Header } from '../Header';
import Footer from '../shared/Footer';
import { BackButton } from '../shared/BackButton';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
  onGoBack: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Eventurer?",
    answer: "Eventurer is a mood-based event discovery platform that helps you find events that match how you're actually feeling. Instead of scrolling through endless listings, take our quick mood quiz and get personalized event recommendations."
  },
  {
    question: "How does the mood quiz work?",
    answer: "Our mood quiz asks you a few quick questions about your current vibe - whether you're feeling chill, active, social, or wanting to learn something new. Based on your answers, we recommend events that match your mood perfectly."
  },
  {
    question: "Is Eventurer free to use?",
    answer: "Yes! Eventurer is completely free to use. You can browse events, take the mood quiz, bookmark events, and RSVP to events at no cost. However, some events themselves may have ticket prices set by the organizers."
  },
  {
    question: "How do I RSVP to an event?",
    answer: "Simply click on any event card to view its details, then click the RSVP button. For free events, you'll receive instant confirmation. For paid events, you'll receive an email with payment details."
  },
  {
    question: "Can I bookmark events for later?",
    answer: "Absolutely! Click the bookmark icon on any event card to save it. You can view all your bookmarked events in your profile under the 'Bookmarked' tab."
  },
  {
    question: "How do I cancel my RSVP?",
    answer: "Go to your profile page and find the event in your 'Upcoming Events' tab. Click on the event card, then click the RSVP button again to cancel. You'll receive a confirmation email."
  },
  {
    question: "What happens if an event is cancelled?",
    answer: "If an event is cancelled by the organizer, we'll notify you immediately via email. For paid events, refund information will be included in the notification."
  },
  {
    question: "Can I see events I've attended in the past?",
    answer: "Yes! All events you've RSVP'd to will appear in the 'Past Events' tab on your profile page once the event date has passed."
  },
  {
    question: "How do I change my account settings?",
    answer: "Click on your profile icon in the top navigation bar, then select 'Settings'. From there, you can update your account information, password, notification preferences, and privacy settings."
  },
  {
    question: "What are the different event moods?",
    answer: "We categorize events into four main moods: Chill (relaxed, low-key activities), Active (sports, fitness, outdoor adventures), Social (parties, networking, group activities), and Educational (workshops, talks, learning experiences)."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team at eventurer.support@gmail.com or call us at +65 9999 9999. We typically respond within 24 hours."
  },
  {
    question: "Can I filter events by date or location?",
    answer: "Yes! On the Explore Events page, use the filters panel to narrow down events by date, location, price, and mood. You can also switch between grid and calendar views."
  }
];

export function FAQPage({ onNavigate, onGoBack }: FAQPageProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white">
      <Header currentPage="faq" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-4xl">
        {/* Back Button */}
        <BackButton onClick={onGoBack} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions about using Eventurer
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-pink-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Still have questions section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 text-center border border-pink-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:eventurer.support@gmail.com"
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all font-semibold"
            >
              Email Support
            </a>
            <a
              href="tel:+6599999999"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Call +65 9999 9999
            </a>
          </div>
        </motion.div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
