
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SubscribersTable, Subscriber } from '@/components/subscribers/SubscribersTable';
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal';
import { UserIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const LocalSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('local_subscribers')
          .select('*, type_abonnement_id(nom)')
          .order('nom');
          
        if (error) {
          throw error;
        }
        
        const formattedData: Subscriber[] = data.map(sub => ({
          id: sub.id,
          nom: sub.nom,
          prenom: sub.prenom,
          email: sub.email,
          telephone: sub.telephone || '',
          typeAbonnement: sub.type_abonnement_id?.nom || 'Standard',
          dateDebut: new Date(sub.date_debut).toLocaleDateString('fr-FR'),
          dateFin: new Date(sub.date_fin).toLocaleDateString('fr-FR'),
          montant: sub.montant,
          statut: sub.statut,
        }));
        
        setSubscribers(formattedData);
      } catch (error) {
        console.error('Erreur lors du chargement des abonnés locaux:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données des abonnés locaux",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Abonnés locaux" 
        description="Gestion des abonnés en Tunisie"
        icon={<UserIcon className="h-6 w-6 text-blue-500" />}
      >
        <AddSubscriberModal />
      </PageHeader>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
};

export default LocalSubscribers;
