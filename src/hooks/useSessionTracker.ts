
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracker = (user: any) => {
  useEffect(() => {
    if (!user) return;

    const registerLogin = async () => {
      try {
        const { data, error } = await supabase
          .from('user_sessions')
          .insert([{ user_id: user.id }])
          .select();

        if (error) {
          console.error('Error creating session:', error);
          return;
        }

        if (data && data.length > 0) {
          localStorage.setItem('lastSessionId', data[0].id);
          console.log('Session created:', data[0].id);
        }
      } catch (error) {
        console.error('Error in registerLogin:', error);
      }
    };

    const registerLogout = async () => {
      try {
        const sessionId = localStorage.getItem('lastSessionId');
        if (!sessionId) return;

        const { error } = await supabase
          .from('user_sessions')
          .update({ logout_time: new Date().toISOString() })
          .eq('id', sessionId);

        if (error) {
          console.error('Error updating session logout:', error);
        } else {
          console.log('Session logout recorded');
        }

        localStorage.removeItem('lastSessionId');
      } catch (error) {
        console.error('Error in registerLogout:', error);
      }
    };

    registerLogin();

    window.addEventListener('beforeunload', registerLogout);
    return () => {
      registerLogout();
      window.removeEventListener('beforeunload', registerLogout);
    };
  }, [user]);
};
