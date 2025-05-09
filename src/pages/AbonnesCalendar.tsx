
import React, { useState, useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PageHeader } from '@/components/common/PageHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarClock, CalendarPlus, Filter } from 'lucide-react';
import { CalendarEventsList } from '@/components/calendar/CalendarEventsList';
import { CalendarEventDialog } from '@/components/calendar/CalendarEventDialog';
import { getSubscriberEvents } from '@/services/calendarService';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarEvent, EventType } from '@/types/calendar';

const AbonnesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterSubscriberType, setFilterSubscriberType] = useState<string>('all');
  
  // Récupérer les événements depuis notre service
  const allEvents = useMemo(() => getSubscriberEvents(), []);
  
  // Filtrer les événements selon les critères sélectionnés
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesSubscriberType = filterSubscriberType === 'all' || 
        (event.metadata && event.metadata.subscriberType === filterSubscriberType);
      return matchesType && matchesSubscriberType;
    });
  }, [allEvents, filterType, filterSubscriberType]);
  
  // Événements pour la date sélectionnée
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.date), selectedDate)
    );
  }, [filteredEvents, selectedDate]);
  
  // Fonction pour ajouter un nouvel événement
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    // Dans une application réelle, nous appellerions une API pour sauvegarder l'événement
    console.log('Nouvel événement à ajouter:', event);
    setIsAddEventOpen(false);
    // Recharger les événements après ajout (simulé ici)
    // En réalité, il faudrait mettre à jour l'état ou déclencher un refetch
  };

  // Fonction pour décorer les jours du calendrier
  const getDayClassNames = (day: Date | undefined) => {
    if (!day) return '';
    
    // Vérifier si des événements existent pour ce jour
    const hasEvents = filteredEvents.some(event => 
      isSameDay(new Date(event.date), day)
    );
    
    // Vérifier les types d'événements pour ce jour
    const hasExpiration = filteredEvents.some(event => 
      isSameDay(new Date(event.date), day) && event.type === 'expiration'
    );
    
    const hasRenewal = filteredEvents.some(event => 
      isSameDay(new Date(event.date), day) && event.type === 'renewal'
    );
    
    const hasInvoice = filteredEvents.some(event => 
      isSameDay(new Date(event.date), day) && event.type === 'invoice'
    );
    
    if (hasExpiration) return 'bg-red-100 text-red-800 font-medium';
    if (hasRenewal) return 'bg-green-100 text-green-800 font-medium';
    if (hasInvoice) return 'bg-amber-100 text-amber-800 font-medium';
    if (hasEvents) return 'bg-blue-100 text-blue-800 font-medium';
    
    return '';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calendrier des abonnements" 
        description="Visualisez et gérez les dates importantes de vos abonnements"
        icon={<CalendarCheck className="h-6 w-6 text-blue-500" />}
      >
        <Button onClick={() => setIsAddEventOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Ajouter un événement
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne de gauche : Calendrier */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full p-3 pointer-events-auto"
              locale={fr}
              modifiers={{
                event: (date) => filteredEvents.some(event => 
                  isSameDay(new Date(event.date), date)
                )
              }}
              modifiersClassNames={{
                event: 'font-bold border border-blue-500'
              }}
              components={{
                DayContent: ({ date }) => {
                  const customClass = getDayClassNames(date);
                  // Retourne le jour avec style personnalisé si nécessaire
                  return (
                    <div className={`w-full h-full flex items-center justify-center ${customClass}`}>
                      {date.getDate()}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Colonne de droite : Filtres et événements */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="events">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="events" className="flex-1">Événements</TabsTrigger>
                <TabsTrigger value="filters" className="flex-1">Filtres</TabsTrigger>
              </TabsList>
              
              <TabsContent value="events" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
                  </h3>
                  
                  <div className="flex items-center">
                    {filterType !== 'all' && (
                      <Badge variant="outline" className="mr-2">
                        {filterType === 'expiration' ? 'Expirations' : 
                         filterType === 'renewal' ? 'Renouvellements' : 
                         filterType === 'invoice' ? 'Facturations' : 
                         filterType === 'subscription' ? 'Souscriptions' : ''}
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setFilterType('all')}>
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CalendarEventsList 
                  events={selectedDateEvents} 
                  emptyMessage="Aucun événement pour cette date"
                />
              </TabsContent>
              
              <TabsContent value="filters">
                <CalendarFilters 
                  filterType={filterType}
                  onFilterTypeChange={setFilterType}
                  filterSubscriberType={filterSubscriberType}
                  onFilterSubscriberTypeChange={setFilterSubscriberType}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter un événement */}
      <CalendarEventDialog 
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default AbonnesCalendar;
