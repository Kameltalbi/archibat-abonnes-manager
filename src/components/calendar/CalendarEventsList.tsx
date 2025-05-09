
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { 
  CalendarClock, 
  CalendarX, 
  Receipt, 
  CalendarCheck,
  User
} from 'lucide-react';

interface CalendarEventsListProps {
  events: CalendarEvent[];
  emptyMessage?: string;
}

export const CalendarEventsList: React.FC<CalendarEventsListProps> = ({ 
  events, 
  emptyMessage = "Aucun événement" 
}) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <CalendarX className="h-12 w-12 mb-2 opacity-30" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'expiration':
        return <CalendarX className="text-red-500" />;
      case 'renewal':
        return <CalendarCheck className="text-green-500" />;
      case 'invoice':
        return <Receipt className="text-amber-500" />;
      case 'subscription':
        return <CalendarCheck className="text-blue-500" />;
      default:
        return <CalendarClock className="text-gray-500" />;
    }
  };

  const getEventTitle = (event: CalendarEvent) => {
    switch (event.type) {
      case 'expiration':
        return `Expiration: ${event.title}`;
      case 'renewal':
        return `Renouvellement: ${event.title}`;
      case 'invoice':
        return `Facturation: ${event.title}`;
      case 'subscription':
        return `Souscription: ${event.title}`;
      default:
        return event.title;
    }
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {events.map(event => (
        <div 
          key={event.id} 
          className="flex items-start p-3 border rounded-md hover:bg-muted/30 transition-colors"
        >
          <div className="mr-3">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{getEventTitle(event)}</h4>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <CalendarClock className="h-3 w-3 mr-1" />
              <span>{format(new Date(event.date), 'HH:mm', { locale: fr })}</span>
              
              {event.metadata?.subscriberId && (
                <div className="ml-3 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span>{event.metadata.subscriberName || event.metadata.subscriberId}</span>
                </div>
              )}
            </div>
            
            {event.description && (
              <p className="text-sm mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
