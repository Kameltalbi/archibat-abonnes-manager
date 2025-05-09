
import React, { useState } from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventModal } from "@/components/prospection/EventModal";
import { EventList } from "@/components/prospection/EventList";
import { cn } from "@/lib/utils";

// Types
export type EventType = 'renewal' | 'payment' | 'meeting' | 'email' | 'info';

export interface Event {
  id: string;
  title: string;
  subscriberId?: string;
  subscriberName?: string;
  date: Date;
  type: EventType;
  description?: string;
}

const eventTypeColors: Record<EventType, string> = {
  renewal: "bg-blue-500",
  payment: "bg-green-500",
  meeting: "bg-purple-500",
  email: "bg-amber-500",
  info: "bg-gray-500"
};

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Renouvellement d\'abonnement',
    subscriberId: '1',
    subscriberName: 'Ahmed Ben Ali',
    date: new Date(2025, 4, 15), // 15 mai 2025
    type: 'renewal',
    description: 'Renouvellement de l\'abonnement annuel'
  },
  {
    id: '2',
    title: 'Paiement en attente',
    subscriberId: '2',
    subscriberName: 'Fatma Zaied',
    date: new Date(2025, 4, 10), // 10 mai 2025
    type: 'payment',
    description: 'Relance pour paiement en retard'
  },
  {
    id: '3',
    title: 'Réunion client',
    subscriberId: '3',
    subscriberName: 'Mohamed Karoui',
    date: new Date(2025, 4, 20), // 20 mai 2025
    type: 'meeting',
    description: 'Présentation des nouveaux services'
  },
  {
    id: '4',
    title: 'Email de bienvenue',
    subscriberId: '4',
    subscriberName: 'Leila Trabelsi',
    date: new Date(2025, 4, 12), // 12 mai 2025
    type: 'email',
    description: 'Envoi du mail de bienvenue'
  },
  {
    id: '5',
    title: 'Expiration abonnement',
    subscriberId: '5',
    subscriberName: 'Sami Bouslama',
    date: new Date(2025, 4, 28), // 28 mai 2025
    type: 'renewal',
    description: 'Date d\'expiration de l\'abonnement'
  }
];

export function CalendarProspection() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeView, setActiveView] = useState<'month' | 'week'>('month');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');

  // Filtrer les événements selon le type sélectionné
  const filteredEvents = filterType === 'all'
    ? events
    : events.filter(event => event.type === filterType);

  // Obtenir les événements pour une date spécifique
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Fonction pour gérer le clic sur une date
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date);
    
    if (dayEvents.length === 1) {
      // S'il y a un seul événement, ouvrir directement le modal de cet événement
      setSelectedEvent(dayEvents[0]);
    } else {
      // Sinon, ouvrir le modal pour créer un nouvel événement
      setSelectedEvent(null);
    }
    
    setIsEventModalOpen(true);
  };

  // Fonction pour ajouter ou mettre à jour un événement
  const handleEventSave = (event: Event) => {
    if (event.id) {
      // Mise à jour d'un événement existant
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      // Ajout d'un nouvel événement
      const newEvent = {
        ...event,
        id: Math.random().toString(36).substring(7)
      };
      setEvents([...events, newEvent]);
    }
  };

  // Fonction pour supprimer un événement
  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsEventModalOpen(false);
  };

  // Component de décoration de jour avec les événements
  const eventDecorators = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    
    return dayEvents.length > 0 ? (
      <div className="flex flex-wrap gap-1 mt-1 justify-center">
        {dayEvents.slice(0, 3).map((event) => (
          <span 
            key={event.id}
            className={cn(
              "w-2 h-2 rounded-full", 
              eventTypeColors[event.type]
            )} 
          />
        ))}
        {dayEvents.length > 3 && <span className="text-xs">+{dayEvents.length - 3}</span>}
      </div>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <Tabs defaultValue="month" value={activeView} onValueChange={(v) => setActiveView(v as 'month' | 'week')}>
            <TabsList>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            className="text-sm border border-input bg-background px-3 py-2 rounded-md"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
          >
            <option value="all">Tous les types</option>
            <option value="renewal">Renouvellements</option>
            <option value="payment">Paiements</option>
            <option value="meeting">Réunions</option>
            <option value="email">Emails</option>
            <option value="info">Informations</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className={cn("md:col-span-5", activeView === 'week' ? "md:col-span-4" : "")}>
          <div className="bg-white rounded-lg border p-4">
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={handleDateClick}
              className="rounded-md border p-3 pointer-events-auto"
              showOutsideDays
              locale={fr}
              components={{
                DayContent: (props) => (
                  <div onClick={() => handleDateClick(props.date)} className="w-full cursor-pointer">
                    <div>{format(props.date, "d")}</div>
                    {eventDecorators({ date: props.date })}
                  </div>
                )
              }}
            />
          </div>
        </div>
        <div className={cn("md:col-span-2", activeView === 'week' ? "md:col-span-3" : "")}>
          <div className="bg-white rounded-lg border p-4 h-full overflow-auto">
            <h3 className="font-medium mb-2">
              {selectedDate ? `Événements du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}` : 'Aucune date sélectionnée'}
            </h3>
            <EventList 
              events={selectedDate ? getEventsForDate(selectedDate) : []} 
              onEventClick={(event) => {
                setSelectedEvent(event);
                setIsEventModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <EventModal 
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
    </div>
  );
}
