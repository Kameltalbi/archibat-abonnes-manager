
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('roles(name)')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du rôle:', error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les informations de rôle",
            variant: "destructive"
          });
          setUserRole(null);
        } else {
          setUserRole(profile?.roles?.name || null);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [toast]);

  const isAdmin = userRole === 'Admin';
  const hasRole = (role: string) => userRole === role;

  return {
    userRole,
    isAdmin,
    hasRole,
    isLoading
  };
};
