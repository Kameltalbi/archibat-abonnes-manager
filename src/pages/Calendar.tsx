
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock events for demonstration
const mockEvents = [
  {
    id: '1',
    title: 'Réunion avec les partenaires',
    date: new Date(2025, 4, 10),
    startTime: '09:00',
    endTime: '10:30',
    location: 'Salle de conférence A',
    description: 'Discussion sur les nouveaux projets',
  },
  {
    id: '2',
    title: 'Formation Archibat',
    date: new Date(2025, 4, 10),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Centre de formation',
    description: 'Formation sur les nouveaux outils',
  },
  {
    id: '3',
    title: 'Rendez-vous client',
    date: new Date(2025, 4, 12),
    startTime: '11:00',
    endTime: '12:00',
    location: 'Bureau 305',
    description: 'Présentation des nouveaux services',
  },
  {
    id: '4',
    title: 'Webinaire marketing',
    date: new Date(2025, 4, 15),
    startTime: '15:00',
    endTime: '16:30',
    location: 'En ligne',
    description: 'Stratégies de marketing digital',
  },
];

const Calendar = () => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter events for the selected date
  const eventsForSelectedDate = date 
    ? mockEvents.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      )
    : [];

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Calendrier" 
        description="Gérer votre calendrier d'activités"
        icon={<CalendarDaysIcon className="h-6 w-6 text-archibat-blue" />}
      >
        <Button 
          onClick={() => setIsAddEventModalOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un événement
        </Button>
      </PageHeader>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vue calendrier</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-3"
                classNames={{
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-base font-medium",
                  table: "w-full border-collapse",
                  head_cell: "text-muted-foreground font-medium text-sm w-10 h-10",
                  cell: "text-center text-sm relative w-10 h-10 p-0 focus-within:relative focus-within:z-20",
                  day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-full",
                  day_today: "bg-accent text-accent-foreground rounded-full",
                }}
                fixedWeeks
                showOutsideDays
                locale={fr}
              />
            </CardContent>
          </Card>

          {/* Events for Selected Date */}
          <Card>
            <CardHeader className="flex flex-col space-y-1.5">
              <CardTitle>
                {date ? (
                  <>
                    Événements du {format(date, "d MMMM yyyy", { locale: fr })}
                  </>
                ) : (
                  "Événements"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {event.startTime} - {event.endTime}
                        </div>
                        
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        
                        {event.description && (
                          <p className="mt-2 text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <CalendarDaysIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>Aucun événement pour cette date</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddEventModalOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter un événement</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md" 
                    placeholder="Titre de l'événement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-md" 
                    defaultValue={date ? format(date, "yyyy-MM-dd") : undefined}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de début</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de fin</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md" 
                    placeholder="Lieu de l'événement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full p-2 border rounded-md" 
                    rows={3}
                    placeholder="Description de l'événement"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsAddEventModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="button">
                    Ajouter
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
