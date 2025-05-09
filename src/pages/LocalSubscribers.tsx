import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SubscribersTable, Subscriber } from '@/components/subscribers/SubscribersTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LocalSubscribers = () => {
  const navigate = useNavigate();

  // Mock data for subscribers
  const subscribers: Subscriber[] = [
    {
      id: '1',
      nom: 'Ben Ali',
      prenom: 'Ahmed',
      email: 'ahmed@example.com',
      telephone: '+216 55 123 456',
      typeAbonnement: 'Annuel',
      dateDebut: '15/04/2023',
      dateFin: '15/04/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '2',
      nom: 'Zaied',
      prenom: 'Fatma',
      email: 'fatma@example.com',
      telephone: '+216 55 234 567',
      typeAbonnement: 'Semestriel',
      dateDebut: '10/01/2023',
      dateFin: '10/07/2023',
      montant: 70,
      statut: 'en_attente',
    },
    {
      id: '3',
      nom: 'Karoui',
      prenom: 'Mohamed',
      email: 'mohamed@example.com',
      telephone: '+216 55 345 678',
      typeAbonnement: 'Étudiant',
      dateDebut: '05/03/2023',
      dateFin: '05/03/2024',
      montant: 60,
      statut: 'actif',
    },
    {
      id: '4',
      nom: 'Trabelsi',
      prenom: 'Leila',
      email: 'leila@example.com',
      telephone: '+216 55 456 789',
      typeAbonnement: 'Annuel',
      dateDebut: '01/01/2023',
      dateFin: '01/01/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '5',
      nom: 'Bouslama',
      prenom: 'Sami',
      email: 'sami@example.com',
      telephone: '+216 55 567 890',
      typeAbonnement: 'Trimestriel',
      dateDebut: '28/02/2023',
      dateFin: '28/05/2023',
      montant: 40,
      statut: 'expire',
    },
    {
      id: '6',
      nom: 'Gharsallah',
      prenom: 'Imen',
      email: 'imen@example.com',
      telephone: '+216 55 678 901',
      typeAbonnement: 'Annuel',
      dateDebut: '15/03/2023',
      dateFin: '15/03/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '7',
      nom: 'Mejri',
      prenom: 'Karim',
      email: 'karim@example.com',
      telephone: '+216 55 789 012',
      typeAbonnement: 'Semestriel',
      dateDebut: '20/04/2023',
      dateFin: '20/10/2023',
      montant: 70,
      statut: 'actif',
    },
    {
      id: '8',
      nom: 'Riahi',
      prenom: 'Nadia',
      email: 'nadia@example.com',
      telephone: '+216 55 890 123',
      typeAbonnement: 'Annuel',
      dateDebut: '10/05/2022',
      dateFin: '10/05/2023',
      montant: 120,
      statut: 'expire',
    },
    {
      id: '9',
      nom: 'Jlassi',
      prenom: 'Omar',
      email: 'omar@example.com',
      telephone: '+216 55 901 234',
      typeAbonnement: 'Étudiant',
      dateDebut: '25/04/2023',
      dateFin: '25/04/2024',
      montant: 60,
      statut: 'en_attente',
    },
    {
      id: '10',
      nom: 'Makhlouf',
      prenom: 'Sabrine',
      email: 'sabrine@example.com',
      telephone: '+216 55 012 345',
      typeAbonnement: 'Annuel',
      dateDebut: '05/05/2023',
      dateFin: '05/05/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '11',
      nom: 'Mokrani',
      prenom: 'Tarek',
      email: 'tarek@example.com',
      telephone: '+216 55 123 456',
      typeAbonnement: 'Annuel',
      dateDebut: '01/04/2023',
      dateFin: '01/04/2024',
      montant: 120,
      statut: 'actif',
    },
    {
      id: '12',
      nom: 'Yacoubi',
      prenom: 'Wafa',
      email: 'wafa@example.com',
      telephone: '+216 55 234 567',
      typeAbonnement: 'Trimestriel',
      dateDebut: '15/03/2023',
      dateFin: '15/06/2023',
      montant: 40,
      statut: 'actif',
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Abonnés locaux" 
        description="Gestion des abonnés en Tunisie"
      >
        <Button onClick={() => navigate('/abonnes-locaux/nouveau')}>
          Ajouter un abonné
        </Button>
      </PageHeader>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
};

export default LocalSubscribers;
