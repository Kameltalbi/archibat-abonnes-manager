
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityFiltersProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedPeriod,
  onPeriodChange,
  selectedDate,
  onDateChange
}) => {
  const periods = [
    { value: 'day', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex space-x-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Date de référence :</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'dd MMM yyyy', { locale: fr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateChange(date)}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
