export interface ForumPost {
    id: number;
    eventId: number;
    username: string;
    timestamp: string;
    comment: string;
    upvotes: number;
    image?: string;     // optional
    replyTo?: number;   // optional
  }