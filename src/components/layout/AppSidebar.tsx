
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  UserIcon, 
  UsersIcon, 
  ListIcon, 
  CalendarIcon, 
  FileTextIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  EuroIcon,
  ChartBarIcon,
  SettingsIcon,
  LogOutIcon,
  PhoneCallIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AppSidebarProps {
  isOpen: boolean;
}

export function AppSidebar({ isOpen }: AppSidebarProps) {
  const menuItems = [
    { title: "Dashboard", icon: ChartBarIcon, url: "/" },
    { title: "Abonnés locaux", icon: UserIcon, url: "/abonnes-locaux" },
    { title: "Abonnés internationaux", icon: EuroIcon, url: "/abonnes-internationaux" },
    { title: "Institutions", icon: UsersIcon, url: "/institutions" },
    { title: "Prospection", icon: PhoneCallIcon, url: "/prospection" },
    { title: "Vente au numéro", icon: ShoppingCartIcon, url: "/ventes" },
    { title: "Type d'abonnement", icon: FileTextIcon, url: "/types-abonnement" },
    { title: "Calendrier", icon: CalendarIcon, url: "/calendrier" },
    { title: "Programme de travail", icon: ListIcon, url: "/programme" },
    { title: "Paramètres", icon: SettingsIcon, url: "/parametres" }
  ];

  const handleLogout = async () => {
    try {
      // Nettoyer les états d'authentification dans le stockage local
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.') || key.includes('sb-')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Essayer de déconnecter l'utilisateur globalement
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      // Rediriger vers la page d'accueil avec un rafraîchissement forcé pour mettre à jour l'état d'authentification
      window.location.href = '/';
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la tentative de déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className={cn(
      "h-screen fixed left-0 top-0 z-40 border-r border-border transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className={cn(
        "h-16 flex items-center px-6 border-b border-border", 
        isOpen ? "justify-start" : "justify-center"
      )}>
        {isOpen ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#8f85e8' }}>
              <span className="font-bold text-white">A</span>
            </div>
            <h1 className="text-xl font-bold ml-2" style={{ color: '#8f85e8' }}>Archibat</h1>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#8f85e8' }}>
            <span className="font-bold text-white">A</span>
          </div>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          {isOpen && <SidebarGroupLabel className="text-base font-semibold text-[#1E293B]">Menu principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 py-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => cn(
                        "flex items-center py-2.5 px-3 rounded-md transition-colors",
                        isOpen ? "justify-start" : "justify-center",
                        isActive 
                          ? "text-white font-semibold" 
                          : "text-[#1E293B] hover:text-white font-medium"
                      )}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? '#8f85e8' : 'transparent',
                        ...(isActive ? {} : {
                          ':hover': {
                            backgroundColor: '#8f85e8',
                            color: 'white'
                          }
                        })
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.backgroundColor = '#8f85e8';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#1E293B';
                        }
                      }}
                    >
                      <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "")} />
                      {isOpen && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t border-border p-4">
        <button 
          className={cn(
            "flex items-center w-full py-2.5 px-3 rounded-md transition-colors hover:text-white text-[#1E293B] font-medium",
            isOpen ? "justify-start" : "justify-center"
          )}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#1E293B';
          }}
        >
          <LogOutIcon className={cn("h-5 w-5", isOpen ? "mr-3" : "")} />
          {isOpen && <span className="text-base">Se déconnecter</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
