
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { addMonths, format } from 'date-fns';

// Define the schema for form validation
const subscriberSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'L\'adresse email est invalide' }),
  telephone: z.string().optional(),
  typeAbonnement: z.string(),
  dateDebut: z.string(),
  duree: z.number().min(1, { message: 'La durée doit être d\'au moins 1 mois' }),
  montant: z.number().min(0, { message: 'Le montant doit être positif' }),
  pays: z.string().optional(),
});

export type SubscriberFormValues = z.infer<typeof subscriberSchema>;

interface SubscriberFormProps {
  onClose?: () => void;
  isInternational?: boolean;
}

export function SubscriberForm({ onClose, isInternational = false }: SubscriberFormProps) {
  const [loading, setLoading] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<{id: string, nom: string, duree: number, prix: number}[]>([]);

  // Set up form with default values
  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      typeAbonnement: '',
      dateDebut: format(new Date(), 'yyyy-MM-dd'),
      duree: 12,
      montant: 0,
      pays: isInternational ? '' : 'Tunisie',
    },
  });

  // Fetch subscription types on component mount
  useEffect(() => {
    async function fetchSubscriptionTypes() {
      try {
        const { data, error } = await supabase
          .from('subscription_types')
          .select('id, nom, duree, prix')
          .eq('actif', true);

        if (error) {
          console.error('Erreur lors du chargement des types d\'abonnement:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les types d'abonnement",
            variant: "destructive",
          });
          return;
        }

        setSubscriptionTypes(data || []);
        
        // Set default type if available
        if (data && data.length > 0) {
          form.setValue('typeAbonnement', data[0].id);
          form.setValue('duree', data[0].duree);
          form.setValue('montant', data[0].prix);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }

    fetchSubscriptionTypes();
  }, [form]);

  const onTypeChange = (typeId: string) => {
    const selectedType = subscriptionTypes.find(type => type.id === typeId);
    if (selectedType) {
      form.setValue('duree', selectedType.duree);
      form.setValue('montant', selectedType.prix);
    }
  };

  const onSubmit = async (values: SubscriberFormValues) => {
    try {
      setLoading(true);
      
      // Get the session to check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur d\'authentification:', sessionError);
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour ajouter un abonné",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      if (!session) {
        toast({
          title: "Authentification requise",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Calculate end date based on start date and duration
      const startDate = new Date(values.dateDebut);
      const endDate = addMonths(startDate, values.duree);

      // Prepare data for Supabase insert
      const subscriberData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone || null,
        type_abonnement_id: values.typeAbonnement,
        date_debut: values.dateDebut,
        date_fin: format(endDate, 'yyyy-MM-dd'),
        montant: values.montant,
        statut: 'actif',
        created_by: session.user.id,
      };

      // Insert into the appropriate table based on isInternational flag
      const tableName = isInternational ? 'international_subscribers' : 'local_subscribers';
      
      // Add pays field for international subscribers
      const finalData = isInternational 
        ? { ...subscriberData, pays: values.pays || 'Non spécifié' }
        : subscriberData;
      
      console.log('Enregistrement de l\'abonné dans la table:', tableName);
      console.log('Données:', finalData);

      const { data, error } = await supabase
        .from(tableName)
        .insert([finalData])
        .select();

      if (error) {
        console.error(`Erreur lors de l'enregistrement de l'abonné dans ${tableName}:`, error);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer l'abonné: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Abonné enregistré avec succès:', data);
      
      toast({
        title: "Succès",
        description: "Abonné ajouté avec succès",
      });

      // Close the form/modal if onClose prop is provided
      if (onClose) {
        onClose();
      } else {
        // Reset form if no onClose provided
        form.reset();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'abonné:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'abonné",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
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
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isInternational && (
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
              )}
              
              <FormField
                control={form.control}
                name="typeAbonnement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'abonnement</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        onTypeChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type d'abonnement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subscriptionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.nom}
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
                name="dateDebut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (mois)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="montant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
