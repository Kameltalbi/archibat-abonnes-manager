
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

export interface CalendarEvent {
  id?: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
  event?: CalendarEvent;
  onEventUpdated: () => void;
}

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  event,
  onEventUpdated
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(
    event?.date ? format(event.date, 'yyyy-MM-dd') : 
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState(event?.startTime || '09:00');
  const [endTime, setEndTime] = useState(event?.endTime || '10:00');
  const [location, setLocation] = useState(event?.location || '');
  const [description, setDescription] = useState(event?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const eventData = {
        title,
        date: date,
        start_time: startTime,
        end_time: endTime,
        location,
        description
      };
      
      if (event?.id) {
        // Update existing event
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', event.id);
          
        if (error) throw error;
        
        toast({
          title: "Événement modifié",
          description: "L'événement a été modifié avec succès",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('calendar_events')
          .insert([eventData]);
          
        if (error) throw error;
        
        toast({
          title: "Événement ajouté",
          description: "L'événement a été ajouté avec succès",
        });
      }
      
      // Notify parent component to refresh events
      onEventUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {event ? "Modifier l'événement" : "Ajouter un événement"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium mb-1">Titre</Label>
            <Input 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Titre de l'événement"
              required
            />
          </div>
          <div>
            <Label htmlFor="date" className="block text-sm font-medium mb-1">Date</Label>
            <Input 
              id="date"
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime" className="block text-sm font-medium mb-1">Heure de début</Label>
              <Input 
                id="startTime"
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="block text-sm font-medium mb-1">Heure de fin</Label>
              <Input 
                id="endTime"
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                required 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="block text-sm font-medium mb-1">Lieu</Label>
            <Input 
              id="location"
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Lieu de l'événement" 
            />
          </div>
          <div>
            <Label htmlFor="description" className="block text-sm font-medium mb-1">Description</Label>
            <Textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Description de l'événement"
              rows={3} 
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
