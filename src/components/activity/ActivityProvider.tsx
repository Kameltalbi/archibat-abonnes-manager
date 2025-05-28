
import React, { createContext, useContext, useEffect } from 'react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { InactivityWarning } from './InactivityWarning';
import { supabase } from '@/integrations/supabase/client';

interface ActivityContextType {
  isActive: boolean;
  sessionId: string | null;
  startSession: () => void;
  endSession: () => void;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider');
  }
  return context;
};

interface ActivityProviderProps {
  children: React.ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const {
    isActive,
    sessionId,
    inactivityWarning,
    inactivityLevel,
    startSession,
    endSession,
    dismissWarning,
  } = useActivityTracker();

  useEffect(() => {
    // Démarrer automatiquement une session si l'utilisateur est connecté
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !sessionId) {
        startSession();
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && !sessionId) {
        startSession();
      } else if (event === 'SIGNED_OUT' && sessionId) {
        endSession();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (sessionId) {
        endSession();
      }
    };
  }, [sessionId, startSession, endSession]);

  return (
    <ActivityContext.Provider value={{ isActive, sessionId, startSession, endSession }}>
      {children}
      {inactivityWarning && inactivityLevel !== 'none' && (
        <InactivityWarning 
          onDismiss={dismissWarning} 
          inactivityLevel={inactivityLevel}
        />
      )}
    </ActivityContext.Provider>
  );
};
