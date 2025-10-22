import { categorizeEvent } from './eventCategoriser';
import { eventbriteApi } from './apiClient';


const API_BASE = 'https://www.eventbriteapi.com/v3';
const API_TOKEN = import.meta.env.VITE_EVENTBRITE_API_TOKEN;

export async function sanityCheckMe() {
  try {
    const { data } = await eventbriteApi.get('/users/me/');
    console.log('[EB] /users/me OK:', data);
    return data;
  } catch (e: any) {
    console.error('[EB] /users/me FAILED:', e.response?.status, e.response?.data || e.message);
    throw e;
  }
}

export interface EventbriteEvent {
  id: string;
  name: { text: string };
  description: { text: string };
  start: { local: string };
  end: { local: string };
  url: string;
  logo?: { original?: { url: string } };
  venue?: {
    name: string;
    address: {
      city: string;
      region: string;
      localized_address_display: string;
    };
  };
  is_free: boolean;
  ticket_availability?: { minimum_ticket_price?: { major_value: number } };
  category?: { name: string };
}

export interface TransformedEvent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  price: string;
  organizer: string;
  mood: 'chill' | 'active' | 'social' | 'educational';
  category: string;
  saves: number;
  deadline: string;
  isPast: boolean;
  eventbriteUrl: string;
}

// export async function fetchEventbriteEvents(
//   location = 'Singapore',
//   radius = '25km'
// ): Promise<TransformedEvent[]> {
//   try {
//     if (!API_TOKEN) {
//       console.warn('VITE_EVENTBRITE_API_TOKEN is missing. Did you restart Vite after creating .env.local?');
//       return [];
//     }
//     const params = new URLSearchParams({
//       'location.address': location,
//       'location.within': radius,
//       'expand': 'venue,ticket_availability,category',
//       'status': 'live',
//       'order_by': 'start_asc'
//     });

//     const response = await fetch(
//       `${API_BASE}/events/search/?${params}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${API_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Eventbrite API error: ${response.status}`);
//     }

//     const data = await response.json();
//     const events = data.events || [];

//     return events.map((event: EventbriteEvent) => 
//       transformEventbriteEvent(event)
//     );
//   } catch (error) {
//     console.error('Error fetching Eventbrite events:', error);
//     return [];
//   }
// }

// export async function fetchEventbriteEvents(
//   location = 'Singapore',
//   radius = '25km'
// ): Promise<TransformedEvent[]> {
//   try {
//     const params = {
//       'location.address': location,
//       'location.within': radius,
//       expand: 'venue,ticket_availability,category',
//       status: 'live',
//       order_by: 'start_asc',
//     };

//     // make GET request with axios client
//     const { data } = await eventbriteApi.get('/events/search/', { params });
//     console.log('[service] raw /events/search response:', data);

//     const events = data.events || [];
//     return events.map((event: EventbriteEvent) =>
//       transformEventbriteEvent(event)
//     );
//   } catch (error: any) {
//     console.error('Error fetching Eventbrite events:', error.response?.data || error.message);
//     return [];
//   }
// }

export async function fetchEventbriteEventsForMe(): Promise<TransformedEvent[]> {
  try {
    const { data } = await eventbriteApi.get("/users/me/owned_events/", {
      params: {
        expand: "venue,ticket_availability,category",
        status: "live",                // adjust if you want draft/past
        order_by: "start_asc",
        page_size: 50,                 // optional
      },
    });

    const events = data.events || [];
    return events.map(transformEventbriteEvent);
  } catch (err: any) {
    console.error("EB /users/me/owned_events failed:", err.response?.data || err.message);
    return [];
  }
}

function transformEventbriteEvent(event: EventbriteEvent): TransformedEvent {
  const startDate = new Date(event.start.local);
  const isPast = startDate < new Date();
  
  // Get price
  const price = event.is_free 
    ? 'Free' 
    : `$${event.ticket_availability?.minimum_ticket_price?.major_value || 0}`;

  // Get location
  const location = event.venue?.address?.localized_address_display || 
                  event.venue?.name || 
                  'Online Event';

  // Get image with fallback
  const imageUrl = event.logo?.original?.url || 
                  'https://images.unsplash.com/photo-1540575467063-178a50c2df87';

  // Categorize event
  const eventCategory = categorizeEvent(
    event.name.text,
    event.description?.text || '',
    event.category?.name || ''
  );

  // Calculate deadline (1 day before event)
  const deadline = new Date(startDate);
  deadline.setDate(deadline.getDate() - 1);

  return {
    id: parseInt(event.id),
    title: event.name.text,
    description: event.description?.text || '',
    imageUrl,
    date: startDate.toISOString().split('T')[0],
    time: startDate.toTimeString().slice(0, 5),
    location,
    price,
    organizer: 'Eventbrite',
    mood: eventCategory.mood,
    category: eventCategory.category,
    saves: Math.floor(Math.random() * 200) + 50, // Simulated
    deadline: deadline.toISOString().split('T')[0],
    isPast,
    eventbriteUrl: event.url,
  };
}
console.log('[EB] using token?', Boolean(import.meta.env.VITE_EVENTBRITE_API_TOKEN || localStorage.getItem('eventbrite_token')));
