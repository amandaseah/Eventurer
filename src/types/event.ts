export interface Event {
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
  eventbriteUrl?: string;
  start?: {
    local?: string;
    utc?: string;
  };
  startDate?: string;
  listed?: boolean;
  status?: string;
}
