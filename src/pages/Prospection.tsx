
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ContactsIcon } from 'lucide-react';
import { ProspectionPipeline } from '@/components/prospection/ProspectionPipeline';
import { ProspectionTable } from '@/components/prospection/ProspectionTable';
import { Button } from '@/components/ui/button';
import { AddProspectModal } from '@/components/prospection/AddProspectModal';
import { useToast } from '@/hooks/use-toast';

export type ProspectStatus = 'nouveau' | 'contact_initial' | 'proposition' | 'negociation' | 'gagne' | 'perdu';

export type Prospect = {
  id: string;
  entreprise: string;
  contact: string;
  email: string;
  telephone: string;
  statut: ProspectStatus;
  valeurPotentielle: number;
  dateCreation: string;
  dateDernierContact: string;
  notes: string;
};

const Prospection = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: '1',
      entreprise: 'Cabinet d\'Architecture Martinez',
      contact: 'Jean Martinez',
      email: 'jean@martinez-architectes.com',
      telephone: '+216 71 123 456',
      statut: 'nouveau',
      valeurPotentielle: 5000,
      dateCreation: '15/04/2023',
      dateDernierContact: '15/04/2023',
      notes: 'Intéressé par une publicité dans le prochain numéro',
    },
    {
      id: '2',
      entreprise: 'Constructa BTP',
      contact: 'Marie Dubois',
      email: 'm.dubois@constructa.com',
      telephone: '+216 71 234 567',
      statut: 'contact_initial',
      valeurPotentielle: 12000,
      dateCreation: '10/03/2023',
      dateDernierContact: '05/04/2023',
      notes: 'Appel effectué, en attente de retour',
    },
    {
      id: '3',
      entreprise: 'Matériaux Modernes',
      contact: 'Ahmed Ben Ali',
      email: 'ahmed@materiaux-modernes.com',
      telephone: '+216 71 345 678',
      statut: 'proposition',
      valeurPotentielle: 8500,
      dateCreation: '22/02/2023',
      dateDernierContact: '20/04/2023',
      notes: 'Proposition envoyée pour une campagne annuelle',
    },
    {
      id: '4',
      entreprise: 'École d\'Architecture de Tunis',
      contact: 'Leila Karoui',
      email: 'l.karoui@eat.edu.tn',
      telephone: '+216 71 456 789',
      statut: 'negociation',
      valeurPotentielle: 3000,
      dateCreation: '05/01/2023',
      dateDernierContact: '12/04/2023',
      notes: 'Discussion sur tarifs étudiants en cours',
    },
    {
      id: '5',
      entreprise: 'Carrelages Méditerranée',
      contact: 'Karim Trabelsi',
      email: 'k.trabelsi@carmed.com',
      telephone: '+216 71 567 890',
      statut: 'gagne',
      valeurPotentielle: 15000,
      dateCreation: '17/12/2022',
      dateDernierContact: '10/03/2023',
      notes: 'Contrat signé pour 12 mois',
    },
    {
      id: '6',
      entreprise: 'Immobilière du Golf',
      contact: 'Sofia Mansour',
      email: 'sofia@immogolf.com',
      telephone: '+216 71 678 901',
      statut: 'perdu',
      valeurPotentielle: 7000,
      dateCreation: '03/02/2023',
      dateDernierContact: '22/03/2023',
      notes: 'Budget alloué à d\'autres médias',
    },
  ]);

  const handleAddProspect = (newProspect: Omit<Prospect, 'id' | 'dateCreation'>) => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const id = (prospects.length + 1).toString();
    const prospect: Prospect = {
      ...newProspect,
      id,
      dateCreation: formattedDate,
      dateDernierContact: formattedDate,
    };

    setProspects([...prospects, prospect]);
    toast({
      title: "Prospect ajouté",
      description: `${newProspect.entreprise} a été ajouté à votre pipeline.`,
    });
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: ProspectStatus) => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    setProspects(prospects.map(prospect => {
      if (prospect.id === id) {
        return {
          ...prospect,
          statut: newStatus,
          dateDernierContact: formattedDate
        };
      }
      return prospect;
    }));

    const prospect = prospects.find(p => p.id === id);
    if (prospect) {
      toast({
        title: "Statut mis à jour",
        description: `Le statut de ${prospect.entreprise} a été mis à jour.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline de prospection"
        description="Suivez vos prospects et votre processus commercial"
        icon={<ContactsIcon className="h-6 w-6 text-amber-500" />}
      >
        <Button onClick={() => setIsModalOpen(true)}>
          Ajouter un prospect
        </Button>
      </PageHeader>

      <ProspectionPipeline
        prospects={prospects}
        onUpdateStatus={handleUpdateStatus}
      />

      <ProspectionTable
        prospects={prospects}
        onUpdateStatus={handleUpdateStatus}
      />

      <AddProspectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddProspect}
      />
    </div>
  );
};

export default Prospection;
