
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
}

export const usePerformanceData = (period: string, selectedDate: Date) => {
  return useQuery({
    queryKey: ['performance-data', period, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<PerformanceData> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
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
        .eq('user_id', user.id)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des données de performance:', error);
        throw error;
      }

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
        alertDays
      };
    },
  });
};
