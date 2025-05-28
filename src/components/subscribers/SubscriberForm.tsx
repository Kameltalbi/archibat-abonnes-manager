import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useEmailSender } from '@/hooks/useEmailSender';
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
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }).optional(),
  email: z.string().email({ message: 'L\'adresse email est invalide' }),
  telephone: z.string().optional(),
  typeAbonnement: z.string(),
  dateDebut: z.string(),
  duree: z.number().min(1, { message: 'La durée doit être d\'au moins 1 mois' }),
  montant: z.number().min(0, { message: 'Le montant doit être positif' }),
  pays: z.string().optional(),
  type: z.string().optional(), // Type d'institution
  adresse: z.string().optional(),
  contact: z.string().optional(),
  statut: z.string().default('en_attente'),
});

export type SubscriberFormValues = z.infer<typeof subscriberSchema>;

interface SubscriberFormProps {
  onClose?: () => void;
  isInternational?: boolean;
  isInstitution?: boolean;
}

export function SubscriberForm({ onClose, isInternational = false, isInstitution = false }: SubscriberFormProps) {
  const [loading, setLoading] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<{id: string, nom: string, duree: number, prix: number}[]>([]);
  const { sendWelcomeEmail } = useEmailSender();

  // Set up form with default values
  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      nom: '',
      prenom: isInstitution ? undefined : '',
      email: '',
      telephone: '',
      typeAbonnement: '',
      dateDebut: format(new Date(), 'yyyy-MM-dd'),
      duree: 12,
      montant: 0,
      pays: isInternational ? '' : 'Tunisie',
      type: isInstitution ? '' : undefined,
      adresse: '',
      contact: isInstitution ? '' : undefined,
      statut: 'en_attente',
    },
  });

  useEffect(() => {
    async function fetchSubscriptionTypes() {
      try {
        console.log('Chargement des types d\'abonnement...');
        
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

        console.log('Types d\'abonnement récupérés:', data);
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
    console.log('Type d\'abonnement changé pour:', typeId);
    const selectedType = subscriptionTypes.find(type => type.id === typeId);
    if (selectedType) {
      console.log('Type sélectionné:', selectedType);
      form.setValue('duree', selectedType.duree);
      form.setValue('montant', selectedType.prix);
    }
  };

  const onSubmit = async (values: SubscriberFormValues) => {
    try {
      setLoading(true);
      
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
      
      if (isInstitution) {
        const institutionData = {
          nom: values.nom,
          type: values.type || 'Autre',
          adresse: values.adresse || null,
          telephone: values.telephone || null,
          email: values.email,
          contact: values.contact || null,
          date_adhesion: values.dateDebut,
          statut: values.statut,
          created_by: session.user.id,
        };
        
        console.log('Enregistrement de l\'institution:', institutionData);
        
        const { data, error } = await supabase
          .from('institutions')
          .insert([institutionData])
          .select();
          
        if (error) {
          console.error('Erreur lors de l\'enregistrement de l\'institution:', error);
          toast({
            title: "Erreur",
            description: `Impossible d'enregistrer l'institution: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        console.log('Institution enregistrée avec succès:', data);
        
        toast({
          title: "Succès",
          description: "Institution ajoutée avec succès",
        });
      } else {
        // Prepare data for Supabase insert - now including address
        const subscriberData = {
          nom: values.nom,
          prenom: values.prenom || '',
          email: values.email,
          telephone: values.telephone || null,
          adresse: values.adresse || null,
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
        
        // Get subscription type name for email
        const selectedType = subscriptionTypes.find(type => type.id === values.typeAbonnement);
        
        // Send welcome email
        try {
          await sendWelcomeEmail({
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            typeAbonnement: selectedType?.nom || 'Abonnement standard',
            dateDebut: values.dateDebut,
            dateFin: format(endDate, 'yyyy-MM-dd'),
          });
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
          // Ne pas bloquer l'inscription si l'email échoue
        }
        
        toast({
          title: "Succès",
          description: "Abonné ajouté avec succès et email de confirmation envoyé",
        });
      }

      if (onClose) {
        onClose();
      } else {
        form.reset();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout",
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
                    <FormLabel>{isInstitution ? "Nom de l'institution" : "Nom"}</FormLabel>
                    <FormControl>
                      <Input placeholder={isInstitution ? "Université de Tunis" : "Nom"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isInstitution ? (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'institution</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Université">Université</SelectItem>
                          <SelectItem value="École">École</SelectItem>
                          <SelectItem value="Institut">Institut</SelectItem>
                          <SelectItem value="Centre de recherche">Centre de recherche</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
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
              )}
              
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
              
              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse complète" {...field} />
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
              
              {isInstitution && (
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personne à contacter</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom et prénom" {...field} />
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
                            {type.nom} ({type.prix} DT / {type.duree} mois)
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
                    <FormLabel>{isInstitution ? "Date d'adhésion" : "Date de début"}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isInstitution && (
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
              )}
              
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
              
              {isInstitution && (
                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
