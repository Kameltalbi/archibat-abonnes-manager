
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentSubscribers } from '@/components/dashboard/RecentSubscribers';
import { SubscriptionsChart } from '@/components/dashboard/SubscriptionsChart';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { UserIcon, UsersIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react';

const Dashboard = () => {
  // Mock data for dashboard
  const statsData = [
    { 
      title: "Abonnés locaux", 
      value: "245", 
      icon: <UserIcon className="h-5 w-5" />,
      change: { value: "12%", positive: true } 
    },
    { 
      title: "Abonnés internationaux", 
      value: "78", 
      icon: <UserIcon className="h-5 w-5" />,
      change: { value: "5%", positive: true } 
    },
    { 
      title: "Institutions", 
      value: "42", 
      icon: <UsersIcon className="h-5 w-5" />,
      change: { value: "3%", positive: false } 
    },
    { 
      title: "Ventes au numéro", 
      value: "320", 
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      change: { value: "10%", positive: true } 
    },
    {
      title: "Chiffre d'affaires (DT)", 
      value: "32 850", 
      icon: <DollarSignIcon className="h-5 w-5" />, 
      change: { value: "8%", positive: true }
    }
  ];

  const chartData = [
    { month: 'Jan', locaux: 45, internationaux: 20, institutions: 10 },
    { month: 'Fév', locaux: 52, internationaux: 22, institutions: 12 },
    { month: 'Mar', locaux: 61, internationaux: 25, institutions: 15 },
    { month: 'Avr', locaux: 67, internationaux: 30, institutions: 16 },
    { month: 'Mai', locaux: 70, internationaux: 32, institutions: 18 },
    { month: 'Juin', locaux: 80, internationaux: 35, institutions: 21 },
    { month: 'Juil', locaux: 90, internationaux: 38, institutions: 24 },
    { month: 'Août', locaux: 95, internationaux: 40, institutions: 28 },
  ];

  const recentSubscribers = [
    { id: '1', name: 'Ahmed Ben Ali', email: 'ahmed@example.com', type: 'Annuel', status: 'active' as const, date: '15/04/2023' },
    { id: '2', name: 'Fatma Zaied', email: 'fatma@example.com', type: 'Semestriel', status: 'active' as const, date: '10/04/2023' },
    { id: '3', name: 'Mohamed Karoui', email: 'mohamed@example.com', type: 'Étudiant', status: 'pending' as const, date: '05/04/2023' },
    { id: '4', name: 'Leila Trabelsi', email: 'leila@example.com', type: 'Annuel', status: 'active' as const, date: '01/04/2023' },
    { id: '5', name: 'Sami Bouslama', email: 'sami@example.com', type: 'Trimestriel', status: 'expired' as const, date: '28/03/2023' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Relance des abonnements expirés', date: '15 Mai 2023', time: '10:00', type: 'task' },
    { id: '2', title: 'Réunion équipe commerciale', date: '17 Mai 2023', time: '14:30', type: 'meeting' },
    { id: '3', title: 'Échéance paiement facture #12345', date: '20 Mai 2023', time: '23:59', type: 'deadline' },
    { id: '4', title: 'Appel prospect Institut d\'Architecture', date: '22 Mai 2023', time: '11:00', type: 'meeting' },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" description="Aperçu des statistiques et activités récentes" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <SubscriptionsChart data={chartData} />
        </div>
        <div>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>

      <div className="mb-8">
        <RecentSubscribers subscribers={recentSubscribers} />
      </div>
    </div>
  );
};

export default Dashboard;
