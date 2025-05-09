
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';

const Calendar = () => {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Calendrier" 
        description="Gérer votre calendrier d'activités"
      />
      
      <div className="mt-6">
        <div className="bg-white rounded-lg border shadow p-6">
          <h2 className="text-xl font-medium mb-4">Vue calendrier</h2>
          <div className="min-h-[500px]">
            {/* Placeholder for calendar component */}
            <p className="text-muted-foreground">Fonctionnalité de calendrier en développement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
