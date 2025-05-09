
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { InternationalSubscribersTable, InternationalSubscriber } from '@/components/subscribers/InternationalSubscribersTable';
import { Globe } from 'lucide-react';
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal';

const InternationalSubscribers = () => {
  // Données fictives pour les abonnés internationaux
  const mockSubscribers: InternationalSubscriber[] = [
    {
      id: '1',
      nom: 'Dubois',
      prenom: 'Jean',
      email: 'jean.dubois@example.fr',
      telephone: '+33612345678',
      pays: 'France',
      typeAbonnement: 'Premium',
      dateDebut: '01/02/2023',
      dateFin: '01/02/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '2',
      nom: 'Smith',
      prenom: 'John',
      email: 'john.smith@example.uk',
      telephone: '+44987654321',
      pays: 'Royaume-Uni',
      typeAbonnement: 'Standard',
      dateDebut: '15/03/2023',
      dateFin: '15/09/2023',
      montant: 80,
      statut: 'expire',
    },
    {
      id: '3',
      nom: 'Rossi',
      prenom: 'Maria',
      email: 'maria.rossi@example.it',
      telephone: '+393456789012',
      pays: 'Italie',
      typeAbonnement: 'Premium',
      dateDebut: '10/01/2023',
      dateFin: '10/01/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '4',
      nom: 'Muller',
      prenom: 'Hans',
      email: 'hans.muller@example.de',
      telephone: '+491234567890',
      pays: 'Allemagne',
      typeAbonnement: 'Standard',
      dateDebut: '05/04/2023',
      dateFin: '05/10/2023',
      montant: 80,
      statut: 'en_attente',
    },
    {
      id: '5',
      nom: 'Garcia',
      prenom: 'Carlos',
      email: 'carlos.garcia@example.es',
      telephone: '+34678901234',
      pays: 'Espagne',
      typeAbonnement: 'Premium',
      dateDebut: '20/02/2023',
      dateFin: '20/02/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '6',
      nom: 'Peeters',
      prenom: 'Luc',
      email: 'luc.peeters@example.be',
      telephone: '+32123456789',
      pays: 'Belgique',
      typeAbonnement: 'Standard',
      dateDebut: '15/05/2023',
      dateFin: '15/11/2023',
      montant: 80,
      statut: 'actif',
    },
    {
      id: '7',
      nom: 'Janssen',
      prenom: 'Anna',
      email: 'anna.janssen@example.nl',
      telephone: '+31987654321',
      pays: 'Pays-Bas',
      typeAbonnement: 'Premium',
      dateDebut: '01/03/2023',
      dateFin: '01/03/2024',
      montant: 120,
      statut: 'actif',
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Abonnés internationaux" 
        description="Gestion des abonnés internationaux"
        icon={<Globe className="h-6 w-6 text-purple-500" />}
      >
        <AddSubscriberModal />
      </PageHeader>
      
      <InternationalSubscribersTable subscribers={mockSubscribers} />
    </div>
  );
};

export default InternationalSubscribers;
