
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, User, Mail, Phone, MapPin } from "lucide-react";
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  nomComplet: z.string().min(2, 'Le nom est requis'),
  contact: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  pays: z.string().default('Tunisie'),
  dateDebut: z.date({
    required_error: "La date de début est requise",
  }),
  duree: z.string().min(1, 'La durée est requise'),
  montant: z.number().min(0, 'Le montant doit être positif'),
  modePaiement: z.string().min(1, 'Le mode de paiement est requis'),
  commentaires: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const dureeOptions = [
  { value: "12", label: "12 mois" },
  { value: "24", label: "24 mois" },
  { value: "36", label: "36 mois" },
  { value: "custom", label: "Personnalisée" }
];

const modePaiementOptions = [
  { value: "especes", label: "Espèces" },
  { value: "cheque", label: "Chèque" },
  { value: "virement", label: "Virement" },
  { value: "enligne", label: "En ligne" }
];

// Prix mensuel par défaut pour calculer le montant
const PRIX_MENSUEL = 10; // en DT

export function SubscriberForm({ onClose }: { onClose?: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomComplet: '',
      contact: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: 'Tunisie',
      dateDebut: new Date(),
      duree: '12',
      montant: 12 * PRIX_MENSUEL,
      modePaiement: '',
      commentaires: '',
    },
  });

  // Calculer le montant en fonction de la durée sélectionnée
  useEffect(() => {
    const duree = form.watch('duree');
    let montantCalcule = 0;
    
    if (duree === 'custom') {
      montantCalcule = 0;
    } else {
      montantCalcule = parseInt(duree) * PRIX_MENSUEL;
    }
    
    form.setValue('montant', montantCalcule);
  }, [form.watch('duree')]);

  function onSubmit(data: FormValues) {
    console.log('Form submitted:', data);
    toast.success('Abonné ajouté avec succès!');
    form.reset();
    if (onClose) onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">1. Informations de base</h3>
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nomComplet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet / Raison sociale
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nom complet ou raison sociale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Personne à contacter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+216 XX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse complète
          </h4>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rue</FormLabel>
                  <FormControl>
                    <Input placeholder="Rue, numéro, bâtiment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="codePostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">2. Abonnement</h3>
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date de début d'abonnement
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une durée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dureeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="montant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (DT)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                      className="bg-muted/50" 
                      disabled={form.watch('duree') !== 'custom'} 
                    />
                  </FormControl>
                  <FormDescription>
                    Calculé automatiquement en fonction de la durée
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modePaiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de paiement</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un mode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modePaiementOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">3. Notes internes</h3>
          <Separator className="my-4" />
          
          <FormField
            control={form.control}
            name="commentaires"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaires internes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Notes additionnelles (non visibles pour l'abonné)" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Ces commentaires sont à usage interne uniquement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer l'abonné</Button>
        </div>
      </form>
    </Form>
  );
}
