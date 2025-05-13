
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, BookOpenIcon } from 'lucide-react';
import { SubscriptionTypeTable } from '@/components/subscription/SubscriptionTypeTable';
import { useToast } from '@/hooks/use-toast';
import { AddSubscriptionTypeModal } from '@/components/subscription/AddSubscriptionTypeModal';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionType = {
  id: string;
  nom: string;
  description: string;
  duree: number; // in months
  prix: number;
  typeLecteur: 'particulier' | 'etudiant' | 'institution';
  actif: boolean;
};

const SubscriptionTypes = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionTypes();
  }, []);

  const fetchSubscriptionTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscription_types')
        .select('*')
        .order('nom');
      
      if (error) {
        console.error('Erreur lors du chargement des types d\'abonnement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les types d'abonnement",
          variant: "destructive",
        });
        return;
      }
      
      // Map Supabase data to SubscriptionType format
      const mappedTypes: SubscriptionType[] = data.map(item => {
        // Validate type_lecteur is one of the allowed values
        let typeLecteur: 'particulier' | 'etudiant' | 'institution' = 'particulier';
        
        if (item.type_lecteur === 'particulier' || 
            item.type_lecteur === 'etudiant' || 
            item.type_lecteur === 'institution') {
          typeLecteur = item.type_lecteur as 'particulier' | 'etudiant' | 'institution';
        }
        
        return {
          id: item.id,
          nom: item.nom,
          description: item.description || '',
          duree: item.duree,
          prix: item.prix,
          typeLecteur: typeLecteur,
          actif: item.actif ?? true
        };
      });
      
      setSubscriptionTypes(mappedTypes);
    } catch (err) {
      console.error('Erreur:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSubscriptionType = async (subscriptionType: Omit<SubscriptionType, 'id'>) => {
    try {
      // Préparer les données pour Supabase (convertir typeLecteur en type_lecteur)
      const supabaseData = {
        nom: subscriptionType.nom,
        description: subscriptionType.description,
        duree: subscriptionType.duree,
        prix: subscriptionType.prix,
        type_lecteur: subscriptionType.typeLecteur,
        actif: subscriptionType.actif,
      };

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('subscription_types')
        .insert(supabaseData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Convertir la réponse au format SubscriptionType
      const newSubscriptionType: SubscriptionType = {
        id: data.id,
        nom: data.nom,
        description: data.description || '',
        duree: data.duree,
        prix: data.prix,
        typeLecteur: data.type_lecteur as 'particulier' | 'etudiant' | 'institution',
        actif: data.actif,
      };

      // Mettre à jour l'état local
      setSubscriptionTypes([...subscriptionTypes, newSubscriptionType]);
      
      toast({
        title: "Type d'abonnement ajouté",
        description: `Le type d'abonnement ${subscriptionType.nom} a été ajouté avec succès.`,
      });
      
      handleCloseAddModal();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du type d\'abonnement:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le type d'abonnement",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      // Trouver le type d'abonnement dans l'état local
      const subscriptionType = subscriptionTypes.find(type => type.id === id);
      if (!subscriptionType) return;
      
      const newStatus = !subscriptionType.actif;
      
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('subscription_types')
        .update({ actif: newStatus })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Mettre à jour l'état local
      setSubscriptionTypes(subscriptionTypes.map(type => 
        type.id === id ? { ...type, actif: newStatus } : type
      ));
      
      toast({
        title: newStatus ? "Type d'abonnement activé" : "Type d'abonnement désactivé",
        description: `Le type d'abonnement ${subscriptionType.nom} a été ${newStatus ? 'activé' : 'désactivé'}.`,
      });
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du type d'abonnement",
        variant: "destructive",
      });
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
        title="Types d'abonnement" 
        description="Gestion des catégories et tarifs d'abonnement"
        icon={<BookOpenIcon className="h-6 w-6 text-archibat-blue" />}
      >
        <Button onClick={handleOpenAddModal}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un type
        </Button>
      </PageHeader>

      <SubscriptionTypeTable 
        subscriptionTypes={subscriptionTypes} 
        onToggleActive={handleToggleActive} 
      />

      <AddSubscriptionTypeModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddSubscriptionType}
      />
    </div>
  );
};

export default SubscriptionTypes;
