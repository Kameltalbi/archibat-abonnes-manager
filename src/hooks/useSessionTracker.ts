
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracker = (user: any) => {
  useEffect(() => {
    if (!user) return;

    const registerLogin = async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([{ user_id: user.id }])
        .select();

      if (data && data.length > 0) {
        localStorage.setItem('lastSessionId', data[0].id);
      }
    };

    const registerLogout = async () => {
      const sessionId = localStorage.getItem('lastSessionId');
      if (!sessionId) return;

      await supabase
        .from('user_sessions')
        .update({ logout_time: new Date().toISOString() })
        .eq('id', sessionId);

      localStorage.removeItem('lastSessionId');
    };

    registerLogin();

    window.addEventListener('beforeunload', registerLogout);
    return () => {
      registerLogout();
      window.removeEventListener('beforeunload', registerLogout);
    };
  }, [user]);
};
