
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { InternationalSubscribersTable, InternationalSubscriber } from '@/components/subscribers/InternationalSubscribersTable';
import { Globe } from 'lucide-react';
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const InternationalSubscribers = () => {
  const [subscribers, setSubscribers] = useState<InternationalSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('international_subscribers')
          .select('*, type_abonnement_id(nom)')
          .order('nom');
          
        if (error) {
          throw error;
        }
        
        const formattedData: InternationalSubscriber[] = data.map(sub => ({
          id: sub.id,
          nom: sub.nom,
          prenom: sub.prenom,
          email: sub.email,
          telephone: sub.telephone || '',
          pays: sub.pays,
          typeAbonnement: typeof sub.type_abonnement_id === 'object' && sub.type_abonnement_id !== null 
            ? (sub.type_abonnement_id as any).nom || 'Standard'
            : 'Standard',
          dateDebut: new Date(sub.date_debut).toLocaleDateString('fr-FR'),
          dateFin: new Date(sub.date_fin).toLocaleDateString('fr-FR'),
          montant: sub.montant,
          statut: mapStatut(sub.statut),
        }));
        
        setSubscribers(formattedData);
      } catch (error) {
        console.error('Erreur lors du chargement des abonnés internationaux:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données des abonnés internationaux",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscribers();
  }, []);

  // Fonction pour mapper le statut aux valeurs attendues
  const mapStatut = (statut: string): 'actif' | 'en_attente' | 'expire' => {
    switch (statut) {
      case 'actif':
        return 'actif';
      case 'en_attente':
        return 'en_attente';
      case 'expire':
      case 'expiré':
        return 'expire';
      default:
        return 'en_attente';
    }
  };

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
        title="Abonnés internationaux" 
        description="Gestion des abonnés internationaux"
        icon={<Globe className="h-6 w-6 text-purple-500" />}
      >
        <AddSubscriberModal />
      </PageHeader>
      
      <InternationalSubscribersTable subscribers={subscribers} />
    </div>
  );
};

export default InternationalSubscribers;
