
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const institutionFormSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  type: z.string().min(1, { message: 'Veuillez sélectionner un type' }),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email({ message: 'Veuillez entrer un email valide' }).optional().or(z.literal('')),
  contact: z.string().optional(),
  dateAdhesion: z.string().optional(),
  statut: z.enum(['actif', 'inactif', 'en_attente']),
});

type InstitutionFormValues = z.infer<typeof institutionFormSchema>;

interface InstitutionFormProps {
  onClose: () => void;
  editingInstitution?: {
    id: string;
    nom: string;
    type: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    contact?: string;
    dateAdhesion?: string;
    statut: 'actif' | 'inactif' | 'en_attente';
  };
}

export function InstitutionForm({ onClose, editingInstitution }: InstitutionFormProps) {
  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: editingInstitution ? {
      nom: editingInstitution.nom,
      type: editingInstitution.type,
      adresse: editingInstitution.adresse || '',
      telephone: editingInstitution.telephone || '',
      email: editingInstitution.email || '',
      contact: editingInstitution.contact || '',
      dateAdhesion: editingInstitution.dateAdhesion || '',
      statut: editingInstitution.statut,
    } : {
      nom: '',
      type: '',
      adresse: '',
      telephone: '',
      email: '',
      contact: '',
      dateAdhesion: '',
      statut: 'en_attente',
    },
  });

  async function onSubmit(values: InstitutionFormValues) {
    try {
      const formattedValues = {
        nom: values.nom,
        type: values.type,
        adresse: values.adresse || null,
        telephone: values.telephone || null,
        email: values.email || null,
        contact: values.contact || null,
        date_adhesion: values.dateAdhesion ? values.dateAdhesion : null,
        statut: values.statut,
      };

      if (editingInstitution) {
        const { error } = await supabase
          .from('institutions')
          .update(formattedValues)
          .eq('id', editingInstitution.id);

        if (error) throw error;
        toast({
          title: 'Institution mise à jour',
          description: 'L\'institution a été mise à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('institutions')
          .insert([formattedValues]);

        if (error) throw error;
        toast({
          title: 'Institution ajoutée',
          description: 'L\'institution a été ajoutée avec succès',
        });
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'institution:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de l\'institution',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'institution</FormLabel>
                <FormControl>
                  <Input placeholder="Université de Tunis" {...field} />
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

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="+216 xx xxx xxx" {...field} />
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
                  <Input type="email" placeholder="contact@institution.com" {...field} />
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
                <FormLabel>Personne à contacter</FormLabel>
                <FormControl>
                  <Input placeholder="Nom et prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateAdhesion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'adhésion</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            {editingInstitution ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
