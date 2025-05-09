
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarEvent, EventType } from '@/types/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  type: z.enum(['subscription', 'expiration', 'renewal', 'invoice']),
  date: z.date(),
  time: z.string(),
  description: z.string().optional(),
  subscriberId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate?: Date;
}

export const CalendarEventDialog: React.FC<CalendarEventDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  selectedDate
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'subscription',
      date: selectedDate || new Date(),
      time: '09:00',
      description: '',
      subscriberId: '',
    },
  });

  // Mettre à jour la date par défaut quand selectedDate change
  React.useEffect(() => {
    if (selectedDate) {
      form.setValue('date', selectedDate);
    }
  }, [selectedDate, form]);

  const handleSubmit = (values: FormValues) => {
    const { title, type, date, time, description, subscriberId } = values;
    
    // Combiner date et heure
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes);
    
    onSubmit({
      title,
      type: type as EventType,
      date: eventDate.toISOString(),
      description: description || '',
      metadata: subscriberId ? { 
        subscriberId,
        // Dans une application réelle, nous chercherions le nom de l'abonné dans la base de données
        subscriberName: `Abonné #${subscriberId}`,
      } : undefined,
    });
    
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel événement</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'événement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'événement</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="subscription">Souscription</SelectItem>
                      <SelectItem value="expiration">Expiration</SelectItem>
                      <SelectItem value="renewal">Renouvellement</SelectItem>
                      <SelectItem value="invoice">Facturation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={fr}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subscriberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID d'abonné (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="ID de l'abonné concerné" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Détails supplémentaires sur l'événement" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
