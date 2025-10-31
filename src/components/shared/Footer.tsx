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
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <img src="/favicon.png" alt="Eventurer" className="h-10 w-10 rounded-xl" />
              <span className="text-xl font-bold text-gray-900">
                Eventurer
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-600 max-w-sm mb-6">
              Events sorted by how you actually feel. No scrolling through stuff that doesn't fit your vibe.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Made by G6's Group 8</span>
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              
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
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Eventurer. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {Object.entries(socialIcons).map(([name, Icon]) => (
              <a
                key={name}
                href="#"
                className="p-2 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
              >
                <Icon className="w-4 h-4 text-gray-600" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
