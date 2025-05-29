
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Lock } from 'lucide-react';
import { WeeklyTask } from '@/pages/WeeklyProgram';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  onSave,
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
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();

  // Determine if this is an edit operation (task exists) or create operation
  const isEditMode = !!task;
  const canModify = isEditMode ? isAdmin : true; // Anyone can create, only admin can edit

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
    if (isEditMode && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier les tâches existantes.",
        variant: "destructive",
      });
      return;
    }

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
      // Utiliser la date correspondant au jour de la semaine sélectionné
      const selectedDate = weekDays[dayIndex];
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      console.log('Saving task for date:', formattedDate, 'day index:', dayIndex);
      
      const taskData = {
        title,
        day_index: dayIndex,
        date: formattedDate,
        start_time: startTime,
        end_time: endTime,
        location: location || null
      };
      
      if (task?.id) {
        // Update existing task - only admins can do this
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
        // Insert new task - any authenticated user can do this
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
      onSave({
        title,
        dayIndex,
        date: selectedDate,
        startTime,
        endTime,
        location
      });
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

  if (isRoleLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chargement...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Détails de la tâche' : 'Ajouter une tâche'}
            {isEditMode && !isAdmin && <Lock className="inline ml-2 h-4 w-4" />}
          </DialogTitle>
        </DialogHeader>
        
        {isEditMode && !isAdmin && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Vous pouvez consulter les détails de cette tâche, mais seuls les administrateurs peuvent la modifier.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              disabled={!canModify}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="day">Jour</Label>
            <Select 
              value={dayIndex.toString()} 
              onValueChange={(value) => setDayIndex(parseInt(value))}
              disabled={!canModify}
            >
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
                disabled={!canModify}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!canModify}
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
              disabled={!canModify}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {canModify ? 'Annuler' : 'Fermer'}
          </Button>
          {canModify && (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Modifier' : 'Ajouter'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
