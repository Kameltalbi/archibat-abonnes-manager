
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

interface DailyActivitySummary {
  id: string;
  user_id: string;
  date: string;
  first_login_time: string | null;
  last_activity_time: string | null;
  total_active_minutes: number;
  total_sessions: number;
  expected_work_minutes: number;
  performance_status: string;
  created_at: string;
  updated_at: string;
}

interface PerformanceData {
  dailyStats: DailyActivitySummary[];
  totalActiveMinutes: number;
  expectedMinutes: number;
  overallPerformance: number;
  alertDays: number;
  aymenUserId: string | null;
}

export const useAymenPerformanceData = (period: string, selectedDate: Date) => {
  // Requête optimisée pour trouver Aymen avec une seule requête
  const { data: aymenUserId } = useQuery({
    queryKey: ['aymen-user-id'],
    queryFn: async (): Promise<string | null> => {
      console.log('🔍 Recherche optimisée de l\'utilisateur Aymen...');
      
      // Une seule requête avec plusieurs conditions OR
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .or('full_name.ilike.%aymen%,email.ilike.%aymen%,full_name.ilike.%boubakri%')
        .limit(1)
        .maybeSingle();

      if (data) {
        console.log('✅ Aymen trouvé:', data);
        return data.id;
      }

      if (error) {
        console.error('❌ Erreur lors de la recherche:', error);
      } else {
        console.log('⚠️ Aucun utilisateur Aymen trouvé');
      }

      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - les données utilisateur changent rarement
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Requête pour les données de performance avec cache amélioré
  return useQuery({
    queryKey: ['aymen-performance-data', aymenUserId, period, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<PerformanceData> => {
      console.log('📊 Récupération optimisée des données de performance pour Aymen');
      
      if (!aymenUserId) {
        return {
          dailyStats: [],
          totalActiveMinutes: 0,
          expectedMinutes: 0,
          overallPerformance: 0,
          alertDays: 0,
          aymenUserId: null
        };
      }

      let startDate: Date;
      let endDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(selectedDate);
          endDate = new Date(selectedDate);
          break;
        case 'week':
          startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
          endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
          break;
        case 'month':
          startDate = startOfMonth(selectedDate);
          endDate = endOfMonth(selectedDate);
          break;
        default:
          startDate = new Date(selectedDate);
          endDate = new Date(selectedDate);
      }

      const { data, error } = await supabase
        .from('daily_activity_summary')
        .select('*')
        .eq('user_id', aymenUserId)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des données:', error);
        throw error;
      }

      console.log('📈 Données d\'activité trouvées:', data?.length || 0, 'enregistrements');

      const dailyStats = data || [];
      const totalActiveMinutes = dailyStats.reduce((sum, day) => sum + day.total_active_minutes, 0);
      const expectedMinutes = dailyStats.reduce((sum, day) => sum + day.expected_work_minutes, 0);
      const overallPerformance = expectedMinutes > 0 ? Math.round((totalActiveMinutes / expectedMinutes) * 100) : 0;
      const alertDays = dailyStats.filter(day => day.performance_status === 'poor' || day.performance_status === 'warning').length;

      return {
        dailyStats,
        totalActiveMinutes,
        expectedMinutes,
        overallPerformance,
        alertDays,
        aymenUserId
      };
    },
    enabled: !!aymenUserId,
    staleTime: 2 * 60 * 1000, // 2 minutes - données d'activité plus récentes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
