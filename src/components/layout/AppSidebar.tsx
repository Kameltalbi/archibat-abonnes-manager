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
            <div className="h-8 w-8 rounded-md archibat-gradient flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <h1 className="text-xl font-bold ml-2 text-archibat-blue">Archibat</h1>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-md archibat-gradient flex items-center justify-center">
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
                          ? "bg-sidebar-accent text-archibat-blue font-semibold" 
                          : "text-[#1E293B] hover:bg-sidebar-accent hover:text-archibat-blue font-medium"
                      )}
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
            "flex items-center w-full py-2.5 px-3 rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive text-[#1E293B] font-medium",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          <LogOutIcon className={cn("h-5 w-5", isOpen ? "mr-3" : "")} />
          {isOpen && <span className="text-base">Se déconnecter</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
