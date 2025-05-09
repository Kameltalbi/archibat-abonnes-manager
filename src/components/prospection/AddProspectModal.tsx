
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Prospect, ProspectStatus } from '@/pages/Prospection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AddProspectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (prospect: Omit<Prospect, 'id' | 'dateCreation'>) => void;
}

const formSchema = z.object({
  entreprise: z.string().min(1, { message: 'L\'entreprise est requise' }),
  contact: z.string().min(1, { message: 'Le nom du contact est requis' }),
  email: z.string().email({ message: 'Email invalide' }),
  telephone: z.string().min(1, { message: 'Le téléphone est requis' }),
  statut: z.enum(['nouveau', 'contact_initial', 'proposition', 'negociation', 'gagne', 'perdu'] as const),
  valeurPotentielle: z.number().positive({ message: 'La valeur doit être positive' }),
  dateDernierContact: z.string(),
  notes: z.string(),
});

export function AddProspectModal({ open, onOpenChange, onSubmit }: AddProspectModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entreprise: '',
      contact: '',
      email: '',
      telephone: '',
      statut: 'nouveau' as ProspectStatus,
      valeurPotentielle: 0,
      dateDernierContact: '',
      notes: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    form.reset();
  };

  const getStatusBadge = (status: ProspectStatus) => {
    switch (status) {
      case 'nouveau':
        return <Badge className="bg-blue-500">Nouveau</Badge>;
      case 'contact_initial':
        return <Badge className="bg-purple-500">Contact initial</Badge>;
      case 'proposition':
        return <Badge className="bg-amber-500">Proposition</Badge>;
      case 'negociation':
        return <Badge className="bg-orange-500">Négociation</Badge>;
      case 'gagne':
        return <Badge className="bg-green-500">Gagné</Badge>;
      case 'perdu':
        return <Badge className="bg-red-500">Perdu</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau prospect</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="entreprise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
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
                    <Input placeholder="Nom du contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nouveau">Nouveau</SelectItem>
                        <SelectItem value="contact_initial">Contact initial</SelectItem>
                        <SelectItem value="proposition">Proposition</SelectItem>
                        <SelectItem value="negociation">Négociation</SelectItem>
                        <SelectItem value="gagne">Gagné</SelectItem>
                        <SelectItem value="perdu">Perdu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valeurPotentielle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur potentielle (DT)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes ou commentaires..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
