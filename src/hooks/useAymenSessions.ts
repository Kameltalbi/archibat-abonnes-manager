
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SessionWithInactivity {
  id: string;
  login_time: string;
  logout_time: string | null;
  device: string | null;
  status: string;
  total_inactivity_minutes: number;
  inactivity_periods: Array<{
    start_idle: string;
    end_idle: string | null;
    duration_minutes: number | null;
  }>;
}

export const useAymenSessions = (selectedDate: Date, period: string) => {
  return useQuery({
    queryKey: ['aymen-sessions', format(selectedDate, 'yyyy-MM-dd'), period],
    queryFn: async (): Promise<SessionWithInactivity[]> => {
      console.log('🔍 Recherche des sessions d\'Aymen...');
      
      // D'abord, chercher l'utilisateur Aymen avec une recherche plus large
      const { data: aymenProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .or('full_name.ilike.%aymen%,email.ilike.%aymen%,full_name.ilike.%boubakri%');

      console.log('👥 Profils trouvés:', aymenProfiles);
      
      if (profileError) {
        console.error('❌ Erreur lors de la recherche des profils:', profileError);
        throw profileError;
      }

      if (!aymenProfiles || aymenProfiles.length === 0) {
        console.log('❌ Aucun utilisateur Aymen trouvé');
        return [];
      }

      // Prendre le premier profil trouvé (ou on peut affiner la logique)
      const aymenProfile = aymenProfiles[0];
      console.log('✅ Profil Aymen sélectionné:', aymenProfile);

      let startDate: Date;
      let endDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(selectedDate);
          endDate = new Date(selectedDate);
          break;
        case 'week':
          const weekStart = new Date(selectedDate);
          weekStart.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
          startDate = weekStart;
          endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          break;
        case 'month':
          startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
          endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
          break;
        default:
          startDate = new Date(selectedDate);
          endDate = new Date(selectedDate);
      }

      console.log('📅 Période de recherche:', {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        period
      });

      // Récupérer TOUTES les sessions d'Aymen d'abord pour déboguer
      const { data: allSessions, error: allSessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', aymenProfile.id)
        .order('login_time', { ascending: false });

      console.log('📊 TOUTES les sessions d\'Aymen:', allSessions);

      // Puis filtrer par période
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', aymenProfile.id)
        .gte('login_time', format(startDate, 'yyyy-MM-dd'))
        .lte('login_time', format(endDate, 'yyyy-MM-dd') + ' 23:59:59')
        .order('login_time', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des sessions:', error);
        throw error;
      }

      console.log('📊 Sessions trouvées pour la période:', sessions?.length || 0, sessions);

      // Pour chaque session, récupérer les périodes d'inactivité
      const sessionsWithInactivity: SessionWithInactivity[] = [];

      for (const session of sessions || []) {
        const { data: inactivityPeriods } = await supabase
          .from('user_inactivity')
          .select('start_idle, end_idle, duration_minutes')
          .eq('session_id', session.id)
          .order('start_idle', { ascending: true });

        const totalInactivity = inactivityPeriods?.reduce(
          (sum, period) => sum + (period.duration_minutes || 0), 
          0
        ) || 0;

        sessionsWithInactivity.push({
          ...session,
          total_inactivity_minutes: totalInactivity,
          inactivity_periods: inactivityPeriods || []
        });

        console.log('📝 Session avec inactivité:', {
          id: session.id,
          login_time: session.login_time,
          logout_time: session.logout_time,
          totalInactivity,
          inactivityPeriods: inactivityPeriods?.length || 0
        });
      }

      console.log('✅ Sessions finales avec inactivité:', sessionsWithInactivity.length);
      return sessionsWithInactivity;
    },
    staleTime: 10 * 1000, // Réduire à 10 secondes pour voir les nouvelles sessions plus vite
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30 secondes
  });
};
