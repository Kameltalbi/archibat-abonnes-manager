
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActivityTracking = () => {
  const updateDailySummary = useCallback(async (
    userId: string,
    sessionId: string,
    loginTime?: Date,
    activityTime?: Date,
    activeMinutes: number = 0,
    sessionCount: number = 0
  ) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase.rpc('update_daily_summary', {
        p_user_id: userId,
        p_date: today,
        p_login_time: loginTime?.toISOString() || null,
        p_activity_time: activityTime?.toISOString() || null,
        p_active_minutes: activeMinutes,
        p_session_count: sessionCount
      });

      if (error) {
        console.error('Erreur lors de la mise à jour du résumé quotidien:', error);
        throw error;
      }

      console.log('✅ Résumé quotidien mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du résumé quotidien:', error);
    }
  }, []);

  const calculateActiveTime = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_active_time', {
        p_session_id: sessionId
      });

      if (error) {
        console.error('Erreur lors du calcul du temps actif:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('❌ Erreur lors du calcul du temps actif:', error);
      return 0;
    }
  }, []);

  return {
    updateDailySummary,
    calculateActiveTime
  };
};
