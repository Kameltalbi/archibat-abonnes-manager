
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VentesTable } from '@/components/ventes/VentesTable';
import { AjouterVenteModal } from '@/components/ventes/AjouterVenteModal';
import { toast } from '@/hooks/use-toast';

export type Vente = {
  id: string;
  numero: string;
  quantite: number;
  date: string;
  client: string;
  montant: number;
  modePaiement: string;
  statut: 'payé' | 'en_attente' | 'annulé';
};

const Ventes = () => {
  const [ventes, setVentes] = useState<Vente[]>([
    {
      id: '1',
      numero: 'Archibat #45',
      quantite: 5,
      date: '12/04/2025',
      client: 'Librairie Centrale',
      montant: 25000,
      modePaiement: 'Espèces',
      statut: 'payé',
    },
    {
      id: '2',
      numero: 'Archibat #45',
      quantite: 2,
      date: '15/04/2025',
      client: 'Université de Yaoundé',
      montant: 10000,
      modePaiement: 'Virement',
      statut: 'payé',
    },
    {
      id: '3',
      numero: 'Archibat #44',
      quantite: 10,
      date: '20/03/2025',
      client: 'Centre culturel français',
      montant: 50000,
      modePaiement: 'Carte bancaire',
      statut: 'payé',
    },
    {
      id: '4',
      numero: 'Archibat #46',
      quantite: 3,
      date: '02/05/2025',
      client: 'École d\'Architecture de Douala',
      montant: 15000,
      modePaiement: 'Mobile Money',
      statut: 'en_attente',
    },
    {
      id: '5',
      numero: 'Archibat #45',
      quantite: 1,
      date: '18/04/2025',
      client: 'Bureau d\'Études ARCON',
      montant: 5000,
      modePaiement: 'Espèces',
      statut: 'annulé',
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddVente = (newVente: Omit<Vente, 'id'>) => {
    const id = (ventes.length + 1).toString();
    setVentes([...ventes, { ...newVente, id }]);
    toast({
      title: "Vente ajoutée",
      description: `Une nouvelle vente de ${newVente.quantite} exemplaires a été ajoutée.`,
    });
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <PageHeader 
        title="Vente au numéro" 
        description="Gestion des ventes individuelles de magazines"
        icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une vente
        </Button>
      </PageHeader>
      
      <VentesTable ventes={ventes} />
      
      <AjouterVenteModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSubmit={handleAddVente} 
      />
    </div>
  );
};

export default Ventes;
