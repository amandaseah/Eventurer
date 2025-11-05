# Eventurer
Eventurer is a web app that helps people discover events in Singapore and plan how to get there.  

## Features
- Interactive quiz to ascertain user mood, and recommend corresponding events
- View event details (time, location, description)
- Google Maps API integration to plan route & get directions to the event
- Filter events by category, date, location, popularity etc
- RSVP for events or bookmark/save them for later
- Interact with other event-goers through event-specific community forums

## Tech Stack
- Frontend: Typescript, React, TailwindCSS
- Build Tool: Vite
- Deployment: Vercel
- Backend/APIs: Motion, Firebase, Google Maps, EventBrite

## Prerequisites
- npm

## Installation
1. Clone the repo ```bash
   git clone https://github.com/amandaseah/Eventurer.git```
2. Navigate into the project folder `cd Eventurer`
3. Install dependencies `npm install`
4. Run server `npm run dev`

## Usage
1. Create a new account
2. Complete the interactive quiz
3. Sign up for events!

## Details
Deployment url: `https://eventurer-zeta.vercel.app/ `
   
## Repository Structure
```
root
├── public/                # static assets (not processed by Vite)
│   ├── favicon.png
│   ├── final-optimized.glb
│   └── gmaps-smoke.html   # google maps test page
│
├── src/                   # main source code
│   ├── components/        # UI building blocks
│   │   ├── common/        # shared components (buttons, inputs, etc)
│   │   ├── features/      # feature-specific components
│   │   ├── pages/         # page-level view
│   │   ├── shared/        # reusable logic & components across pages
│   │   └── ui/            # visual components (cards, dropdowns, etc)
│   ├── guidelines/      
│   ├── hooks/             # react hooks
│   ├── lib/               # helper libraries (API config, backend logic)
│   ├── models/            
│   ├── styles/            # tailwind & global CSS
│   ├── types/          
│   ├── App.tsx            # root component
│   ├── main.tsx           # app entry point
│   └── index.css          # global CSS entry
│
├── .env.example           
├── .env.local              # local environment variables (ignored by git)
├── cors.json               # CORS configuration
├── vercel.json             # vercel deployment config
├── package.json            # project metadata & dependencies
├── vite.config.ts          # vite config
├── tailwind.config.js      # tailwind setup
├── tsconfig.json           # typeScript configuration
└── README.md              
```
