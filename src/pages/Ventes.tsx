
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VentesTable } from '@/components/ventes/VentesTable';
import { AjouterVenteModal } from '@/components/ventes/AjouterVenteModal';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchVentes() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('ventes')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        const formattedData: Vente[] = data.map(v => ({
          id: v.id,
          numero: v.numero,
          quantite: v.quantite,
          date: new Date(v.date).toLocaleDateString('fr-FR'),
          client: v.client,
          montant: v.montant,
          modePaiement: v.mode_paiement,
          statut: v.statut as 'payé' | 'en_attente' | 'annulé',
        }));
        
        setVentes(formattedData);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données des ventes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchVentes();
  }, []);
  
  const handleAddVente = async (newVente: Omit<Vente, 'id'>) => {
    try {
      // Formatter la date pour la base de données
      const dateParts = newVente.date.split('/');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const { data, error } = await supabase
        .from('ventes')
        .insert([{
          numero: newVente.numero,
          quantite: newVente.quantite,
          date: formattedDate,
          client: newVente.client,
          montant: newVente.montant,
          mode_paiement: newVente.modePaiement,
          statut: newVente.statut
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Ajouter la nouvelle vente à l'état
      if (data && data[0]) {
        const formattedVente: Vente = {
          id: data[0].id,
          numero: data[0].numero,
          quantite: data[0].quantite,
          date: newVente.date, // Garder le format d'affichage
          client: data[0].client,
          montant: data[0].montant,
          modePaiement: data[0].mode_paiement,
          statut: data[0].statut,
        };
        
        setVentes([formattedVente, ...ventes]);
        
        toast({
          title: "Vente ajoutée",
          description: `Une nouvelle vente de ${newVente.quantite} exemplaires a été ajoutée.`,
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vente:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la vente",
        variant: "destructive"
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
