
import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Event } from './CalendarProspection';

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  selectedDate: Date | undefined;
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({ 
  open, 
  onOpenChange, 
  event, 
  selectedDate, 
  onSave,
  onDelete
}: EventModalProps) {
  const [formData, setFormData] = React.useState<Partial<Event>>({
    id: '',
    title: '',
    subscriberName: '',
    date: new Date(),
    type: 'info',
    description: ''
  });

  // Reset form data when modal opens
  React.useEffect(() => {
    if (open) {
      if (event) {
        setFormData({
          id: event.id,
          title: event.title,
          subscriberId: event.subscriberId,
          subscriberName: event.subscriberName,
          date: event.date,
          type: event.type,
          description: event.description || ''
        });
      } else {
        setFormData({
          id: '',
          title: '',
          subscriberName: '',
          date: selectedDate || new Date(),
          type: 'info',
          description: ''
        });
      }
    }
  }, [open, event, selectedDate]);

  const handleChange = (field: keyof Event, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Event);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (formData.id && onDelete) {
      onDelete(formData.id);
    }
  };

  // Mock subscribers for demo
  const subscribers = [
    { id: '1', name: 'Ahmed Ben Ali' },
    { id: '2', name: 'Fatma Zaied' },
    { id: '3', name: 'Mohamed Karoui' },
    { id: '4', name: 'Leila Trabelsi' },
    { id: '5', name: 'Sami Bouslama' },
    { id: '6', name: 'Imen Gharsallah' },
    { id: '7', name: 'Karim Mejri' },
    { id: '8', name: 'Nadia Riahi' },
    { id: '9', name: 'Omar Jlassi' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? "Modifier l'événement" : "Ajouter un nouvel événement"}
          </DialogTitle>
          <DialogDescription>
            {selectedDate && `Date: ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriber">Abonné</Label>
            <select 
              id="subscriber" 
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              value={formData.subscriberId || ''}
              onChange={(e) => {
                const selectedSubscriber = subscribers.find(s => s.id === e.target.value);
                handleChange('subscriberId', e.target.value);
                handleChange('subscriberName', selectedSubscriber?.name || '');
              }}
            >
              <option value="">-- Sélectionner un abonné --</option>
              {subscribers.map((subscriber) => (
                <option key={subscriber.id} value={subscriber.id}>
                  {subscriber.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Heure</Label>
              <Input 
                id="date" 
                type="time" 
                value={formData.date ? format(formData.date, 'HH:mm') : ''} 
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newDate = new Date(formData.date || selectedDate || new Date());
                  newDate.setHours(hours, minutes);
                  handleChange('date', newDate);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type d'événement</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value as Event['type'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renewal">Renouvellement</SelectItem>
                  <SelectItem value="payment">Paiement</SelectItem>
                  <SelectItem value="meeting">Réunion</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="sm:justify-between">
            <div>
              {event && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {event ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
