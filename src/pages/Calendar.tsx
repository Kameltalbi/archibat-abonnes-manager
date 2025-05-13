
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon, MapPinIcon, ClockIcon, Loader2 } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarEventModal, CalendarEvent } from '@/components/calendar/CalendarEventModal';

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');

      if (error) throw error;

      if (data) {
        console.log("Fetched events:", data);
        const mappedEvents: CalendarEvent[] = data.map(event => ({
          id: event.id,
          title: event.title,
          date: parseISO(event.date),
          startTime: event.start_time,
          endTime: event.end_time,
          location: event.location,
          description: event.description
        }));
        
        console.log("Mapped events:", mappedEvents);
        setEvents(mappedEvents);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les événements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events for the selected date
  const eventsForSelectedDate = date 
    ? events.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      )
    : [];

  // Handle adding a new event
  const handleAddEvent = () => {
    setEventToEdit(undefined);
    setIsAddEventModalOpen(true);
  };

  // Handle editing an event
  const handleEditEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsAddEventModalOpen(true);
  };

  // Handle deleting an event
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventToDelete);

      if (error) throw error;

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès",
      });

      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    } finally {
      setEventToDelete(null);
    }
  };

  // Get dates with events for highlighting in the calendar
  const datesWithEvents = events.map(event => event.date);

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Calendrier" 
        description="Gérer votre calendrier d'activités"
        icon={<CalendarDaysIcon className="h-6 w-6 text-archibat-blue" />}
      >
        <Button 
          onClick={handleAddEvent}
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
                className="rounded-md border p-3 pointer-events-auto"
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
                modifiers={{
                  hasEvent: (date) => datesWithEvents.some(eventDate => 
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  )
                }}
                modifiersClassNames={{
                  hasEvent: "border-2 border-archibat-blue"
                }}
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
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-archibat-blue" />
                </div>
              ) : eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setEventToDelete(event.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {event.startTime} - {event.endTime}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        )}
                        
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
                    onClick={handleAddEvent}
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

      {/* Add/Edit Event Modal */}
      <CalendarEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        selectedDate={date}
        event={eventToEdit}
        onEventUpdated={fetchEvents}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Calendar;
