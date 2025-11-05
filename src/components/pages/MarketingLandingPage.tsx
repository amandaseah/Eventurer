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
import Footer from '../shared/Footer';

const TECH_ICONS: Record<string, string> = {
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  'Motion': 'https://cdn.worldvectorlogo.com/logos/framer-motion.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Stripe': '/logos/stripe.png',
  'Google Maps API': '/logos/google-maps.png',
  'Three.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
};

interface MarketingLandingPageProps {
  onExplore?: () => void;
}

const APPLE_FONT = "'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif";

const features = [
  {
    icon: <Filter className="h-6 w-6" />,
    title: 'Your Mood = Your Feed',
    description:
      'Feeling introverted? Get quiet art workshops. Want chaos? Here are the wildest parties. Events sorted by how you actually feel.',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'No More "Where Is This?"',
    description:
      'Every event shows you the nearest bus stop and MRT station. One tap to Google Maps. Actually get there on time.',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Talk to People Going',
    description:
      'Ask questions before you commit. See who else is going. Make plans. Way better than showing up alone and awkward.',
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
    color: 'bg-pink-200 text-pink-500',
    icon: <GraduationCap className="h-4 w-4" />,
  },
];

const techStack = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Motion',
  'Firebase',
  'Stripe',
  'Google Maps API',
  'Three.js',
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 20, mass: 0.9 },
  },
};

export function MarketingLandingPage({ onExplore }: MarketingLandingPageProps) {
  return (
    <div
      className="min-h-screen relative isolate text-gray-900"
      style={{
        fontFamily: APPLE_FONT,
        background: 'linear-gradient(180deg, #fff7fb 0%, #ffeef6 55%, #ffffff 100%)',
      }}
    >
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col">
        <Header onExplore={onExplore} />
        <main className="flex-1">
          <HeroSection onExplore={onExplore} />
          <FeaturesSection />
          <TechSection />
          <CTASection onExplore={onExplore} />
        </main>
        <Footer onNavigate={() => onExplore?.()} />
      </div>
    </div>
  );
}

function Header({ onExplore }: { onExplore?: () => void }) {
  return (
    <nav className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6 sm:py-10">
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/favicon.png" alt="Eventurer" className="h-10 w-10 rounded-2xl" />
          <span className="text-lg sm:text-xl tracking-tight text-gray-900 font-medium">
            Eventurer
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <Button
            onClick={() => onExplore?.()}
            className="h-11 rounded-full bg-gray-900/95 px-6 text-sm sm:text-base text-white shadow-sm transition-all duration-200 hover:bg-black/90 focus-visible:ring-0"
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
    <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center space-y-8 sm:space-y-10 lg:space-y-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          className="w-full"
        >
          <h1 className="text-[2.6rem] sm:text-[3.2rem] md:text-[3.6rem] lg:text-[4rem] leading-[1.1] tracking-tight text-gray-900 px-2 font-light">
            <span className="block mb-2">Mood-matched plans</span>
            <motion.span
              className="block font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.85 }}
              transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.18 }}
            >
              for how you're feeling now
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          className="max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-gray-600 px-2 font-normal"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.75 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.12 }}
        >
          Eventurer feels the vibe with you. Set your mood and we surface the experiences that fit
          this exact moment—no endless scrolling, just instant yes-this energy.
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.7 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.2 }}
        >
          <Button
            onClick={() => onExplore?.()}
            className="group flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-black/90 hover:shadow-md"
          >
            <Calendar className="h-5 w-5" />
            Browse Events
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-[40px] border border-gray-200/80 bg-white/70 px-6 sm:px-8 py-4 sm:py-5 shadow-sm backdrop-blur-md max-w-4xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.7 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.28 }}
        >
          <span className="mr-2 text-sm sm:text-base text-gray-500">Choose your mood:</span>
          {moods.map((mood, index) => (
            <motion.div
              key={mood.name}
              className={`${mood.color} flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 hover:shadow-md text-sm sm:text-base font-medium`}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.7 }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.32 + index * 0.08 }}
              whileHover={{ y: -2, scale: 1.03 }}
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
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-rose-50/60 to-white pointer-events-none" />
      <div className="relative w-full max-w-6xl mx-auto">
        <motion.div
          className="mb-14 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.55 }}
          transition={{ type: 'spring', stiffness: 85, damping: 22 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 shadow-sm shadow-pink-100/60"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            Designed around how you live
          </motion.span>
          <h2 className="mt-5 text-4xl sm:text-5xl md:text-[3.2rem] font-light text-gray-900 tracking-tight">
            More than a list of events. A personalised planner.
          </h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-600"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 }}
          >
            Discover, plan, and share experiences that match your energy today—not last week.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 90, damping: 20, delay: index * 0.08 }}
            >
              <Card
                className="group relative h-full rounded-[28px] border border-white/18 bg-white/12 p-6 sm:p-7 shadow-[0_32px_72px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_44px_96px_rgba(15,23,42,0.2)] overflow-hidden"
                style={{
                  backdropFilter: 'blur(30px)',
                  backgroundImage: 'linear-gradient(150deg, rgba(255,255,255,0.65), rgba(244,244,255,0.28))',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(120% 120% at 25% 18%, rgba(244,114,182,0.18), transparent 65%)' }}
                />
                <div className="inline-flex items-center justify-center rounded-2xl bg-pink-400 p-3 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20">
      <motion.div
        className="mb-12 sm:mb-16 text-center"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ type: 'spring', stiffness: 85, damping: 22 }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-[3.2rem] font-light text-gray-900 tracking-tight">
          Built with tools we trust every day.
        </h2>
        <motion.p
          className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-gray-600"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 }}
        >
          From realtime Firebase sync to motion-driven UI, the stack behind Eventurer makes the
          experience feel instant and responsive.
        </motion.p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech}
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 95, damping: 18, delay: index * 0.08 }}
          >
            <div
              className="relative rounded-[26px] border border-white/18 bg-white/12 p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_82px_rgba(15,23,42,0.2)] backdrop-blur-[32px] overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.6), rgba(244,248,255,0.32))',
                boxShadow: '0 26px 74px rgba(15,23,42,0.16)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(115% 115% at 22% 18%, rgba(244,114,182,0.2), transparent 62%)' }}
              />
              <div className="relative text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <img
                    src={TECH_ICONS[tech] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'}
                    alt={tech}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  />
                </div>
                <div className="text-sm sm:text-base text-gray-900 font-medium">{tech}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ onExplore }: MarketingLandingPageProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-20 sm:py-24">
      <motion.div
        className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/85 px-6 sm:px-10 py-14 sm:py-16 shadow-[0_30px_70px_rgba(15,15,18,0.12)] backdrop-blur-2xl"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ type: 'spring', stiffness: 85, damping: 22 }}
      >
        <motion.div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-28 -right-12 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl"
            animate={{ scale: [1, 1.1, 0.95], opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-18%] left-[12%] h-72 w-72 rounded-full bg-fuchsia-200/20 blur-[120px]"
            animate={{ scale: [1, 1.08, 0.98], opacity: [0.1, 0.22, 0.1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
          <div className="absolute inset-0 rounded-[36px] border border-white/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.15 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-[2.7rem] font-semibold tracking-tight px-2 max-w-3xl mx-auto text-center text-gray-900">
            Ready to find your next event?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-600 px-2">
            Set your mood, get a shortlist, and go. Eventurer curates the experiences worth your time.
          </p>

          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={() => onExplore?.()}
                className="group flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 sm:px-10 py-3.5 text-sm sm:text-base font-medium text-white shadow-[0_14px_32px_rgba(17,17,20,0.2)] transition-colors hover:bg-black/85"
              >
                <Calendar className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Browse Events
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          </div>

          <CTAStats />
        </motion.div>
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
      className="mx-auto mt-12 sm:mt-14 grid max-w-4xl grid-cols-3 gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.25 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 95, damping: 18, delay: 0.3 + index * 0.08 }}
        >
          <div className="text-2xl sm:text-3xl text-gray-900 font-medium tracking-tight">{stat.value}</div>
          <div className="mt-1 text-xs sm:text-sm text-gray-500">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff7fb] via-[#ffeef6] to-[#fffdfd]" />

      <motion.div
        className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-rose-200/25 blur-3xl"
        animate={{ x: [0, 60, -20], y: [0, 40, -30], scale: [1, 1.1, 0.95] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-12 right-[-15%] h-[600px] w-[600px] rounded-full bg-pink-200/30 blur-[120px]"
        animate={{ x: [0, -70, 20], y: [0, 50, -40], scale: [1.05, 0.95, 1.08] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      />

      <motion.div
        className="absolute bottom-[-20%] left-1/4 h-[700px] w-[700px] rounded-full bg-rose-300/20 blur-[140px]"
        animate={{ x: [0, 50, -40], y: [0, -60, 30], scale: [1, 1.12, 0.98] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 h-[340px] w-[340px] rounded-full bg-white/40 blur-[90px]"
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.1, 0.96] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-1/4 left-[15%] h-[280px] w-[280px] rounded-full bg-[#ffd5e6]/35 blur-[80px]"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 0.94] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
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
