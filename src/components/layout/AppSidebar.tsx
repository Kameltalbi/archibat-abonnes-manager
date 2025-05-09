
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Users, 
  Building, 
  Receipt, 
  Tag,
  Contact,
  CalendarCheck,
  Globe
} from 'lucide-react';

interface AppSidebarProps {
  isOpen?: boolean;
}

export function AppSidebar({ isOpen = true }: AppSidebarProps) {
  const navItems = [
    { icon: LineChart, label: 'Tableau de bord', href: '/dashboard' },
    { icon: Users, label: 'Abonnés locaux', href: '/abonnes-locaux' },
    { icon: Globe, label: 'Abonnés internationaux', href: '/abonnes-internationaux' },
    { icon: Building, label: 'Institutions', href: '/institutions' },
    { icon: CalendarCheck, label: 'Calendrier', href: '/calendrier' },
    { icon: Tag, label: "Types d'abonnement", href: '/types-abonnement' },
    { icon: Contact, label: 'Prospection', href: '/prospection' },
    { icon: Receipt, label: 'Ventes', href: '/ventes' },
  ];

  return (
    <div className="flex flex-col h-full py-4 gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
              "hover:bg-primary/10",
              isActive
                ? "text-primary bg-primary/10 font-medium"
                : "text-muted-foreground"
            )
          }
        >
          <item.icon className="mr-2 h-4 w-4" />
          {isOpen ? item.label : null}
        </NavLink>
      ))}
    </div>
  );
}
