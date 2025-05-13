
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        setError(null);
        
        // Query for international subscribers
        const { data, error } = await supabase
          .from('international_subscribers')
          .select('*')
          .order('nom');
          
        if (error) {
          throw error;
        }
        
        // Retrieve subscription types separately
        const { data: typesAbonnement, error: typesError } = await supabase
          .from('subscription_types')
          .select('id, nom');
          
        if (typesError) {
          console.error("Erreur lors du chargement des types d'abonnement:", typesError);
        }
        
        // Create a mapping of subscription types for easier lookup
        const typeMap = typesAbonnement ? 
          Object.fromEntries(typesAbonnement.map(type => [type.id, type.nom])) : 
          {};
        
        const formattedData: InternationalSubscriber[] = data.map(sub => ({
          id: sub.id,
          nom: sub.nom,
          prenom: sub.prenom,
          email: sub.email,
          telephone: sub.telephone || '',
          pays: sub.pays,
          // Use the mapping or a default value
          typeAbonnement: sub.type_abonnement_id ? typeMap[sub.type_abonnement_id] || 'Standard' : 'Standard',
          dateDebut: new Date(sub.date_debut).toLocaleDateString('fr-FR'),
          dateFin: new Date(sub.date_fin).toLocaleDateString('fr-FR'),
          montant: sub.montant,
          statut: mapStatut(sub.statut),
        }));
        
        setSubscribers(formattedData);
        console.log("Données d'abonnés internationaux chargées avec succès:", formattedData);
      } catch (err) {
        console.error('Erreur lors du chargement des abonnés internationaux:', err);
        setError('Impossible de charger les données des abonnés internationaux');
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

  // Map the status to expected values
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Globe className="h-12 w-12 text-purple-500 opacity-50" />
        <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Réessayer
        </button>
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
