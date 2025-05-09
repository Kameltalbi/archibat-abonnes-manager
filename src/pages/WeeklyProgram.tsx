
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarDaysIcon, Copy } from 'lucide-react';
import { WeekSelector } from '@/components/weekly-program/WeekSelector';
import { WeeklyGrid } from '@/components/weekly-program/WeeklyGrid';
import { TaskModal } from '@/components/weekly-program/TaskModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const { toast } = useToast();
  
  // Sample initial tasks (would normally come from a database)
  const [tasks, setTasks] = useState<WeeklyTask[]>([
    {
      id: '1',
      dayIndex: 0,
      date: startOfWeek(new Date(), { weekStartsOn: 1 }),
      startTime: '09:00',
      endTime: '10:30',
      title: 'Réunion équipe',
      location: 'Bureau principal'
    },
    {
      id: '2',
      dayIndex: 2,
      date: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2),
      startTime: '14:00',
      endTime: '15:00',
      title: 'Appel client',
      location: 'Téléphone'
    }
  ]);

  // Get week dates (Mon-Sun) based on selectedWeek
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };
  
  const weekDays = getWeekDays(selectedWeek);

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
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  };

  // Handle saving a task (new or edited)
  const handleSaveTask = (task: Omit<WeeklyTask, 'id'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
      toast({
        title: "Tâche modifiée",
        description: "La tâche a été modifiée avec succès.",
      });
    } else {
      // Add new task
      const newTask = {
        ...task,
        id: Math.random().toString(36).substring(7),
      };
      setTasks([...tasks, newTask]);
      toast({
        title: "Tâche ajoutée",
        description: "La tâche a été ajoutée avec succès.",
      });
    }
    setIsTaskModalOpen(false);
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

  // Filter tasks for the selected week
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  
  const currentWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

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
          
          <WeeklyGrid 
            weekDays={weekDays}
            tasks={currentWeekTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
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
