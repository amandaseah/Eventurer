export const moods = [
  { id: 'chill', name: 'Chill & Relax', emoji: '🌿', color: '#c3ffd4' },
  { id: 'active', name: 'Active', emoji: '⚡', color: '#ffd4c3' },
  { id: 'social', name: 'Social', emoji: '🎉', color: '#ffc3e4' },
  { id: 'educational', name: 'Educational', emoji: '📚', color: '#c3e4ff' },
];

export const quizQuestions = [
  {
    id: 1,
    question: "How do you want to feel after this event?",
    options: [
      { text: "Energized and pumped", mood: 'active' },
      { text: "Relaxed and peaceful", mood: 'chill' },
      { text: "Connected with others", mood: 'social' },
      { text: "Inspired and informed", mood: 'educational' },
    ],
  },
  {
    id: 2,
    question: "What's your ideal group size?",
    options: [
      { text: "Just me or a close friend", mood: 'chill' },
      { text: "Small group (3-10 people)", mood: 'educational' },
      { text: "Medium group (10-30 people)", mood: 'active' },
      { text: "The more the merrier!", mood: 'social' },
    ],
  },
  {
    id: 3,
    question: "Pick an activity:",
    options: [
      { text: "Yoga or meditation", mood: 'chill' },
      { text: "Sports or hiking", mood: 'active' },
      { text: "Party or networking", mood: 'social' },
      { text: "Workshop or lecture", mood: 'educational' },
    ],
  },
];

export type EventData = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  price: string;
  organizer: string;
  mood: string;
  category: string;
  saves: number;
  deadline: string;
  isPast: boolean;
  userComment?: string;
  mapLocation?: {
    lat: number;
    lng: number;
    address?: string;
    query?: string;
  };
};

export const events: EventData[] = [
  {
    id: 1,
    title: "Sunset Yoga by the Bay",
    description: "Join us for a peaceful yoga session as the sun sets over the bay. All levels welcome!",
    imageUrl: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwYmVhY2h8ZW58MXx8fHwxNzU5ODEzNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-15",
    time: "18:00",
    location: "Marina Bay",
    mapLocation: {
      lat: 1.2834,
      lng: 103.8607,
      address: "Marina Bay Sands Event Plaza, 10 Bayfront Ave, Singapore 018956",
    },
    price: "Free",
    organizer: "Wellness Warriors",
    mood: 'chill',
    category: "Chill & Relax",
    saves: 142,
    deadline: "2025-10-14",
    isPast: false,
  },
  {
    id: 2,
    title: "Night Trail Run",
    description: "Experience the thrill of running under the stars on our scenic trail routes.",
    imageUrl: "https://images.unsplash.com/photo-1552993873-0dd1110e025f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHJ1bm5pbmclMjB0cmFpbHxlbnwxfHx8fDE3NTk4MTM2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-18",
    time: "20:00",
    location: "MacRitchie Reservoir",
    mapLocation: {
      lat: 1.3446,
      lng: 103.8345,
      address: "MacRitchie Reservoir Park, 181 Lornie Rd, Singapore 298734",
    },
    price: "$15",
    organizer: "Trail Blazers SG",
    mood: 'active',
    category: "Active",
    saves: 89,
    deadline: "2025-10-16",
    isPast: false,
  },
  {
    id: 3,
    title: "Tech Startup Networking Mixer",
    description: "Meet fellow entrepreneurs, developers, and investors in Singapore's tech scene.",
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwZXZlbnQlMjBwZW9wbGV8ZW58MXx8fHwxNzU5NzI5NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-20",
    time: "19:00",
    location: "Startup Hub, One-North",
    mapLocation: {
      lat: 1.2989,
      lng: 103.7873,
      address: "LaunchPad @ one-north, 79 Ayer Rajah Crescent, Singapore 139955",
    },
    price: "$20",
    organizer: "TechConnect SG",
    mood: 'social',
    category: "Social",
    saves: 203,
    deadline: "2025-10-19",
    isPast: false,
  },
  {
    id: 4,
    title: "Introduction to AI & Machine Learning",
    description: "Learn the fundamentals of AI and ML in this hands-on workshop for beginners.",
    imageUrl: "https://images.unsplash.com/photo-1646583288948-24548aedffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwd29ya3Nob3B8ZW58MXx8fHwxNzU5ODEzNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-22",
    time: "14:00",
    location: "National Library",
    mapLocation: {
      lat: 1.2976,
      lng: 103.8486,
      address: "National Library Building, 100 Victoria St, Singapore 188064",
    },
    price: "$30",
    organizer: "CodeCraft Academy",
    mood: 'educational',
    category: "Educational",
    saves: 156,
    deadline: "2025-10-20",
    isPast: false,
  },
  {
    id: 5,
    title: "Weekend Art Jam",
    description: "Bring your art supplies and create alongside other artists in a relaxed setting.",
    imageUrl: "https://images.unsplash.com/photo-1649479117144-49ae67b86632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMHN0dWRpb3xlbnwxfHx8fDE3NTk3NzEzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-09-25",
    time: "10:00",
    location: "Gillman Barracks",
    mapLocation: {
      lat: 1.2764,
      lng: 103.8057,
      address: "Gillman Barracks, 9 Lock Rd, Singapore 108937",
    },
    price: "Free",
    organizer: "Creative Collective",
    mood: 'chill',
    category: "Chill & Relax",
    saves: 98,
    deadline: "2025-09-24",
    isPast: true,
    userComment: "Such a relaxing afternoon! Met so many talented artists and got inspired to continue painting.",
  },
  {
    id: 6,
    title: "Salsa Dance Night",
    description: "Dance the night away with live music, beginner lessons, and social dancing!",
    imageUrl: "https://images.unsplash.com/photo-1731596152971-26fb19c427bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxzYSUyMGRhbmNpbmclMjBwYXJ0eXxlbnwxfHx8fDE3NTk4MTM2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-09-15",
    time: "20:00",
    location: "The Substation",
    mapLocation: {
      lat: 1.2965,
      lng: 103.8499,
      address: "The Substation (Armenian Street), 45 Armenian St, Singapore 179936",
    },
    price: "$25",
    organizer: "Latino Vibes SG",
    mood: 'social',
    category: "Social",
    saves: 187,
    deadline: "2025-09-14",
    isPast: true,
    userComment: "Amazing energy! The instructors were patient and everyone was so friendly. Can't wait for the next one!",
  },
  {
    id: 7,
    title: "Photography Walk: Heritage Tour",
    description: "Explore Singapore's heritage districts while learning photography techniques.",
    imageUrl: "https://images.unsplash.com/photo-1608005347570-57faf05a5aa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBoZXJpdGFnZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTk4MTM2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-27",
    time: "09:00",
    location: "Chinatown",
    mapLocation: {
      lat: 1.2839,
      lng: 103.8441,
      address: "Chinatown Visitor Centre, 2 Banda St, Singapore 059962",
    },
    price: "$18",
    organizer: "Shutter Stories",
    mood: 'educational',
    category: "Educational",
    saves: 124,
    deadline: "2025-10-26",
    isPast: false,
  },
  {
    id: 8,
    title: "Rock Climbing Challenge",
    description: "Test your limits with our indoor rock climbing challenge. Equipment provided!",
    imageUrl: "https://images.unsplash.com/photo-1517599652-86163851f0de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBpbmRvb3J8ZW58MXx8fHwxNzU5ODEzNjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2025-10-28",
    time: "16:00",
    location: "Climb Central",
    mapLocation: {
      lat: 1.2934,
      lng: 103.8537,
      address: "Climb Central Funan, 107 North Bridge Rd, #B2-19 Funan, Singapore 179105",
    },
    price: "$35",
    organizer: "Vertical Ventures",
    mood: 'active',
    category: "Active",
    saves: 76,
    deadline: "2025-10-27",
    isPast: false,
  },
];

export const forumPosts = [
  {
    id: 1,
    eventId: 1,
    username: "YogaEnthusiast22",
    timestamp: "2 hours ago",
    comment: "Is this suitable for complete beginners? I've never done yoga before.",
    upvotes: 15,
  },
  {
    id: 2,
    eventId: 1,
    username: "WellnessWarrior",
    timestamp: "1 hour ago",
    comment: "Absolutely! We welcome all levels. Our instructor will provide modifications.",
    upvotes: 23,
  },
  {
    id: 3,
    eventId: 1,
    username: "BayAreaLocal",
    timestamp: "45 minutes ago",
    comment: "The sunset view from this spot is absolutely stunning. Don't miss it!",
    upvotes: 31,
  },
  {
    id: 4,
    eventId: 2,
    username: "NightRunner",
    timestamp: "3 hours ago",
    comment: "What's the difficulty level of the trail?",
    upvotes: 8,
  },
  {
    id: 5,
    eventId: 2,
    username: "TrailGuide",
    timestamp: "2 hours ago",
    comment: "Moderate difficulty. About 8km with some elevation changes.",
    upvotes: 12,
  },
];

export const generalDiscussions = [
  {
    id: 1,
    username: "EventExplorer",
    timestamp: "1 day ago",
    comment: "What are the best events for meeting new people in Singapore?",
    upvotes: 42,
  },
  {
    id: 2,
    username: "SocialButterfly",
    timestamp: "23 hours ago",
    comment: "Networking mixers and group activities are great! I recommend checking out the social events category.",
    upvotes: 28,
  },
  {
    id: 3,
    username: "TechieInSG",
    timestamp: "18 hours ago",
    comment: "The tech meetups are amazing for both learning and networking.",
    upvotes: 35,
  },
];
