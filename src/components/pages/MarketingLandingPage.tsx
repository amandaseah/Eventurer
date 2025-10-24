import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Heart,
  MapPin,
  MessageSquare,
  Zap,
  Clock,
  Filter,
  Waves,
  Bike,
  Users,
  GraduationCap,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface MarketingLandingPageProps {
  onExplore?: () => void;
  onDemo?: () => void;
}

const features = [
  {
    icon: <Filter className="h-6 w-6" />,
    title: 'Mood-Based Discovery',
    description:
      'Find events that match your vibe — Chill & Relax, Active, Social, or Educational. Smart filters by pricing, date, and popularity.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant RSVP',
    description:
      'Book your spot in just a few clicks with instant confirmation notifications. Stay organized with all your upcoming events.',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Save for Later',
    description:
      "Bookmark events you're interested in and view them anytime. Never miss out with countdown widgets for each saved event.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Integrated Maps',
    description:
      'Get precise locations with nearest bus stops and MRT stations. Interactive maps with real-time directions to arrive on time.',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Event Forums',
    description:
      'Join per-event discussions, ask questions, share tips, and coordinate plans. Upvote key discussions to help the community.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Smart Reminders',
    description:
      'Countdown widgets keep you aware of deadlines. Get timely notifications so you never miss an event you care about.',
  },
];

const moods = [
  {
    name: 'Chill & Relax',
    color: 'bg-blue-100 text-blue-600',
    icon: <Waves className="h-4 w-4" />,
  },
  {
    name: 'Active',
    color: 'bg-green-100 text-green-600',
    icon: <Bike className="h-4 w-4" />,
  },
  {
    name: 'Social',
    color: 'bg-pink-100 text-pink-600',
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: 'Educational',
    color: 'bg-purple-100 text-purple-600',
    icon: <GraduationCap className="h-4 w-4" />,
  },
];

const techStack = ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Shadcn/ui'];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Events', 'Community'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
};

export function MarketingLandingPage({ onExplore, onDemo }: MarketingLandingPageProps) {
  return (
    <div className="min-h-screen relative isolate bg-white">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col">
        <Header onExplore={onExplore} />
        <main className="flex-1">
          <HeroSection onExplore={onExplore} />
          <FeaturesSection />
          <TechSection />
          <CTASection onExplore={onExplore} onDemo={onDemo} />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Header({ onExplore }: { onExplore?: () => void }) {
  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl tracking-tight text-gray-900 font-semibold">Eventurer</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Button
            onClick={() => onExplore?.()}
            className="h-11 rounded-full bg-gray-900 px-6 text-white shadow-md transition-all duration-200 hover:bg-gray-800"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </nav>
  );
}

function HeroSection({ onExplore }: { onExplore?: () => void }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center space-y-8 sm:space-y-10 lg:space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full"
        >
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.3] tracking-tight text-gray-900 px-4">
            <div className="mb-2">Your Journey to</div>
            <div className="my-3">
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              >
                Unforgettable
              </motion.span>
            </div>
            <div className="mt-2">Experiences</div>
          </h1>
        </motion.div>

        <motion.p
          className="max-w-4xl text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-600 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Discover local events tailored to your mood and interests. From wellness retreats to adventure sports, find your
          perfect experience.
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button
            onClick={() => onExplore?.()}
            className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl"
          >
            <Calendar className="h-5 w-5" />
            Explore Events
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-3xl border border-gray-100 bg-white/60 px-6 sm:px-8 py-4 sm:py-6 shadow-lg backdrop-blur-md max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span className="mr-2 text-sm sm:text-base text-gray-500">Choose your mood:</span>
          {moods.map((mood, index) => (
            <motion.div
              key={mood.name}
              className={`${mood.color} flex items-center gap-2 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 transition-all duration-200 hover:shadow-lg text-sm sm:text-base`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.08 }}
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}>
                {mood.icon}
              </motion.div>
              {mood.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <motion.div
        className="mb-16 sm:mb-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-6 sm:mb-8 inline-block max-w-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-gray-900 px-4">
            Why Choose{' '}
            <span 
              style={{
                backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            >
              Eventurer
            </span>
            ?
          </h2>
        </motion.div>
        <motion.p
          className="mx-auto max-w-4xl text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-600 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Powered by modern web technologies including React, Tailwind CSS, and Motion for smooth animations.
        </motion.p>
      </motion.div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden rounded-3xl border border-purple-100 bg-white/60 p-6 sm:p-8 shadow-lg shadow-purple-200/30 backdrop-blur-md transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-purple-200/60">
              <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TechSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <motion.div
        className="mb-12 sm:mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-6 sm:mb-8 inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 px-4">
            Built with{' '}
            <span 
              style={{
                backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            >
              Modern Tech
            </span>
          </h2>
        </motion.div>
        <motion.p
          className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Powered by cutting-edge frameworks and libraries for a seamless, lightning-fast experience.
        </motion.p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech}
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative rounded-3xl border border-purple-100 bg-white/70 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl backdrop-blur-sm">
              <div className="text-center">
                <div className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl">{tech === 'Motion' ? '✨' : tech === 'Tailwind CSS' ? '🎨' : tech === 'Shadcn/ui' ? '🎯' : tech === 'TypeScript' ? '📘' : '⚛️'}</div>
                <div className="text-sm sm:text-base text-gray-900 font-medium">{tech}</div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 transition-all duration-300 group-hover:from-purple-500/5 group-hover:to-pink-500/5" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ onExplore, onDemo }: MarketingLandingPageProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CTAAnimatedBackground />
        <div className="relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.8rem] bg-gradient-to-br from-purple-500 to-pink-500 px-6 sm:px-8 lg:px-16 py-16 sm:py-20 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <motion.div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 sm:px-5 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Start Your Adventure Today</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight px-4">
              Ready to Discover
              <br />
              Your Next Adventure?
            </h2>

            <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 px-4">
              Join thousands of users finding amazing events tailored to their mood. Your perfect experience is just a click away.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onExplore?.()}
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-8 sm:px-10 py-4 sm:py-7 text-base sm:text-lg text-purple-600 shadow-2xl hover:bg-gray-50"
                >
                  <Calendar className="h-5 w-5" />
                  Start Exploring Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => onDemo?.()}
                  className="rounded-full border-2 border-white bg-transparent px-8 sm:px-10 py-4 sm:py-7 text-base sm:text-lg text-white hover:bg-white/10"
                >
                  View Demo
                </Button>
              </motion.div>
            </div>

            <CTAStats />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function CTAStats() {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Events Listed', value: '5K+' },
    { label: 'Happy Reviews', value: '4.9★' },
  ];

  return (
    <motion.div
      className="mx-auto mt-12 sm:mt-16 grid max-w-4xl grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold">{stat.value}</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-white/80">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto border-t border-purple-100 bg-white/40 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 backdrop-blur-sm">
      <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-900 font-semibold">Eventurer</span>
          </div>
          <p className="text-sm leading-6 text-gray-600 max-w-sm">
            Discover events that match your mood and create unforgettable experiences.
          </p>
        </div>

        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h3 className="mb-4 font-semibold text-gray-900">{section}</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-purple-600">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col items-center justify-between gap-4 border-t border-purple-100 pt-6 sm:pt-8 text-sm text-gray-600 sm:flex-row">
        <p>© {new Date().getFullYear()} Eventurer. All rights reserved.</p>
        <div className="flex items-center gap-4 sm:gap-6">
          {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((social) => (
            <a key={social} href="#" className="transition hover:text-purple-600">
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 h-[800px] w-[800px] rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(196, 181, 253, 0.3) 50%, transparent 70%)',
        }}
        animate={{ x: [0, 200, 0], y: [0, 150, 0], scale: [1, 1.4, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 -right-60 h-[700px] w-[700px] rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(251, 207, 232, 0.25) 50%, transparent 70%)',
        }}
        animate={{ x: [0, -150, 0], y: [0, 200, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 h-[600px] w-[600px] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.3) 50%, transparent 70%)',
        }}
        animate={{ x: [0, -120, 0], y: [0, 120, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 h-[750px] w-[750px] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(251, 207, 232, 0.3) 50%, transparent 70%)',
        }}
        animate={{ x: [0, 150, 0], y: [0, -150, 0], scale: [1, 1.35, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, rgba(216, 180, 254, 0.2) 50%, transparent 70%)',
        }}
        animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 h-[450px] w-[450px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.2) 50%, transparent 70%)',
        }}
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function CTAAnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl"
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[...Array(12)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }}
        >
          <Star className="h-4 w-4 fill-white/40 text-white/40" />
        </motion.div>
      ))}
    </div>
  );
}
