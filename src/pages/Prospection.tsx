
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarProspection } from '@/components/prospection/CalendarProspection';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { AddEventModal } from '@/components/prospection/AddEventModal';

const Prospection = () => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Prospection" 
        description="Gérer vos activités de prospection" 
      >
        <Button 
          onClick={() => setIsAddEventModalOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Événement
        </Button>
      </PageHeader>
      
      <div className="mt-6 grid gap-6 md:grid-cols-12">
        {/* Calendrier */}
        <div className="md:col-span-12">
          <div className="bg-white rounded-lg border shadow p-6">
            <h2 className="text-xl font-medium mb-4">Calendrier des activités</h2>
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

export default Prospection;
