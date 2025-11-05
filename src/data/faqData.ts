export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What is Eventurer?",
    answer: "Eventurer is a mood-based event discovery platform that helps you find events matching how you're actually feeling. Take our quick mood quiz to get personalized event recommendations, or explore events by category, location, and date. Whether you're feeling chill, active, social, or want to learn something new, Eventurer connects you with the perfect events without endless scrolling.",
    keywords: ["eventurer", "what", "about", "platform", "app", "service", "website", "is", "description"]
  },
  {
    id: 2,
    question: "How do I create an account?",
    answer: "Click on 'Get Started' from the homepage, then select 'Sign Up'. Fill in your details including email, password, and personal information to create your account.",
    keywords: ["create", "account", "signup", "sign up", "register", "new account", "join"]
  },
  {
    id: 3,
    question: "How does the mood quiz work?",
    answer: "The mood quiz asks you a series of questions about how you're feeling. Based on your answers, we recommend events that match your current mood and preferences.",
    keywords: ["mood", "quiz", "how does", "work", "feeling", "recommendations", "algorithm"]
  },
  {
    id: 4,
    question: "Can I bookmark events?",
    answer: "Yes! Click the bookmark icon on any event card to save it to your bookmarks. You can view all bookmarked events in your profile page.",
    keywords: ["bookmark", "save", "favorite", "mark", "remember", "keep", "saved events"]
  },
  {
    id: 5,
    question: "How do I RSVP to an event?",
    answer: "Open the event details page and click the 'RSVP' button. Your RSVP will be saved and you can view all your RSVPed events in your profile.",
    keywords: ["rsvp", "attend", "join", "going", "register event", "sign up event"]
  },
  {
    id: 6,
    question: "How do I change my password?",
    answer: "Go to Settings from the navigation menu, scroll to the Security section, and click 'Change Password'. Follow the prompts to update your password.",
    keywords: ["password", "change", "reset", "forgot", "update password", "security"]
  },
  {
    id: 7,
    question: "How do I update my profile information?",
    answer: "Navigate to your Profile page by clicking on your profile icon. Click 'Edit Profile' to update your name, bio, and other personal information.",
    keywords: ["profile", "edit", "update", "change", "personal info", "account info", "name"]
  },
  {
    id: 8,
    question: "What types of events are available?",
    answer: "We offer a wide variety of events including concerts, workshops, sports, social gatherings, cultural events, and more. Use the explore page to browse all categories.",
    keywords: ["events", "types", "categories", "what kind", "variety", "options", "available"]
  },
  {
    id: 9,
    question: "How do I search for specific events?",
    answer: "Use the search bar on the Explore page to search for events by name, category, or location. You can also filter events by date, mood, or category.",
    keywords: ["search", "find", "look for", "filter", "explore", "browse"]
  },
  {
    id: 10,
    question: "Can I see event locations on a map?",
    answer: "Yes! Each event details page includes an interactive map showing the event location. You can also get directions directly from the map.",
    keywords: ["map", "location", "where", "directions", "address", "place", "venue"]
  },
  {
    id: 11,
    question: "How do I contact event organizers?",
    answer: "Event details pages include organizer contact information when available. You can also join the event forum to ask questions and connect with other attendees.",
    keywords: ["contact", "organizer", "host", "reach", "message", "communicate"]
  },
  {
    id: 12,
    question: "What is the event forum?",
    answer: "The event forum is a discussion space for each event where attendees can ask questions, share information, and connect with other attendees.",
    keywords: ["forum", "discussion", "chat", "talk", "community", "comments", "posts"]
  },
  {
    id: 13,
    question: "How do I delete my account?",
    answer: "Go to Settings, scroll to the Account Management section, and click 'Delete Account'. Please note this action is permanent and cannot be undone.",
    keywords: ["delete", "remove", "close", "deactivate", "account", "cancel"]
  },
  {
    id: 14,
    question: "Is my personal information safe?",
    answer: "Yes, we take your privacy seriously. Your data is encrypted and stored securely. We never share your personal information with third parties without your consent. Read our Safety Guidelines for more information.",
    keywords: ["safe", "privacy", "security", "data", "personal", "information", "protected"]
  },
  {
    id: 15,
    question: "Can I cancel my RSVP?",
    answer: "Yes, you can cancel your RSVP anytime before the event. Go to the event details page and click 'Cancel RSVP', or manage it from your profile page.",
    keywords: ["cancel", "rsvp", "remove", "undo", "not going", "change mind"]
  },
  {
    id: 16,
    question: "How do I get notifications about events?",
    answer: "Enable notifications in your Settings under the Notifications section. You can choose to receive alerts for upcoming events, new recommendations, and event updates.",
    keywords: ["notifications", "alerts", "reminders", "updates", "notify", "email"]
  },
  {
    id: 17,
    question: "What if I forgot my password?",
    answer: "On the login page, click 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password.",
    keywords: ["forgot", "password", "reset", "can't login", "locked out", "recover"]
  },
  {
    id: 18,
    question: "How do I logout?",
    answer: "Click on your profile icon in the navigation bar, then select 'Settings'. Scroll down to find the 'Logout' button.",
    keywords: ["logout", "log out", "sign out", "exit", "leave"]
  },
  {
    id: 19,
    question: "Can I share events with friends?",
    answer: "Yes! Each event has a share button that allows you to share the event link via social media, email, or copy the link directly.",
    keywords: ["share", "send", "invite", "friends", "social", "link"]
  },
  {
    id: 20,
    question: "Are there any fees to use Eventurer?",
    answer: "Eventurer is completely free to use. However, individual events may have their own ticket prices or registration fees set by the organizers.",
    keywords: ["free", "cost", "price", "fee", "pay", "money", "charge"]
  },
  {
    id: 21,
    question: "How do I report inappropriate content?",
    answer: "If you see inappropriate content in event forums or elsewhere, click the report button (flag icon) next to the content. Our team will review it promptly.",
    keywords: ["report", "inappropriate", "flag", "abuse", "spam", "violation"]
  },
  {
    id: 22,
    question: "Where can I see my upcoming events?",
    answer: "Go to your Profile page and look for the 'Upcoming Events' tab. This shows all events you've RSVP'd to that haven't happened yet. You can quickly access your profile by clicking your profile icon in the navigation bar.",
    keywords: ["upcoming", "events", "profile", "rsvp", "future", "scheduled", "coming"]
  },
  {
    id: 23,
    question: "How do I view my bookmarked events?",
    answer: "Visit your Profile page and click on the 'Bookmarked' tab. Here you'll find all the events you've saved for later. You can bookmark events by clicking the bookmark icon on any event card.",
    keywords: ["bookmarked", "saved", "view", "see", "find", "favorites", "profile"]
  },
  {
    id: 25,
    question: "What's the difference between bookmarking and RSVPing?",
    answer: "Bookmarking saves an event for later viewing - think of it as adding to your 'want to check out' list. RSVPing means you're confirming your attendance and the event will appear in your Upcoming Events. You can do both for the same event!",
    keywords: ["bookmark", "rsvp", "difference", "versus", "save", "attend"]
  },
  {
    id: 26,
    question: "Can I remove an event from my bookmarks?",
    answer: "Yes! Click the bookmark icon again on any bookmarked event to remove it. You can do this from the event card on any page, or from your Bookmarked tab in your profile.",
    keywords: ["remove", "bookmark", "delete", "unbookmark", "unsave"]
  },
  {
    id: 27,
    question: "How do I access the event forum?",
    answer: "Open any event's details page and click on the 'Discussion' or 'Forum' tab. Here you can read comments from other attendees, ask questions, and share information about the event.",
    keywords: ["forum", "discussion", "access", "find", "comments", "chat"]
  },
  {
    id: 28,
    question: "Can I post in the event forum?",
    answer: "Yes! Once you're on an event's forum page, you'll find a text box at the bottom where you can write your comment or question. You can also upload images to share with other attendees.",
    keywords: ["post", "comment", "write", "forum", "discussion", "reply"]
  },
  {
    id: 29,
    question: "How does the mood quiz help me find events?",
    answer: "The mood quiz asks about your current feelings and preferences. Based on your answers, we match you with events that fit your vibe - whether you're feeling chill, active, social, or want to learn something new. It's a personalized way to discover events without endless scrolling.",
    keywords: ["mood", "quiz", "help", "find", "works", "personalized", "match"]
  },
  {
    id: 30,
    question: "Can I retake the mood quiz?",
    answer: "Absolutely! Your mood changes, so take the quiz whenever you want fresh recommendations. Just go to the landing page or click 'Take a Quiz' from the navigation menu.",
    keywords: ["retake", "quiz", "again", "redo", "mood", "new"]
  },
  {
    id: 31,
    question: "How do I see all events in a specific category?",
    answer: "Visit the Explore Events page where you can filter events by category, date, location, and mood. Use the category dropdown to see events like concerts, workshops, sports, or social gatherings.",
    keywords: ["category", "filter", "type", "specific", "sort", "explore"]
  },
  {
    id: 32,
    question: "Can I search for events by location?",
    answer: "Yes! On the Explore Events page, use the location filter to find events near you or in a specific area. You can also view event locations on an interactive map from each event's details page.",
    keywords: ["location", "search", "near", "area", "place", "where", "map"]
  },
  {
    id: 33,
    question: "What information is shown on my profile?",
    answer: "Your profile displays your name, email, join date, and two tabs: Bookmarked events (events you've saved) and Upcoming Events (events you've RSVP'd to). You can also access Settings from your profile.",
    keywords: ["profile", "information", "shows", "display", "contains", "about"]
  },
  {
    id: 34,
    question: "How do I change my profile information?",
    answer: "Click on Settings from your profile or navigation menu. Here you can update your first name, last name, and other account details. Note that your email address cannot be changed for security reasons.",
    keywords: ["change", "edit", "update", "profile", "information", "details"]
  },
  {
    id: 35,
    question: "What does the countdown widget show?",
    answer: "The countdown widget at the bottom of your screen shows your next upcoming event. It displays how much time is left until the event starts. If you don't have any upcoming events, it shows popular events happening soon.",
    keywords: ["countdown", "widget", "shows", "timer", "next", "upcoming"]
  },
  {
    id: 36,
    question: "Can I get directions to an event?",
    answer: "Yes! Open an event's details page and look for the 'How to Get There' section. You'll see an interactive map with the event location, and you can get MRT/bus directions or open the location in your maps app.",
    keywords: ["directions", "navigate", "map", "route", "travel", "location"]
  },
  {
    id: 37,
    question: "Are events free to attend?",
    answer: "Event pricing varies. Some events are completely free, while others may have ticket fees. Check the event details page for specific pricing information. Eventurer itself is free to use.",
    keywords: ["free", "price", "cost", "ticket", "fee", "attend"]
  },
  {
    id: 38,
    question: "How do I know if an event is happening soon?",
    answer: "Event cards show the date and time. Events happening soon will also appear in your countdown widget if you've RSVP'd. You can sort events by date on the Explore page to see what's coming up.",
    keywords: ["soon", "when", "date", "time", "schedule", "happening"]
  },
  {
    id: 39,
    question: "Can I invite friends to events?",
    answer: "Yes! Each event has a share button that lets you send the event link to friends via social media, email, or by copying the link. They can then view the event and RSVP themselves.",
    keywords: ["invite", "friends", "share", "send", "recommend"]
  },
  {
    id: 40,
    question: "What happens if I RSVP to an event?",
    answer: "When you RSVP to an event, it's added to your Upcoming Events in your profile. You'll see it in the countdown widget, and you can access the event forum to connect with other attendees. You can cancel your RSVP anytime.",
    keywords: ["rsvp", "happens", "what", "after", "confirm", "register"]
  },
  {
    id: 41,
    question: "How do I find events that match my interests?",
    answer: "Use the mood quiz for personalized recommendations, or browse the Explore page where you can filter by category, mood, and date. You can also search for specific keywords or event types.",
    keywords: ["interests", "match", "find", "preferences", "like", "recommend"]
  },
  {
    id: 42,
    question: "What does the FAQ chatbot do?",
    answer: "The FAQ chatbot is your instant help assistant! Click the pink chat button at the bottom right of your screen and type any question. It searches our FAQ database using smart keyword matching to find relevant answers quickly. Instead of scrolling through all FAQs, just ask your question naturally and get instant answers.",
    keywords: ["chatbot", "faq", "assistant", "help", "bot", "chat", "questions", "answers", "support"]
  }
];

// Keyword matching function
export function searchFAQ(query: string): FAQItem[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  // Common filler words to ignore
  const stopWords = new Set(['how', 'do', 'i', 'can', 'what', 'is', 'the', 'a', 'an', 'to', 'my', 'in', 'on', 'for', 'with', 'does', 'are', 'there', 'about']);

  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Score each FAQ item based on keyword matches
  const scoredResults = faqData.map(item => {
    let score = 0;
    const lowerQuestion = item.question.toLowerCase();
    const lowerAnswer = item.answer.toLowerCase();

    // Exact question match - very high score
    if (lowerQuestion === normalizedQuery) {
      score += 100;
    }

    // Question contains full query - high score
    if (lowerQuestion.includes(normalizedQuery)) {
      score += 50;
    }

    // Check each meaningful query word
    queryWords.forEach(word => {
      // Keyword exact match - high score
      item.keywords.forEach(keyword => {
        if (keyword === word) {
          score += 10;
        } else if (keyword.includes(word) || word.includes(keyword)) {
          score += 5;
        }
      });

      // Question word match - medium score
      if (lowerQuestion.includes(word)) {
        score += 3;
      }

      // Answer word match - low score
      if (lowerAnswer.includes(word)) {
        score += 1;
      }
    });

    return { item, score };
  });

  // Filter results with meaningful score and sort by score
  const sortedResults = scoredResults
    .filter(result => result.score >= 3) // Require minimum relevance
    .sort((a, b) => b.score - a.score);

  // Only return results that are close to the top score
  // This prevents showing irrelevant results just to fill the list
  if (sortedResults.length === 0) return [];

  const topScore = sortedResults[0].score;

  // Return only results that are at least 40% as good as the top result
  // This ensures we only show truly relevant matches
  return sortedResults
    .filter(result => result.score >= topScore * 0.4)
    .slice(0, 3) // Max 3 results
    .map(result => result.item);
}
