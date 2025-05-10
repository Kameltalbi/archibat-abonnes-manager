
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'task';
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-archibat-blue';
      case 'deadline':
        return 'bg-archibat-pink';
      case 'task':
        return 'bg-archibat-violet';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="archibat-card h-full">
      <h3 className="text-lg font-medium mb-4">Événements à venir</h3>
      
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Aucun événement à venir
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="flex items-start p-3 rounded-md border border-border hover:bg-muted/30 transition-colors"
            >
              <div className={`w-2 h-full self-stretch rounded-full ${getTypeColor(event.type)} mr-4`}></div>
              <div className="flex-1">
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{event.date}</span>
                  <Clock className="h-3 w-3 ml-3 mr-1" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <a 
        href="/calendrier" 
        className="block mt-4 text-center text-sm text-archibat-blue hover:underline"
      >
        Voir le calendrier complet
      </a>
    </div>
  );
}
