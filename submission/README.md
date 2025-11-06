# Eventurer  ✨
Eventurer is a mood-based web app that helps people discover events in Singapore, book tickets, and plan how to get there. Supports secure Stripe payments for paid events. Deployed on `https://eventurer-zeta.vercel.app/`

## Features 🆒
🎮 Interactive quiz to ascertain user mood and recommend events accordingly  
📖 View detailed event info (time, location, description)  
📍 Google Maps API integration to plan routes and get directions  
🔎 Filter events by category, date, price, popularity, and more  
🔖 RSVP to events or bookmark/save them for later  
🗯️ Event-specific discussion forums for users to interact  
💰 Stripe payment gateway for paid event checkout, with generated invoices  

## Tech Stack  💻
- **Frontend:** TypeScript, React, TailwindCSS, Vite  
- **Backend/Runtime:** Node.js (Express for local Stripe server), Vercel serverless functions  
- **APIs/Services:** Firebase (Auth + Firestore), Stripe Payments, Google Maps, EventBrite  
- **Build & Deployment:** Vite + Vercel  

## Prerequisites ❗
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Stripe test & live API keys
- Firebase project credentials
- Google Maps API key
- EventBrite API token

## Installation ⬇️

**1. Clone the repository**
```
bash git clone https://github.com/amandaseah/Eventurer.git
cd Eventurer
```
**2. Install dependencies**
```
npm install
```
**3. Set up environment variables**
```
cp .env.example .env.local
```
**4. Add your API keys** into `.env.local`

```
# firebase api keys
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_measurement_id

# eventbrite api key
VITE_EVENTBRITE_API_TOKEN=your_eventbrite_api_token

# google maps api key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# stripe api key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# gemini api key
VITE_GEMINI_API_KEY=your_gemini_api_key
```
## Running Eventurer Locally 🏃
**Terminal 1 - Stripe backend**
```
node api/create-payment-intent.js
```
**Terminal 2 - React app**
```
  npm run dev
```
- Frontend available at `http://localhost:3000`
- Two terminals needed for local deployment, as Stripe server (`create-payment-intent.js`) runs on Node.js locally, while the front is served by Vite.

## Usage 🎲
1. Sign up or log in using your email
2. Complete the mood quiz to get tailored event suggestions
3. Browse events, bookmark, RSVP, and pay for ticketed events
4. View event pages to access community forums and Google Maps directions

## Repo Structure 📂
```
Eventurer
├── api/
│   └── create-payment-intent.js          # Stripe backend handler (local + Vercel)
│
├── public/                               # Static assets
│   ├── favicon.png
│   ├── final-optimized.glb
│   └── gmaps-smoke.html
│
├── src/
│   ├── components/
│   │   ├── common/                       # Shared UI components
│   │   ├── features/
│   │   │   ├── event/
│   │   │   │   ├── EventCalendarView.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   └── EventListView.tsx
│   │   │   ├── eventInfo/
│   │   │   │   ├── EventActions.tsx
│   │   │   │   └── EventDetails.tsx
│   │   │   ├── explore/
│   │   │   │   └── FiltersPanel.tsx
│   │   │   ├── forum/
│   │   │   │   ├── api.ts
│   │   │   │   ├── Composer.tsx
│   │   │   │   ├── NewPostForm.tsx
│   │   │   │   ├── PostItem.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   └── TopForumPreview.tsx
│   │   │   ├── landing/
│   │   │   │   ├── FeaturedEvents.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── MoodQuiz.tsx
│   │   │   │   └── landing3D/
│   │   │   │       └── ThreeLanding.tsx
│   │   │   ├── map/
│   │   │   │   ├── HowToGetThere.tsx
│   │   │   │   ├── map.css
│   │   │   │   └── Map.tsx
│   │   │   ├── payments/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── StripePaymentFormWrapper.tsx
│   │   │   ├── profile/
│   │   │   │   ├── AccountPanel.tsx
│   │   │   │   ├── EventsGrid.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── ProfileStats.tsx
│   │   │   │   └── SettingsPanel.tsx
│   │   │   ├── recommendation/
│   │   │   │   └── RecommendationCard.tsx
│   │   │   └── signup/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── SignupForm.tsx
│   │   │       └── FAQChatbot.tsx
│   │   ├── pages/
│   │   │   ├── ChoicePage.tsx
│   │   │   ├── EventExplorePage.tsx
│   │   │   ├── EventForumPage.tsx
│   │   │   ├── EventInfoPage.tsx
│   │   │   ├── FAQPage.tsx
│   │   │   ├── HomePreview.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MarketingLandingPage.tsx
│   │   │   ├── MoodResultsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SafetyGuidelinesPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── shared/
│   │   │   ├── CountdownWidget.tsx
│   │   │   └── Header.tsx
│   │   └── ui/                           # Reusable UI (inputs, buttons)
│   │
│   ├── data/
│   ├── guidelines/
│   ├── hooks/
│   ├── lib/
│   │   ├── apiClient.ts
│   │   ├── authErrorMessages.ts
│   │   ├── dateUtils.ts
│   │   ├── eventbriteService.ts
│   │   ├── eventCategoriser.ts
│   │   ├── firebase.ts
│   │   ├── indexedDB.ts
│   │   ├── loadGoogleMaps.ts
│   │   ├── mockData.ts
│   │   ├── onemapPublic.ts
│   │   ├── routing.ts
│   │   └── types.ts
│   ├── models/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .env.local
├── .gitignore
├── cors.json
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
├── vite-env.d.ts
└── vite.config.ts
```

## Key Pages & Routes 🗺️
**Public Routes**
- `/` - landing page with mood quiz and featured events
- `/login` - user login
- `/signups` - user registration
- `/faq` - frequently asked questions

**Protected Routes**
- `/home` - main dashboard after login
- `/explore` - browse and filter events
- `/event/:id` - event details page (with stripe checkout, map
- `/forum/:id` - event-specific discussion forum
- `/profile` - user profile and bookmarked, RSVP'd and past events
- `/settings` - user settings

## Deployment & Production Build 📦

### **Live Application:**
- **Deployed at**: https://eventurer-zeta.vercel.app/

### **For Submission - Production Build:**
```bash
npm run build
```

**Output Structure:**
```
build/
├── index.html                    # Main entry point
├── assets/
│   ├── index-[hash].js          # Bundled JavaScript
│   └── index-[hash].css         # Bundled CSS
├── favicon.png                  # App icon
├── final-optimized.glb         # 3D model assets
└── logos/                      # Static assets
```

**Deployment Options:**
- **Single folder**: All files contained in `/build` directory
- **Entry point**: `build/index.html` - open this file to run the application
- **Static hosting**: Can be deployed to any web server or opened locally

**Local Testing:**
```bash
# Method 1: Simple HTTP server
cd build && python3 -m http.server 8080

# Method 2: Using npm serve
npx serve build
```

## Notes 📔
- `.env.local` must remain in `.gitignore` for security
- Stripe test cards (eg `4242 4242 4242 4242 12/34 123`) can be used in deployment
- Live keys must be used in production
- Always redeploy to Vercel after updating environment variables
- The application requires environment variables to be configured for full functionality (Firebase, Stripe, Google Maps, etc.)

## AI/LLM Dependencies 🤖

This project relies on AI/LLM services for specific features. The following components require AI/LLM functionality:

### **Primary AI Dependencies:**
1. **FAQ Chatbot** (`src/components/features/FAQChatbot.tsx`)
   - Uses Google Gemini AI API for conversational responses
   - Provides intelligent answers to user questions about the platform
   - Environment variable: `VITE_GEMINI_API_KEY`

2. **FAQ Response Generation** (`src/lib/gemini.ts`)
   - Core AI service integration with Google Gemini
   - Processes user queries and generates contextual responses
   - Includes FAQ data matching and response formatting

3. **FAQ Data Processing** (`src/data/faqData.ts`)
   - Contains AI-powered question matching logic
   - Provides similarity scoring for relevant FAQ retrieval


### **Fallback Behavior:**
If AI services are unavailable:
- FAQ chatbot displays error message and directs users to email support
- Event categorization falls back to basic keyword matching
- Core app functionality (event browsing, booking, payments) remains fully operational

### **Required API Keys:**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Note:** The AI features enhance user experience but are not critical to core functionality. The app can operate without AI services, though with reduced interactive capabilities in the FAQ section.
