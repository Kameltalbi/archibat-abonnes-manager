
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ActivityTrackerState {
  isActive: boolean;
  sessionId: string | null;
  lastActivity: Date;
  inactivityWarning: boolean;
  currentInactivityId: string | null;
  inactivityLevel: 'none' | 'warning' | 'reminder1' | 'reminder2';
}

export const useActivityTracker = () => {
  const [state, setState] = useState<ActivityTrackerState>({
    isActive: true,
    sessionId: null,
    lastActivity: new Date(),
    inactivityWarning: false,
    currentInactivityId: null,
    inactivityLevel: 'none',
  });

  const inactivityTimer = useRef<NodeJS.Timeout>();
  const reminderTimer1 = useRef<NodeJS.Timeout>();
  const reminderTimer2 = useRef<NodeJS.Timeout>();
  const isTrackingRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (reminderTimer1.current) clearTimeout(reminderTimer1.current);
    if (reminderTimer2.current) clearTimeout(reminderTimer2.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearAllTimers();

    setState(prev => ({ 
      ...prev, 
      lastActivity: new Date(), 
      isActive: true,
      inactivityWarning: false,
      inactivityLevel: 'none'
    }));

    // Premier rappel après 5 minutes
    inactivityTimer.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        inactivityWarning: true,
        inactivityLevel: 'warning'
      }));
    }, 300000); // 5 minutes

    // Deuxième rappel après 30 minutes
    reminderTimer1.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        inactivityWarning: true,
        inactivityLevel: 'reminder1'
      }));
    }, 1800000); // 30 minutes

    // Troisième rappel après 1 heure
    reminderTimer2.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        inactivityWarning: true,
        inactivityLevel: 'reminder2'
      }));
      markAsInactive();
    }, 3600000); // 1 heure
  }, []);

  const markAsInactive = useCallback(async () => {
    if (!state.sessionId) return;

    try {
      const { data, error } = await supabase
        .from('user_inactivity')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          session_id: state.sessionId,
          start_idle: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        isActive: false, 
        currentInactivityId: data.id 
      }));

      console.log('Période d\'inactivité démarrée');
    } catch (error) {
      console.error('Erreur lors du marquage d\'inactivité:', error);
    }
  }, [state.sessionId]);

  const markAsActive = useCallback(async () => {
    if (state.currentInactivityId) {
      try {
        const endTime = new Date();
        const startTime = new Date(state.lastActivity);
        const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

        await supabase
          .from('user_inactivity')
          .update({
            end_idle: endTime.toISOString(),
            duration_minutes: durationMinutes,
          })
          .eq('id', state.currentInactivityId);

        console.log(`Période d'inactivité terminée: ${durationMinutes} minutes`);
      } catch (error) {
        console.error('Erreur lors de la fin d\'inactivité:', error);
      }
    }

    setState(prev => ({ 
      ...prev, 
      isActive: true, 
      currentInactivityId: null 
    }));
    resetInactivityTimer();
  }, [state.currentInactivityId, state.lastActivity, resetInactivityTimer]);

  const startSession = useCallback(async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.data.user.id,
          ip_address: 'unknown',
          device: navigator.platform,
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, sessionId: data.id }));
      resetInactivityTimer();
      isTrackingRef.current = true;

      console.log('Session démarrée:', data.id);
    } catch (error) {
      console.error('Erreur lors du démarrage de session:', error);
      toast({
        title: "Erreur de tracking",
        description: "Impossible de démarrer le suivi d'activité",
        variant: "destructive",
      });
    }
  }, [resetInactivityTimer]);

  const endSession = useCallback(async () => {
    if (!state.sessionId) return;

    try {
      await supabase
        .from('user_sessions')
        .update({
          logout_time: new Date().toISOString(),
          status: 'logged_out',
        })
        .eq('id', state.sessionId);

      clearAllTimers();
      isTrackingRef.current = false;
      console.log('Session terminée');
    } catch (error) {
      console.error('Erreur lors de la fin de session:', error);
    }
  }, [state.sessionId, clearAllTimers]);

  const dismissWarning = useCallback(() => {
    setState(prev => ({ ...prev, inactivityWarning: false }));
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Event listeners pour détecter l'activité
  useEffect(() => {
    if (!isTrackingRef.current) return;

    const handleActivity = () => {
      if (!state.isActive) {
        markAsActive();
      } else {
        resetInactivityTimer();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [state.isActive, markAsActive, resetInactivityTimer]);

  // Gestion de la fermeture de page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.sessionId) {
        navigator.sendBeacon('/api/end-session', JSON.stringify({ sessionId: state.sessionId }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.sessionId]);

  return {
    ...state,
    startSession,
    endSession,
    dismissWarning,
  };
};
