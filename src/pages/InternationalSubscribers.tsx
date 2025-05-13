
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { InternationalSubscribersTable, InternationalSubscriber } from '@/components/subscribers/InternationalSubscribersTable';
import { Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { SubscriberForm } from '@/components/subscribers/SubscriberForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const InternationalSubscribers = () => {
  const [subscribers, setSubscribers] = useState<InternationalSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<'authenticated' | 'unauthenticated' | 'checking'>('checking');
  const [refreshFlag, setRefreshFlag] = useState(0); // Ajout d'un flag pour déclencher le rechargement

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

  // Fonction pour recharger les abonnés
  const refreshSubscribers = () => {
    setRefreshFlag(prev => prev + 1);
  };

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        setError(null);
        
        if (authStatus !== 'authenticated') {
          console.log('Utilisateur non authentifié, impossible de charger les abonnés');
          return;
        }
        
        // Make sure we're correctly selecting the subscription type data
        const { data, error } = await supabase
          .from('international_subscribers')
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
        
        console.log('Données brutes des abonnés internationaux:', data);
        
        const formattedData: InternationalSubscriber[] = data.map(sub => ({
          id: sub.id,
          nom: sub.nom,
          prenom: sub.prenom,
          email: sub.email,
          telephone: sub.telephone || '',
          pays: sub.pays,
          typeAbonnement: sub.subscription_types ? sub.subscription_types.nom : 'Standard',
          dateDebut: new Date(sub.date_debut).toLocaleDateString('fr-FR'),
          dateFin: new Date(sub.date_fin).toLocaleDateString('fr-FR'),
          montant: sub.montant || (sub.subscription_types ? sub.subscription_types.prix : 0),
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
    
    if (authStatus === 'authenticated') {
      fetchSubscribers();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus, refreshFlag]); // Ajout du refreshFlag aux dépendances

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

  if (authStatus === 'checking') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Globe className="h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold">Authentification requise</h2>
        <p className="text-gray-500">Veuillez vous connecter pour accéder à la gestion des abonnés internationaux</p>
      </div>
    );
  }

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
          onClick={() => refreshSubscribers()} 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const handleModalClose = () => {
    setModalOpen(false);
    refreshSubscribers(); // Rafraîchir la liste après la fermeture du modal
  };

  return (
    <div>
      <PageHeader 
        title="Abonnés internationaux" 
        description="Gestion des abonnés internationaux"
        icon={<Globe className="h-6 w-6 text-purple-500" />}
      >
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvel abonné international</DialogTitle>
            </DialogHeader>
            <SubscriberForm onClose={handleModalClose} isInternational={true} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <InternationalSubscribersTable subscribers={subscribers} />
    </div>
  );
};

export default InternationalSubscribers;
