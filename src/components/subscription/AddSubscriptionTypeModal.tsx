
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { SubscriptionType } from '@/pages/SubscriptionTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DialogDescription } from '@/components/ui/dialog';

interface AddSubscriptionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SubscriptionType, 'id'>) => void;
}

type SubscriptionTypeFormData = Omit<SubscriptionType, 'id'>;

export function AddSubscriptionTypeModal({ isOpen, onClose, onSubmit }: AddSubscriptionTypeModalProps) {
  const [loading, setLoading] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  
  const form = useForm<SubscriptionTypeFormData>({
    defaultValues: {
      nom: '',
      description: '',
      duree: 12,
      prix: 0,
      typeLecteur: 'particulier',
      actif: true
    }
  });

  // Fetch subscription types from Supabase when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionTypes();
    }
  }, [isOpen]);

  const fetchSubscriptionTypes = async () => {
    try {
      setLoading(true);
      console.log('Chargement des types d\'abonnement existants...');
      
      const { data, error } = await supabase
        .from('subscription_types')
        .select('*')
        .order('nom');
      
      if (error) {
        console.error('Erreur lors du chargement des types d\'abonnement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les types d'abonnement existants",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Types d\'abonnement récupérés:', data);
      
      // Map the data from Supabase to match our SubscriptionType interface
      const mappedTypes: SubscriptionType[] = data.map(item => ({
        id: item.id,
        nom: item.nom,
        description: item.description || '',
        duree: item.duree,
        prix: item.prix,
        typeLecteur: item.type_lecteur, // Map from type_lecteur to typeLecteur
        actif: item.actif || true
      }));
      
      setSubscriptionTypes(mappedTypes);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data: SubscriptionTypeFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un type d'abonnement</DialogTitle>
          <DialogDescription>
            Créez un nouveau type d'abonnement ou consultez les types existants.
          </DialogDescription>
        </DialogHeader>
        
        {/* Display existing subscription types */}
        {subscriptionTypes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Types d'abonnement existants:</h3>
            <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {subscriptionTypes.map((type) => (
                  <li key={type.id} className="text-sm flex justify-between">
                    <span className="font-medium">{type.nom}</span>
                    <span className="text-muted-foreground">{type.prix} DT / {type.duree} mois</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom du type d'abonnement" required />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Description du type d'abonnement" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (mois)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="typeLecteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de lecteur</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de lecteur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="particulier">Particulier</SelectItem>
                      <SelectItem value="etudiant">Étudiant</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actif"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Actif
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
