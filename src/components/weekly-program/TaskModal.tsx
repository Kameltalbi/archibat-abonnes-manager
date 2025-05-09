
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WeeklyTask } from '@/pages/WeeklyProgram';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<WeeklyTask, 'id'>) => void;
  task: WeeklyTask | null;
  weekDays: Date[];
  selectedDayIndex: number | null;
}

// Form schema
const taskFormSchema = z.object({
  dayIndex: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Veuillez sélectionner un jour",
  }),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  title: z.string().min(1, "Le titre est requis"),
  location: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export const TaskModal = ({
  open,
  onOpenChange,
  onSave,
  task,
  weekDays,
  selectedDayIndex,
}: TaskModalProps) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      dayIndex: selectedDayIndex !== null ? String(selectedDayIndex) : "",
      startTime: task?.startTime || "",
      endTime: task?.endTime || "",
      title: task?.title || "",
      location: task?.location || "",
    },
  });

  // Reset form when modal opens or selected task changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        dayIndex: task?.dayIndex !== undefined ? String(task.dayIndex) : selectedDayIndex !== null ? String(selectedDayIndex) : "",
        startTime: task?.startTime || "",
        endTime: task?.endTime || "",
        title: task?.title || "",
        location: task?.location || "",
      });
    }
  }, [open, task, selectedDayIndex, form]);

  function onSubmit(data: TaskFormValues) {
    const dayIndex = parseInt(data.dayIndex);
    
    onSave({
      dayIndex,
      date: weekDays[dayIndex],
      startTime: data.startTime,
      endTime: data.endTime,
      title: data.title,
      location: data.location,
    });
    
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier' : 'Ajouter'} une tâche</DialogTitle>
          <DialogDescription>
            Complétez les informations ci-dessous pour {task ? 'modifier' : 'créer'} une tâche dans votre programme.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Day field */}
            <FormField
              control={form.control}
              name="dayIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jour</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un jour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weekDays.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {format(day, "EEEE d MMMM", { locale: fr })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intitulé</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la tâche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Location field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu ou note (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Lieu ou note complémentaire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {task ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
