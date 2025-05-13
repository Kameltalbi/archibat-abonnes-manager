
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { InstitutionsTable, Institution } from '@/components/institutions/InstitutionsTable';
import { Building2 } from 'lucide-react';
import { AddInstitutionModal } from '@/components/institutions/AddInstitutionModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(0); // Pour déclencher le rechargement

  // Fonction pour recharger les institutions
  const refreshInstitutions = () => {
    setRefreshFlag(prev => prev + 1);
  };

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .order('nom');

        if (error) {
          throw error;
        }

        const formattedData: Institution[] = data.map(inst => ({
          id: inst.id,
          nom: inst.nom,
          type: mapInstitutionType(inst.type),
          adresse: inst.adresse || '',
          telephone: inst.telephone || '',
          email: inst.email || '',
          contact: inst.contact || '',
          dateAdhesion: inst.date_adhesion ? new Date(inst.date_adhesion).toLocaleDateString('fr-FR') : '',
          statut: inst.statut as 'actif' | 'inactif' | 'en_attente',
        }));

        setInstitutions(formattedData);
      } catch (error) {
        console.error('Erreur lors du chargement des institutions:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données des institutions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInstitutions();
  }, [refreshFlag]); // Ajout du refreshFlag aux dépendances pour déclencher le rechargement

  // Fonction pour mapper les types d'institutions aux valeurs attendues
  const mapInstitutionType = (type: string): 'Université' | 'École' | 'Institut' | 'Centre de recherche' | 'Autre' => {
    switch (type) {
      case 'Université':
        return 'Université';
      case 'École':
        return 'École';
      case 'Institut':
        return 'Institut';
      case 'Centre de recherche':
        return 'Centre de recherche';
      default:
        return 'Autre';
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
        title="Institutions" 
        description="Gestion des institutions partenaires"
        icon={<Building2 className="h-6 w-6 text-blue-500" />}
      >
        <AddInstitutionModal onInstitutionAdded={refreshInstitutions} />
      </PageHeader>
      
      <InstitutionsTable institutions={institutions} onRefresh={refreshInstitutions} />
    </div>
  );
};

export default Institutions;
