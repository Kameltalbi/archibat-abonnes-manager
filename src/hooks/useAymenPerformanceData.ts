
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
  // D'abord, on récupère l'ID d'Aymen avec plusieurs stratégies de recherche
  const { data: aymenUserId } = useQuery({
    queryKey: ['aymen-user-id'],
    queryFn: async (): Promise<string | null> => {
      console.log('🔍 Recherche de l\'utilisateur Aymen...');
      
      // Stratégie 1: Recherche par nom complet
      let { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', '%aymen%')
        .maybeSingle();

      if (data) {
        console.log('✅ Aymen trouvé par nom complet:', data);
        return data.id;
      }

      // Stratégie 2: Recherche par email
      ({ data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('email', '%aymen%')
        .maybeSingle());

      if (data) {
        console.log('✅ Aymen trouvé par email:', data);
        return data.id;
      }

      // Stratégie 3: Recherche par nom de famille
      ({ data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', '%boubakri%')
        .maybeSingle());

      if (data) {
        console.log('✅ Aymen trouvé par nom de famille:', data);
        return data.id;
      }

      // Stratégie 4: Lister tous les utilisateurs pour debug
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .limit(10);

      console.log('👥 Tous les utilisateurs disponibles:', allUsers);

      if (error) {
        console.error('❌ Erreur lors de la recherche:', error);
      } else {
        console.log('⚠️ Aucun utilisateur Aymen trouvé');
      }

      return null;
    },
  });

  // Ensuite, on récupère ses données de performance
  return useQuery({
    queryKey: ['aymen-performance-data', aymenUserId, period, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<PerformanceData> => {
      console.log('📊 Récupération des données de performance pour Aymen, user_id:', aymenUserId);
      
      if (!aymenUserId) {
        console.log('⚠️ Aucun user_id trouvé pour Aymen');
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

      console.log('📅 Période de recherche:', format(startDate, 'yyyy-MM-dd'), 'à', format(endDate, 'yyyy-MM-dd'));

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

      console.log('📈 Données d\'activité trouvées pour Aymen:', data);

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
  });
};
