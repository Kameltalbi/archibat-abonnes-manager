
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
    console.log('🚀 ActivityProvider mounted, checking user...');
    
    // Fonction pour démarrer une session si l'utilisateur est connecté
    const initializeSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('👤 Current user in ActivityProvider:', user?.email);
        
        if (error) {
          console.error('❌ Error getting user:', error);
          return;
        }
        
        if (user && !sessionId) {
          console.log('✅ User found, starting session...');
          startSession();
        }
      } catch (error) {
        console.error('❌ Error in initializeSession:', error);
      }
    };

    // Démarrer une session immédiatement si l'utilisateur est déjà connecté
    initializeSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user && !sessionId) {
        console.log('✅ User signed in, starting session...');
        // Petit délai pour s'assurer que tout est initialisé
        setTimeout(() => {
          startSession();
        }, 100);
      } else if (event === 'SIGNED_OUT' && sessionId) {
        console.log('👋 User signed out, ending session...');
        endSession();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (sessionId) {
        console.log('🔚 Component unmounting, ending session...');
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
