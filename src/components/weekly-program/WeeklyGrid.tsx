
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PlusIcon, Edit, Trash, Eye } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WeeklyTask } from '@/pages/WeeklyProgram';
import { useUserRole } from '@/hooks/useUserRole';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WeeklyGridProps {
  weekDays: Date[];
  tasks: WeeklyTask[];
  onAddTask: (dayIndex: number) => void;
  onEditTask: (task: WeeklyTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const WeeklyGrid = ({
  weekDays,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask
}: WeeklyGridProps) => {
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null);
  const { isAdmin } = useUserRole();

  // Group tasks by day
  const tasksByDay: Record<number, WeeklyTask[]> = {};
  
  // Initialize empty arrays for each day
  for (let i = 0; i < 5; i++) {
    tasksByDay[i] = [];
  }
  
  // Fill in tasks for each day
  tasks.forEach(task => {
    if (task.dayIndex >= 0 && task.dayIndex <= 4 && tasksByDay[task.dayIndex]) {
      tasksByDay[task.dayIndex].push(task);
    }
  });

  // Sort tasks by start time
  Object.keys(tasksByDay).forEach(day => {
    tasksByDay[parseInt(day)].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  // Filtrer les jours de semaine uniquement (lundi à vendredi)
  const workDays = weekDays.slice(0, 5);

  const handleDeleteClick = (taskId: string) => {
    if (!isAdmin) {
      return;
    }
    setTaskToDelete(taskId);
  };

  const confirmDelete = () => {
    if (taskToDelete && isAdmin) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {workDays.map((day, index) => (
          <div key={index} className="text-center font-medium">
            <div className="text-sm text-muted-foreground">{format(day, "EEEE", { locale: fr })}</div>
            <div className="text-lg">{format(day, "d MMM", { locale: fr })}</div>
          </div>
        ))}
      </div>
      
      {/* Grid for tasks */}
      <div className="grid grid-cols-5 gap-4">
        {workDays.map((day, dayIndex) => (
          <div key={dayIndex} className="min-h-[220px] border rounded-lg p-3 bg-gray-50">
            {/* Tasks for this day */}
            <div className="space-y-3">
              {tasksByDay[dayIndex]?.map((task) => (
                <Card key={task.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="font-medium text-base">{task.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.startTime} - {task.endTime}
                    </div>
                    {task.location && (
                      <div className="text-sm text-muted-foreground mt-1">
                        📍 {task.location}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => onEditTask(task)}
                          >
                            {isAdmin ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{isAdmin ? 'Modifier' : 'Voir'}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isAdmin ? 'Modifier' : 'Voir les détails'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {isAdmin && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
                              onClick={() => handleDeleteClick(task.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Add task button - available for all authenticated users */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-muted-foreground hover:text-foreground"
              onClick={() => onAddTask(dayIndex)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        ))}
      </div>

      {/* Confirmation dialog for delete - only for admins */}
      {isAdmin && (
        <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete} 
                className="bg-red-500 hover:bg-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
