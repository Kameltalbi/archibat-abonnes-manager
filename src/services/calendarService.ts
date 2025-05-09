
import { CalendarEvent } from '@/types/calendar';
import { addDays, subDays, format, addMonths } from 'date-fns';

// Fonction pour générer une date au format ISO string
const toISODate = (date: Date): string => date.toISOString();

// Génère des événements fictifs basés sur les abonnés existants
export const getSubscriberEvents = (): CalendarEvent[] => {
  const today = new Date();
  
  // Événements simulés
  const events: CalendarEvent[] = [
    // Souscriptions
    {
      id: '1',
      title: 'Cabinet d\'Architecture Martinez',
      type: 'subscription',
      date: toISODate(subDays(today, 30)), // il y a 1 mois
      description: 'Nouvel abonnement annuel',
      metadata: {
        subscriberId: '1',
        subscriberName: 'Cabinet d\'Architecture Martinez',
        subscriberType: 'Annuel',
      }
    },
    // Expirations
    {
      id: '2',
      title: 'Immobilière du Golf',
      type: 'expiration',
      date: toISODate(addDays(today, 7)), // dans 7 jours
      description: 'Expiration de l\'abonnement',
      metadata: {
        subscriberId: '6',
        subscriberName: 'Immobilière du Golf',
        subscriberType: 'Annuel',
      }
    },
    {
      id: '3',
      title: 'École d\'Architecture de Tunis',
      type: 'expiration',
      date: toISODate(addDays(today, 14)), // dans 14 jours
      description: 'Expiration de l\'abonnement étudiant',
      metadata: {
        subscriberId: '4',
        subscriberName: 'École d\'Architecture de Tunis',
        subscriberType: 'Étudiant',
      }
    },
    // Renouvellements
    {
      id: '4',
      title: 'Carrelages Méditerranée',
      type: 'renewal',
      date: toISODate(addDays(today, 3)), // dans 3 jours
      description: 'Renouvellement d\'abonnement automatique',
      metadata: {
        subscriberId: '5',
        subscriberName: 'Carrelages Méditerranée',
        subscriberType: 'Annuel',
      }
    },
    // Facturations
    {
      id: '5',
      title: 'Constructa BTP',
      type: 'invoice',
      date: toISODate(today), // aujourd'hui
      description: 'Facturation pour renouvellement semestriel',
      metadata: {
        subscriberId: '2',
        subscriberName: 'Constructa BTP',
        subscriberType: 'Semestriel',
      }
    },
    // Autres événements pour le jour actuel
    {
      id: '6',
      title: 'Matériaux Modernes',
      type: 'subscription',
      date: toISODate(today),
      description: 'Nouvel abonnement trimestriel',
      metadata: {
        subscriberId: '3',
        subscriberName: 'Matériaux Modernes',
        subscriberType: 'Trimestriel',
      }
    },
    // Événements dans le futur
    {
      id: '7',
      title: 'Yacoubi Architectes',
      type: 'subscription',
      date: toISODate(addDays(today, 2)),
      description: 'Nouvel abonnement annuel',
      metadata: {
        subscriberId: '7',
        subscriberName: 'Yacoubi Architectes',
        subscriberType: 'Annuel',
      }
    },
    {
      id: '8',
      title: 'Centre de Design Tunis',
      type: 'invoice',
      date: toISODate(addDays(today, 5)),
      description: 'Facturation annuelle',
      metadata: {
        subscriberId: '8',
        subscriberName: 'Centre de Design Tunis',
        subscriberType: 'Annuel',
      }
    },
    // Événements passés
    {
      id: '9',
      title: 'Société Immobilière de Carthage',
      type: 'renewal',
      date: toISODate(subDays(today, 10)),
      description: 'Renouvellement d\'abonnement',
      metadata: {
        subscriberId: '9',
        subscriberName: 'Société Immobilière de Carthage',
        subscriberType: 'Semestriel',
      }
    },
    {
      id: '10',
      title: 'Institut National d\'Architecture',
      type: 'expiration',
      date: toISODate(subDays(today, 5)),
      description: 'Abonnement expiré sans renouvellement',
      metadata: {
        subscriberId: '10',
        subscriberName: 'Institut National d\'Architecture',
        subscriberType: 'Étudiant',
      }
    },
  ];
  
  // Ajouter des événements de renouvellement pour tous les abonnés actifs dans 10-11 mois
  const localSubscribers = [
    { id: '1', name: 'Ben Ali Ahmed', type: 'Annuel' },
    { id: '3', name: 'Karoui Mohamed', type: 'Étudiant' },
    { id: '4', name: 'Trabelsi Leila', type: 'Annuel' },
    { id: '7', name: 'Mejri Karim', type: 'Semestriel' },
    { id: '10', name: 'Mokrani Tarek', type: 'Annuel' },
    { id: '11', name: 'Yacoubi Wafa', type: 'Trimestriel' },
  ];
  
  // Ajouter des rappels de renouvellement pour tous les abonnés dans 10 mois
  const renewalReminders = localSubscribers.map((subscriber, index) => ({
    id: `renewal-reminder-${index + 100}`,
    title: `Rappel: ${subscriber.name}`,
    type: 'renewal' as const,
    date: toISODate(addMonths(today, 10 + Math.floor(Math.random() * 2))),
    description: 'Rappel de renouvellement d\'abonnement',
    metadata: {
      subscriberId: subscriber.id,
      subscriberName: subscriber.name,
      subscriberType: subscriber.type,
    }
  }));
  
  return [...events, ...renewalReminders];
};
