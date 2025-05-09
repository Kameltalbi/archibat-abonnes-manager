
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { SettingsIcon, DollarSignIcon, MailIcon, LogInIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <span className="text-2xl font-bold text-archibat-blue">Archibat</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Fonctionnalités</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-archibat-blue/50 to-archibat-violet/50 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Espace Archibat
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            La référence des professionnels de l'architecture et du bâtiment depuis 1997.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/" title="Revues numériques" className="">
                      Accédez à toutes nos publications en version numérique
                    </ListItem>
                    <ListItem href="/" title="Gestion des abonnements" className="">
                      Gérez facilement vos abonnements et factures
                    </ListItem>
                    <ListItem href="/" title="Services professionnels" className="">
                      Découvrez nos services dédiés aux professionnels
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4" />
                    <span>Tarif</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    <ListItem href="/" title="Abonnement Standard" price="29 900 FCFA/an" className="">
                      Version papier et accès limité aux archives
                    </ListItem>
                    <ListItem href="/" title="Abonnement Pro" price="49 900 FCFA/an" className="">
                      Version papier, numérique et accès complet
                    </ListItem>
                    <ListItem href="/" title="Pack Digital" price="19 900 FCFA/an" className="">
                      Accès 100% numérique
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuTrigger className="bg-transparent">
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      <span>Contact</span>
                    </div>
                  </NavigationMenuTrigger>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <Button asChild className="bg-archibat-blue hover:bg-archibat-violet">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LogInIcon className="h-4 w-4" />
            <span>Se connecter</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

const ListItem = ({ 
  className, 
  title, 
  price, 
  children, 
  ...props 
}: { 
  className: string;
  title: string;
  price?: string;
  children: React.ReactNode;
  [x: string]: any;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {price && <p className="text-xs text-archibat-blue font-semibold">{price}</p>}
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};
