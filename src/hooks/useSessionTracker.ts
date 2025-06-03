
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

export const useSessionTracker = (user: any) => {
  const { isAdmin, isLoading } = useUserRole();

  useEffect(() => {
    // Ne pas suivre les sessions si l'utilisateur n'est pas connecté
    if (!user) return;
    
    // Ne pas suivre les sessions des administrateurs
    if (isLoading) return; // Attendre que le rôle soit chargé
    if (isAdmin) {
      console.log('👑 Admin detecté - pas de suivi de session');
      return;
    }

    const registerLogin = async () => {
      try {
        console.log('📊 Enregistrement de session pour utilisateur non-admin:', user.email);
        
        // Vérifier s'il y a déjà une session active pour cet utilisateur
        const { data: existingSessions, error: checkError } = await supabase
          .from('user_sessions')
          .select('id')
          .eq('user_id', user.id)
          .is('logout_time', null)
          .limit(1);

        if (checkError) {
          console.error('Error checking existing sessions:', checkError);
          return;
        }

        // S'il y a déjà une session active, on l'utilise
        if (existingSessions && existingSessions.length > 0) {
          localStorage.setItem('lastSessionId', existingSessions[0].id);
          console.log('Using existing session:', existingSessions[0].id);
          return;
        }

        // Sinon, créer une nouvelle session
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
          console.log('New session created:', data[0].id);
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
  }, [user, isAdmin, isLoading]);
};
