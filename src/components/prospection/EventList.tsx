
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Event } from './CalendarProspection';
import { cn } from '@/lib/utils';

const eventTypeColors: Record<string, string> = {
  renewal: "bg-blue-100 text-blue-800 border-blue-300",
  payment: "bg-green-100 text-green-800 border-green-300",
  meeting: "bg-purple-100 text-purple-800 border-purple-300",
  email: "bg-amber-100 text-amber-800 border-amber-300",
  info: "bg-gray-100 text-gray-800 border-gray-300"
};

const eventTypeLabels: Record<string, string> = {
  renewal: "Renouvellement",
  payment: "Paiement",
  meeting: "Réunion",
  email: "Email",
  info: "Information"
};

interface EventListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export function EventList({ events, onEventClick }: EventListProps) {
  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucun événement pour cette date</p>;
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventClick?.(event)}
          className={cn(
            "p-3 rounded-md border cursor-pointer hover:opacity-80 transition-opacity",
            eventTypeColors[event.type]
          )}
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{event.title}</h4>
            <span className="text-xs px-2 py-1 rounded-full bg-white/50">
              {eventTypeLabels[event.type]}
            </span>
          </div>
          {event.subscriberName && (
            <p className="text-sm mt-1">Client: {event.subscriberName}</p>
          )}
          <p className="text-xs mt-1">
            {format(event.date, "HH:mm", { locale: fr })}
          </p>
          {event.description && (
            <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
