
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ActivityProvider } from '@/components/activity/ActivityProvider';
import { GDPRNotice } from './GDPRNotice';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Get current user and track sessions
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useSessionTracker(user);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ActivityProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background overflow-x-hidden relative">
          {/* Sidebar rétractable sur desktop */}
          <div className={`hidden md:block h-full transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
            <AppSidebar isOpen={sidebarOpen} />
          </div>
          {/* Sidebar overlay sur mobile */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={toggleSidebar}></div>
              <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-lg transition-transform duration-300 md:hidden">
                <AppSidebar isOpen={sidebarOpen} />
              </div>
            </>
          )}
          {/* Contenu principal prend tout l'espace */}
          <div className="flex flex-col flex-grow transition-all duration-300 min-w-0">
            <AppHeader onMenuClick={toggleSidebar} />
            <div className="flex-grow p-4">
              {children}
            </div>
          </div>
          <GDPRNotice />
          <Toaster />
          <Sonner position="top-right" closeButton={true} />
        </div>
      </SidebarProvider>
    </ActivityProvider>
  );
}
