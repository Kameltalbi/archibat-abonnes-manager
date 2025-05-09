
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarProspection } from '@/components/prospection/CalendarProspection';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon } from 'lucide-react';
import { useState } from 'react';
import { AddEventModal } from '@/components/prospection/AddEventModal';

const Calendar = () => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

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
          <div className="min-h-[500px]">
            <CalendarProspection />
          </div>
        </div>
      </div>

      <AddEventModal 
        open={isAddEventModalOpen} 
        onOpenChange={setIsAddEventModalOpen} 
      />
    </div>
  );
};

export default Calendar;
