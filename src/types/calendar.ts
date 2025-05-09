
export type EventType = 'subscription' | 'expiration' | 'renewal' | 'invoice';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO string format
  description: string;
  metadata?: {
    subscriberId?: string;
    subscriberName?: string;
    subscriberType?: string; // Annuel, Semestriel, Trimestriel, Étudiant, etc.
    [key: string]: any;
  };
}
