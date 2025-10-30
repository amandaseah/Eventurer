import { motion } from 'motion/react';
import { Twitter, Instagram, Facebook, Linkedin, Heart } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Events', 'Community'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
};

const socialIcons = {
  Twitter: Twitter,
  Instagram: Instagram,
  Facebook: Facebook,
  LinkedIn: Linkedin,
};

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 opacity-60" />

      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-3xl opacity-20" />

      <div className="relative border-t border-purple-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <motion.div
                className="mb-4 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur-sm opacity-50" />
                  <img src="/favicon.png" alt="Eventurer" className="relative h-10 w-10 rounded-xl" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Eventurer
                </span>
              </motion.div>
              <p className="text-sm leading-6 text-gray-600 max-w-sm mb-6">
                Discover events that match your mood and create unforgettable experiences.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
                <span>for event lovers</span>
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="mb-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">
                  {section}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-200"
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-6 border-t border-purple-200/50 pt-8 sm:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Eventurer. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {Object.entries(socialIcons).map(([name, Icon]) => (
                <motion.a
                  key={name}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                  <Icon className="relative w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
