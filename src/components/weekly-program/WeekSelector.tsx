
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeekSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export const WeekSelector = ({ selectedWeek, onWeekChange }: WeekSelectorProps) => {
  // Calculate the start date of the selected week (Monday)
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  
  // Go to previous week
  const goToPreviousWeek = () => {
    onWeekChange(addWeeks(selectedWeek, -1));
  };

  // Go to next week
  const goToNextWeek = () => {
    onWeekChange(addWeeks(selectedWeek, 1));
  };

  // Go to current week
  const goToCurrentWeek = () => {
    onWeekChange(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-lg font-medium">
        Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Semaine précédente</span>
        </Button>
        
        <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
          Aujourd'hui
        </Button>
        
        <Button variant="outline" size="sm" onClick={goToNextWeek}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Semaine suivante</span>
        </Button>
      </div>
    </div>
  );
};
