
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  locaux: number;
  internationaux: number;
  institutions: number;
  ventes: number;
  chiffreAffaires: number;
}

interface ChartData {
  month: string;
  locaux: number;
  internationaux: number;
  institutions: number;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  type: string;
  status: 'active' | 'pending' | 'expired';
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'task';
}

interface DashboardData {
  stats: DashboardStats;
  chartData: ChartData[];
  recentSubscribers: Subscriber[];
  upcomingEvents: Event[];
}

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async (): Promise<DashboardData> => {
      console.log('📊 Chargement des données du dashboard...');

      // Requêtes en parallèle pour de meilleures performances
      const [
        locauxResult,
        internatResult,
        institutionsResult,
        ventesResult,
        caResult,
        recentSubsResult,
        eventsResult
      ] = await Promise.all([
        supabase.from('local_subscribers').select('id').eq('statut', 'actif'),
        supabase.from('international_subscribers').select('id').eq('statut', 'actif'),
        supabase.from('institutions').select('id').eq('statut', 'actif'),
        supabase.from('ventes').select('id'),
        supabase.from('ventes').select('montant'),
        supabase
          .from('local_subscribers')
          .select('id, nom, prenom, email, type_abonnement_id, statut, date_debut')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('calendar_events')
          .select('*')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(4)
      ]);

      // Calculer le chiffre d'affaires
      let montantTotal = 0;
      if (caResult.data && caResult.data.length > 0) {
        montantTotal = caResult.data.reduce((sum, item) => sum + Number(item.montant || 0), 0);
      }

      // Formatter les données
      const stats: DashboardStats = {
        locaux: locauxResult.data?.length || 0,
        internationaux: internatResult.data?.length || 0,
        institutions: institutionsResult.data?.length || 0,
        ventes: ventesResult.data?.length || 0,
        chiffreAffaires: montantTotal
      };

      const chartData: ChartData[] = [
        { month: "Jan", locaux: 5, internationaux: 2, institutions: 1 },
        { month: "Fév", locaux: 8, internationaux: 3, institutions: 2 },
        { month: "Mar", locaux: 12, internationaux: 5, institutions: 3 }
      ];

      const recentSubscribers: Subscriber[] = (recentSubsResult.data || []).map(sub => ({
        id: sub.id,
        name: `${sub.prenom} ${sub.nom}`,
        email: sub.email,
        type: sub.type_abonnement_id || 'Standard',
        status: (sub.statut === 'actif' ? 'active' : 
                sub.statut === 'en_attente' ? 'pending' : 'expired') as 'active' | 'pending' | 'expired',
        date: new Date(sub.date_debut).toLocaleDateString('fr-FR')
      }));

      const upcomingEvents: Event[] = (eventsResult.data || []).map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('fr-FR'),
        time: event.start_time,
        type: (event.description?.includes('réunion') ? 'meeting' :
              event.description?.includes('échéance') ? 'deadline' : 'task') as 'meeting' | 'deadline' | 'task',
      }));

      console.log('✅ Données du dashboard chargées');

      return {
        stats,
        chartData,
        recentSubscribers,
        upcomingEvents
      };
    },
    staleTime: 30 * 1000, // 30 secondes - données du dashboard assez dynamiques
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};
