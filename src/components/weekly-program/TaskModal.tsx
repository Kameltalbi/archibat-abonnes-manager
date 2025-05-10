
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { WeeklyTask } from '@/pages/WeeklyProgram';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<WeeklyTask, 'id'>) => void;
  task: WeeklyTask | null;
  weekDays: Date[];
  selectedDayIndex: number | null;
}

export const TaskModal = ({
  open,
  onOpenChange,
  task,
  weekDays,
  selectedDayIndex,
}: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Set initial values when modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDayIndex(task.dayIndex);
      setStartTime(task.startTime);
      setEndTime(task.endTime);
      setLocation(task.location || '');
    } else {
      setTitle('');
      setDayIndex(selectedDayIndex !== null ? selectedDayIndex : 0);
      setStartTime('09:00');
      setEndTime('10:00');
      setLocation('');
    }
  }, [open, task, selectedDayIndex]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez entrer un titre pour cette tâche.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedDate = weekDays[dayIndex];
      
      const taskData = {
        title,
        day_index: dayIndex,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        location: location || null
      };
      
      if (task?.id) {
        // Update existing task
        const { error } = await supabase
          .from('weekly_tasks')
          .update(taskData)
          .eq('id', task.id);
          
        if (error) throw error;
        
        toast({
          title: "Tâche modifiée",
          description: "La tâche a été modifiée avec succès.",
        });
      } else {
        // Insert new task
        const { error } = await supabase
          .from('weekly_tasks')
          .insert([taskData]);
          
        if (error) throw error;
        
        toast({
          title: "Tâche ajoutée",
          description: "La tâche a été ajoutée avec succès.",
        });
      }
      
      onOpenChange(false);
      window.location.reload(); // Refresh to show updated data
    } catch (error: any) {
      console.error('Error saving task:', error);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Ajouter une tâche'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="day">Jour</Label>
            <Select value={dayIndex.toString()} onValueChange={(value) => setDayIndex(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un jour" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {format(day, 'EEEE d MMMM', { locale: fr })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Lieu (optionnel)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu de la tâche"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
