import { motion } from 'motion/react';
import { Header } from '../Header';
import Footer from '../shared/Footer';
import { BackButton } from '../shared/BackButton';
import { Shield, AlertTriangle, CheckCircle, Users, MapPin, Phone, Eye, Lock } from 'lucide-react';

interface SafetyGuidelinesPageProps {
  onNavigate: (page: string) => void;
  onGoBack: () => void;
}

const guidelines = [
  {
    icon: Users,
    title: "Meet in Public Places",
    description: "Always choose well-lit, public venues for events. Avoid isolated locations, especially for first-time meetups.",
    tips: [
      "Opt for venues with security or staff present",
      "Tell a friend or family member where you're going",
      "Arrive and leave with others when possible"
    ]
  },
  {
    icon: Eye,
    title: "Trust Your Instincts",
    description: "If something feels off about an event or person, don't hesitate to leave. Your safety is more important than being polite.",
    tips: [
      "Leave immediately if you feel uncomfortable",
      "Don't feel obligated to stay at any event",
      "Report suspicious behavior to event organizers"
    ]
  },
  {
    icon: Lock,
    title: "Protect Your Personal Information",
    description: "Be cautious about sharing personal details with strangers at events or online.",
    tips: [
      "Don't share your home address with other attendees",
      "Be careful about posting real-time location on social media",
      "Use Eventurer's messaging system instead of personal contact info"
    ]
  },
  {
    icon: Phone,
    title: "Stay Connected",
    description: "Keep your phone charged and maintain communication with trusted contacts throughout the event.",
    tips: [
      "Share your live location with a trusted friend",
      "Keep emergency contacts easily accessible",
      "Have a safety check-in plan with someone"
    ]
  },
  {
    icon: MapPin,
    title: "Plan Your Transportation",
    description: "Arrange safe transportation to and from events, especially late at night.",
    tips: [
      "Use reputable ride-sharing services or public transport",
      "Avoid accepting rides from strangers at events",
      "Have a backup transportation plan ready"
    ]
  },
  {
    icon: AlertTriangle,
    title: "Stay Alert and Aware",
    description: "Be mindful of your surroundings and any potential risks at events.",
    tips: [
      "Don't leave drinks unattended",
      "Stay with your group or buddy",
      "Be aware of emergency exits and safety equipment"
    ]
  }
];

export function SafetyGuidelinesPage({ onNavigate, onGoBack }: SafetyGuidelinesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white">
      <Header currentPage="safety" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-6xl">
        {/* Back Button */}
        <BackButton onClick={onGoBack} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Safety Guidelines
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your safety is our top priority. Follow these guidelines to ensure a safe and enjoyable experience at all events.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Safety Notice</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                While Eventurer strives to provide a safe platform, we cannot guarantee the safety of all events or attendees.
                Please use your best judgment and follow these safety guidelines when attending any event.
                If you encounter an emergency, contact local authorities immediately.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Guidelines Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {guidelines.map((guideline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-50 rounded-xl">
                  <guideline.icon className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900">{guideline.title}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {guideline.description}
              </p>
              <ul className="space-y-2">
                {guideline.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Reporting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Report Safety Concerns
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              If you experience or witness any unsafe behavior, harassment, or concerning activity at an event,
              please report it immediately. We take all reports seriously.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <Phone className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Emergency</h3>
                <p className="text-sm text-gray-600 mb-2">Call local authorities</p>
                <a href="tel:999" className="text-pink-500 font-semibold">999</a>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Shield className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Report to Us</h3>
                <p className="text-sm text-gray-600 mb-2">Contact our support team</p>
                <a href="mailto:eventurer.support@gmail.com" className="text-pink-500 font-semibold text-sm">
                  Email Support
                </a>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Phone className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-sm text-gray-600 mb-2">Speak to our team</p>
                <a href="tel:+6599999999" className="text-pink-500 font-semibold">
                  +65 9999 9999
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            For more information about staying safe at events, visit our{' '}
            <button
              onClick={() => onNavigate('faq')}
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              FAQ page
            </button>
            {' '}or contact our support team.
          </p>
        </motion.div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
