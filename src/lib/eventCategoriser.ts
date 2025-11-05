type Mood = 'chill' | 'active' | 'social' | 'educational';

const CATEGORY_KEYWORDS = {
  chill: [
    'yoga', 'meditation', 'spa', 'wellness', 'mindfulness', 'relax',
    'calm', 'peaceful', 'zen', 'massage', 'art', 'painting', 'pottery',
    'craft', 'garden', 'nature walk', 'sunset', 'acoustic', 'jazz'
  ],
  active: [
    'run', 'marathon', 'fitness', 'gym', 'sports', 'hiking', 'climbing',
    'cycling', 'workout', 'training', 'dance', 'zumba', 'bootcamp',
    'crossfit', 'basketball', 'soccer', 'tennis', 'swim', 'triathlon',
    'adventure', 'outdoor', 'trail', 'bike', 'kayak'
  ],
  social: [
    'networking', 'mixer', 'party', 'meetup', 'happy hour', 'brunch',
    'dinner', 'social', 'community', 'gathering', 'celebration',
    'festival', 'concert', 'live music', 'nightlife', 'club',
    'singles', 'dating', 'friends', 'meet', 'mingle'
  ],
  educational: [
    'workshop', 'seminar', 'conference', 'lecture', 'class', 'course',
    'training', 'learning', 'education', 'tutorial', 'bootcamp',
    'coding', 'programming', 'tech', 'startup', 'business',
    'professional', 'career', 'skill', 'development', 'certification',
    'teach', 'study', 'academic', 'science', 'research'
  ],
};

const EVENTBRITE_CATEGORY_MAPPING: Record<string, Mood> = {
  'Health & Wellness': 'chill',
  'Sports & Fitness': 'active',
  'Music': 'social',
  'Food & Drink': 'social',
  'Community & Culture': 'social',
  'Business & Professional': 'educational',
  'Science & Technology': 'educational',
  'Education': 'educational',
  'Film, Media & Entertainment': 'social',
  'Performing & Visual Arts': 'chill',
  'Fashion & Beauty': 'social',
  'Charity & Causes': 'social',
  'Government & Politics': 'educational',
  'Spirituality': 'chill',
  'Family & Education': 'educational',
  'Travel & Outdoor': 'active',
  'Hobbies & Special Interest': 'chill',
};

export function categorizeEvent(
  title: string,
  description: string,
  eventbriteCategory?: string
): { mood: Mood; category: string } {
  const text = `${title} ${description}`.toLowerCase();
  
  // First, check Eventbrite category mapping
  if (eventbriteCategory && EVENTBRITE_CATEGORY_MAPPING[eventbriteCategory]) {
    const mood = EVENTBRITE_CATEGORY_MAPPING[eventbriteCategory];
    return { mood, category: getCategoryName(mood) };
  }

  // Score each category
  const scores: Record<Mood, number> = {
    chill: 0,
    active: 0,
    social: 0,
    educational: 0,
  };

  // Count keyword matches
  for (const [mood, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[mood as Mood] += 1;
      }
    }
  }

  // Find highest scoring category
  let maxScore = 0;
  let selectedMood: Mood = 'social'; // default

  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedMood = mood as Mood;
    }
  }

  // If no matches, use intelligent defaults based on common patterns
  if (maxScore === 0) {
    if (text.includes('learn') || text.includes('how to')) {
      selectedMood = 'educational';
    } else if (text.includes('meet') || text.includes('connect')) {
      selectedMood = 'social';
    } else if (text.includes('physical') || text.includes('exercise')) {
      selectedMood = 'active';
    }
  }

  return {
    mood: selectedMood,
    category: getCategoryName(selectedMood),
  };
}

function getCategoryName(mood: Mood): string {
  const names = {
    chill: 'Chill & Relax',
    active: 'Active',
    social: 'Social',
    educational: 'Educational',
  };
  return names[mood];
}