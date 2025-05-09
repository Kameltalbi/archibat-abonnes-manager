
import React from 'react';
import { EventType } from '@/types/calendar';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  CalendarClock, 
  CalendarX, 
  Receipt, 
  CalendarCheck,
  Users,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CalendarFiltersProps {
  filterType: EventType | 'all';
  onFilterTypeChange: (type: EventType | 'all') => void;
  filterSubscriberType: string;
  onFilterSubscriberTypeChange: (type: string) => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filterType,
  onFilterTypeChange,
  filterSubscriberType,
  onFilterSubscriberTypeChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Types d'événements</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={filterType} onValueChange={(value) => onFilterTypeChange(value as EventType | 'all')}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex items-center">
                <CalendarClock className="h-4 w-4 mr-2" />
                Tous les événements
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="subscription" id="subscription" />
              <Label htmlFor="subscription" className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2 text-blue-500" />
                Souscriptions
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="expiration" id="expiration" />
              <Label htmlFor="expiration" className="flex items-center">
                <CalendarX className="h-4 w-4 mr-2 text-red-500" />
                Expirations
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="renewal" id="renewal" />
              <Label htmlFor="renewal" className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2 text-green-500" />
                Renouvellements
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice" className="flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-amber-500" />
                Facturations
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Type d'abonnés</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={filterSubscriberType} 
            onValueChange={onFilterSubscriberTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type d'abonné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les abonnés</SelectItem>
              <SelectItem value="Annuel">Abonnés annuels</SelectItem>
              <SelectItem value="Semestriel">Abonnés semestriels</SelectItem>
              <SelectItem value="Trimestriel">Abonnés trimestriels</SelectItem>
              <SelectItem value="Étudiant">Abonnés étudiants</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
