import { Twitter, Instagram, Facebook, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const quickLinks = [
  { name: 'Explore Events', page: 'explore' },
  { name: 'Take a Quiz', page: 'mood-quiz' },
  { name: 'Upcoming Events', page: 'profile' },
  { name: 'Past Events', page: 'profile' },
  { name: 'Profile', page: 'profile' },
  { name: 'Settings', page: 'settings' },
];

const resources = [
  { name: 'FAQ', page: 'faq' },
  { name: 'Safety Guidelines', page: 'safety' },
];

const socialIcons = {
  Twitter: Twitter,
  Instagram: Instagram,
  Facebook: Facebook,
};

export default function Footer({ onNavigate }: FooterProps = {}) {
  const handleLinkClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      // Scroll to top of page after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid gap-6 sm:gap-8 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <img src="/favicon.png" alt="Eventurer" className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Eventurer
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-gray-600 max-w-sm mb-4 sm:mb-6">
              Events sorted by how you actually feel. No scrolling through stuff that doesn't fit your vibe.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Made by G6's Group 8</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-xs sm:text-sm text-gray-600 hover:text-pink-500 transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-xs sm:text-sm text-gray-600 hover:text-pink-500 transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="mailto:eventurer.support@gmail.com"
                  className="text-xs sm:text-sm text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>eventurer.support@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6599999999"
                  className="text-xs sm:text-sm text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>+65 9999 9999</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-10 lg:mt-12 flex flex-col items-center justify-between gap-4 sm:gap-6 border-t border-gray-200 pt-6 sm:pt-8 sm:flex-row">
          <p className="text-xs sm:text-sm text-gray-600">
            © {new Date().getFullYear()} Eventurer. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {Object.entries(socialIcons).map(([name, Icon]) => (
              <a
                key={name}
                href="#"
                className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
