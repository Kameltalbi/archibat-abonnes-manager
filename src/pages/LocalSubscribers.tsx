
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
  const [authStatus, setAuthStatus] = useState<'authenticated' | 'unauthenticated' | 'checking'>('checking');

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      setAuthStatus(data.session ? 'authenticated' : 'unauthenticated');
    }
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        
        if (authStatus !== 'authenticated') {
          console.log('Utilisateur non authentifié, impossible de charger les abonnés');
          return;
        }
        
        // Make sure we're correctly selecting the subscription type data
        const { data, error } = await supabase
          .from('local_subscribers')
          .select(`
            *,
            subscription_types (
              id, 
              nom, 
              prix, 
              duree
            )
          `)
          .order('nom');
          
        if (error) {
          throw error;
        }
        
        console.log('Données brutes des abonnés:', data);
        
        const formattedData: Subscriber[] = data.map(sub => ({
          id: sub.id,
          nom: sub.nom,
          prenom: sub.prenom,
          email: sub.email,
          telephone: sub.telephone || '',
          typeAbonnement: sub.subscription_types ? sub.subscription_types.nom : 'Standard',
          dateDebut: new Date(sub.date_debut).toLocaleDateString('fr-FR'),
          dateFin: new Date(sub.date_fin).toLocaleDateString('fr-FR'),
          montant: sub.montant || (sub.subscription_types ? sub.subscription_types.prix : 0),
          statut: mapStatut(sub.statut),
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
    
    if (authStatus === 'authenticated') {
      fetchSubscribers();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus]);

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

  if (authStatus === 'checking') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <UserIcon className="h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold">Authentification requise</h2>
        <p className="text-gray-500">Veuillez vous connecter pour accéder à la gestion des abonnés</p>
      </div>
    );
  }

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
