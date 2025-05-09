
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { InstitutionsTable, Institution } from '@/components/institutions/InstitutionsTable';
import { Building2 } from 'lucide-react';

const Institutions = () => {
  // Données fictives pour les institutions
  const mockInstitutions: Institution[] = [
    {
      id: '1',
      nom: 'Université de Douala',
      type: 'Université',
      adresse: 'BP 2701, Douala, Cameroun',
      telephone: '+237 233 40 75 69',
      email: 'contact@univ-douala.cm',
      contact: 'Dr. Jean Kouassi',
      dateAdhesion: '15/01/2023',
      statut: 'actif',
    },
    {
      id: '2',
      nom: 'École Nationale Supérieure Polytechnique',
      type: 'École',
      adresse: 'BP 8390, Yaoundé, Cameroun',
      telephone: '+237 222 22 45 47',
      email: 'info@polytechnique.cm',
      contact: 'Pr. Marie Mbarga',
      dateAdhesion: '03/04/2023',
      statut: 'actif',
    },
    {
      id: '3',
      nom: 'Centre de Recherche en Architecture Durable',
      type: 'Centre de recherche',
      adresse: 'BP 1250, Yaoundé, Cameroun',
      telephone: '+237 233 42 16 88',
      email: 'contact@crad.org',
      contact: 'Dr. Paul Manga',
      dateAdhesion: '27/05/2023',
      statut: 'en_attente',
    },
    {
      id: '4',
      nom: 'Institut Africain d\'Informatique',
      type: 'Institut',
      adresse: 'BP 4163, Libreville, Gabon',
      telephone: '+241 01 73 25 87',
      email: 'direction@iai-gabon.org',
      contact: 'Dr. Ibrahim Ouattara',
      dateAdhesion: '12/02/2023',
      statut: 'inactif',
    },
    {
      id: '5',
      nom: 'École Supérieure d\'Architecture',
      type: 'École',
      adresse: 'BP 5248, Abidjan, Côte d\'Ivoire',
      telephone: '+225 27 22 48 72 13',
      email: 'info@esa-abidjan.ci',
      contact: 'Pr. Charles Konan',
      dateAdhesion: '09/03/2023',
      statut: 'actif',
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Institutions" 
        description="Gestion des institutions partenaires"
        icon={<Building2 className="h-6 w-6 text-blue-500" />}
      />
      
      <InstitutionsTable institutions={mockInstitutions} />
    </div>
  );
};

export default Institutions;
