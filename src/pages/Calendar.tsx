
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Calendar = () => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

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
        <div className="bg-white rounded-lg border shadow p-6">
          <h2 className="text-xl font-medium mb-4">Vue calendrier</h2>
          <div className="min-h-[500px] flex flex-col items-center">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            {date && (
              <div className="mt-4 text-center">
                <p className="text-lg font-medium">
                  Date sélectionnée: {date.toLocaleDateString('fr-FR')}
                </p>
                <p className="text-muted-foreground">
                  Aucun événement prévu pour cette date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
