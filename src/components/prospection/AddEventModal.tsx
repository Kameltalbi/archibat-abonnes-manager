
import React, { useState } from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Event, EventType } from './CalendarProspection';

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEventModal({ 
  open, 
  onOpenChange
}: AddEventModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState('');
  const [subscriberId, setSubscriberId] = useState('');
  const [subscriberName, setSubscriberName] = useState('');
  const [type, setType] = useState<EventType>('info');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setDate(new Date());
      setTitle('');
      setSubscriberId('');
      setSubscriberName('');
      setType('info');
      setDescription('');
      setTime('09:00');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(date || new Date());
    eventDate.setHours(hours, minutes);
    
    const newEvent: Omit<Event, 'id'> = {
      title,
      subscriberId,
      subscriberName,
      date: eventDate,
      type,
      description
    };
    
    // Mock saving the event
    console.log('Événement créé:', newEvent);
    
    // Close the modal
    onOpenChange(false);
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
          <DialogTitle>Ajouter un nouvel événement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriber">Abonné</Label>
            <select 
              id="subscriber" 
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              value={subscriberId}
              onChange={(e) => {
                setSubscriberId(e.target.value);
                const selectedSubscriber = subscribers.find(s => s.id === e.target.value);
                setSubscriberName(selectedSubscriber?.name || '');
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
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type d'événement</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as EventType)}
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
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
