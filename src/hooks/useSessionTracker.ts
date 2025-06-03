import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSessionTracker = (user: any) => {
  useEffect(() => {
    if (!user) return;

    const startSessionIfNotExists = async () => {
      // Vérifie s'il y a une session ouverte (pas de logout_time)
      const { data: existing, error: fetchError } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('user_id', user.id)
        .is('logout_time', null)
        .limit(1)
        .order('login_time', { ascending: false });

      if (fetchError) {
        console.error('Erreur vérification session existante :', fetchError);
        return;
      }

      if (existing && existing.length > 0) {
        // Session déjà ouverte → ne rien faire
        localStorage.setItem('lastSessionId', existing[0].id);
        return;
      }

      // Aucune session ouverte → en créer une
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([{ user_id: user.id }])
        .select();

      if (error) {
        console.error('Erreur enregistrement nouvelle session :', error);
      } else {
        localStorage.setItem('lastSessionId', data[0].id);
      }
    };

    const closeSession = async () => {
      const sessionId = localStorage.getItem('lastSessionId');
      if (!sessionId) return;

      const { error } = await supabase
        .from('user_sessions')
        .update({ logout_time: new Date().toISOString() })
        .eq('id', sessionId);

      if (!error) {
        localStorage.removeItem('lastSessionId');
      }
    };

    // Lancement à la connexion
    startSessionIfNotExists();

    // Fermeture automatique si on quitte la page
    window.addEventListener('beforeunload', closeSession);
    return () => {
      closeSession();
      window.removeEventListener('beforeunload', closeSession);
    };
  }, [user]);
};
