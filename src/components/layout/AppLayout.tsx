
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar isOpen={sidebarOpen} />
        <div className={`flex flex-col flex-grow transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
          <AppHeader onMenuClick={toggleSidebar} />
          <div className="flex-grow p-4">
            {children}
          </div>
        </div>
        <Toaster />
        <Sonner position="top-right" closeButton={true} />
      </div>
    </SidebarProvider>
  );
}
