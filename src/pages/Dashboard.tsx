
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentSubscribers } from '@/components/dashboard/RecentSubscribers';
import { SubscriptionsChart } from '@/components/dashboard/SubscriptionsChart';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { UserIcon, UsersIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Erreur lors du chargement des données</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Aucune donnée disponible</div>
      </div>
    );
  }

  const { stats, chartData, recentSubscribers, upcomingEvents } = dashboardData;

  const statsCards = [
    { 
      title: "Abonnés locaux", 
      value: stats.locaux.toString(), 
      icon: <UserIcon className="h-5 w-5" />,
      change: { value: "0%", positive: true } 
    },
    { 
      title: "Abonnés internationaux", 
      value: stats.internationaux.toString(), 
      icon: <UserIcon className="h-5 w-5" />,
      change: { value: "0%", positive: true } 
    },
    { 
      title: "Institutions", 
      value: stats.institutions.toString(), 
      icon: <UsersIcon className="h-5 w-5" />,
      change: { value: "0%", positive: true } 
    },
    { 
      title: "Ventes au numéro", 
      value: stats.ventes.toString(), 
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      change: { value: "0%", positive: true } 
    },
    {
      title: "Chiffre d'affaires (DT)", 
      value: stats.chiffreAffaires.toString(), 
      icon: <DollarSignIcon className="h-5 w-5" />, 
      change: { value: "0%", positive: true }
    }
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" description="Aperçu des statistiques et activités récentes" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statsCards.map((stat, index) => (
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
