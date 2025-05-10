
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon, Copy, Loader2 } from 'lucide-react';
import { WeekSelector } from '@/components/weekly-program/WeekSelector';
import { WeeklyGrid } from '@/components/weekly-program/WeeklyGrid';
import { TaskModal } from '@/components/weekly-program/TaskModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { addDays, startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

export type WeeklyTask = {
  id: string;
  dayIndex: number; // 0-6 for Monday-Sunday
  date: Date;
  startTime: string;
  endTime: string;
  title: string;
  location?: string;
};

const WeeklyProgram = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WeeklyTask | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get week dates (Mon-Sun) based on selectedWeek
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };
  
  const weekDays = getWeekDays(selectedWeek);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    setIsLoading(true);
    
    try {
      // Calculate week start and end dates for filtering
      const weekStart = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(addDays(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd');
      
      console.log('Fetching tasks from', weekStart, 'to', weekEnd);
      
      const { data, error } = await supabase
        .from('weekly_tasks')
        .select('*')
        .gte('date', weekStart)
        .lte('date', weekEnd);
        
      if (error) throw error;
      
      console.log('Fetched tasks:', data);
      
      if (data) {
        const mappedTasks: WeeklyTask[] = data.map(task => ({
          id: task.id,
          dayIndex: task.day_index,
          date: parseISO(task.date),
          startTime: task.start_time,
          endTime: task.end_time,
          title: task.title,
          location: task.location
        }));
        
        setTasks(mappedTasks);
      } else {
        setTasks([]);
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les tâches",
        variant: "destructive",
      });
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch tasks when selected week changes
  useEffect(() => {
    fetchTasks();
  }, [selectedWeek]);

  // Handle opening the task modal
  const handleAddTask = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Handle editing a task
  const handleEditTask = (task: WeeklyTask) => {
    setEditingTask(task);
    setSelectedDayIndex(task.dayIndex);
    setIsTaskModalOpen(true);
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
      });
      
      fetchTasks(); // Refresh tasks
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive",
      });
    }
  };

  // Handle saving a task (new or edited)
  const handleSaveTask = (task: Omit<WeeklyTask, 'id'>) => {
    // TaskModal now handles saving directly to Supabase
    fetchTasks();
  };

  // Handle duplicating a previous week
  const handleDuplicateWeek = () => {
    // For now, just show a notification
    // In a real implementation, this would fetch previous weeks and allow selection
    toast({
      title: "Fonctionnalité en développement",
      description: "La duplication de semaine sera disponible prochainement.",
    });
  };

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Programme de Travail Hebdomadaire" 
        description={`Du ${format(weekDays[0], 'dd MMMM', { locale: fr })} au ${format(weekDays[6], 'dd MMMM yyyy', { locale: fr })}`}
        icon={<CalendarDaysIcon className="h-6 w-6 text-archibat-blue" />}
      >
        <Button 
          variant="outline"
          onClick={handleDuplicateWeek}
          className="flex items-center gap-1 mr-2"
        >
          <Copy className="h-4 w-4" />
          Dupliquer une semaine
        </Button>
        <Button 
          onClick={() => handleAddTask(new Date().getDay() - 1)}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </PageHeader>
      
      <div className="mt-6">
        <div className="bg-white rounded-lg border shadow p-6">
          <div className="mb-6">
            <WeekSelector 
              selectedWeek={selectedWeek} 
              onWeekChange={setSelectedWeek} 
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-archibat-blue" />
            </div>
          ) : (
            <WeeklyGrid 
              weekDays={weekDays}
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>

      <TaskModal 
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onSave={handleSaveTask}
        task={editingTask}
        weekDays={weekDays}
        selectedDayIndex={selectedDayIndex}
      />
    </div>
  );
};

export default WeeklyProgram;
