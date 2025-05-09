
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, BookOpenIcon } from 'lucide-react';
import { SubscriptionTypeTable } from '@/components/subscription/SubscriptionTypeTable';
import { useToast } from '@/hooks/use-toast';
import { AddSubscriptionTypeModal } from '@/components/subscription/AddSubscriptionTypeModal';

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
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([
    {
      id: '1',
      nom: 'Abonnement annuel',
      description: 'Accès à tous les numéros pendant 12 mois',
      duree: 12,
      prix: 120,
      typeLecteur: 'particulier',
      actif: true,
    },
    {
      id: '2',
      nom: 'Abonnement semestriel',
      description: 'Accès à tous les numéros pendant 6 mois',
      duree: 6,
      prix: 70,
      typeLecteur: 'particulier',
      actif: true,
    },
    {
      id: '3',
      nom: 'Abonnement étudiant',
      description: 'Tarif préférentiel pour les étudiants',
      duree: 12,
      prix: 60,
      typeLecteur: 'etudiant',
      actif: true,
    },
    {
      id: '4',
      nom: 'Abonnement institution',
      description: 'Pour les bibliothèques et institutions académiques',
      duree: 12,
      prix: 250,
      typeLecteur: 'institution',
      actif: true,
    },
    {
      id: '5',
      nom: 'Abonnement trimestriel',
      description: 'Accès à tous les numéros pendant 3 mois',
      duree: 3,
      prix: 40,
      typeLecteur: 'particulier',
      actif: false,
    },
  ]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSubscriptionType = (subscriptionType: Omit<SubscriptionType, 'id'>) => {
    const newSubscriptionType = {
      id: `${subscriptionTypes.length + 1}`,
      ...subscriptionType
    };

    setSubscriptionTypes([...subscriptionTypes, newSubscriptionType]);
    toast({
      title: "Type d'abonnement ajouté",
      description: `Le type d'abonnement ${subscriptionType.nom} a été ajouté avec succès.`,
    });
    handleCloseAddModal();
  };

  const handleToggleActive = (id: string) => {
    setSubscriptionTypes(subscriptionTypes.map(type => 
      type.id === id ? { ...type, actif: !type.actif } : type
    ));
    
    const subscriptionType = subscriptionTypes.find(type => type.id === id);
    const newStatus = !subscriptionType?.actif;
    
    toast({
      title: newStatus ? "Type d'abonnement activé" : "Type d'abonnement désactivé",
      description: `Le type d'abonnement ${subscriptionType?.nom} a été ${newStatus ? 'activé' : 'désactivé'}.`,
    });
  };

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
