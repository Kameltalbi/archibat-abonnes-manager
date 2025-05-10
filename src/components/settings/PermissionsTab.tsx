
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Permission {
  key: string;
  description: string;
  pages: string[];
  roles: string[];
}

const PermissionsTab = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        setLoading(true);
        
        // Récupérer les permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*');

        if (permissionsError) throw permissionsError;

        // Récupérer les rôles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*');

        if (rolesError) throw rolesError;

        // Récupérer les associations rôles-permissions
        const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
          .from('role_permissions')
          .select('*');

        if (rolePermissionsError) throw rolePermissionsError;

        // Transformer les données en format attendu par le composant
        const formattedPermissions: Permission[] = permissionsData.map(permission => {
          // Trouver tous les role_permissions pour cette permission
          const permissionRoleIds = rolePermissionsData
            .filter(rp => rp.permission_id === permission.id)
            .map(rp => rp.role_id);

          // Trouver les noms des rôles correspondants
          const roleNames = rolesData
            .filter(role => permissionRoleIds.includes(role.id))
            .map(role => role.name);

          // Pages concernées (à définir dans un champ de la base de données ou à partir d'une map)
          const pageMap: Record<string, string[]> = {
            'dashboard.view': ['Dashboard'],
            'dashboard.edit': ['Dashboard'],
            'program.view': ['Programme de travail'],
            'program.edit': ['Programme de travail'],
            'invoices.view': ['Factures'],
            'invoices.edit': ['Factures'],
            'subscribers.view': ['Abonnés locaux', 'Abonnés internationaux'],
            'subscribers.edit': ['Abonnés locaux', 'Abonnés internationaux'],
            'statistics.view': ['Statistiques'],
          };

          return {
            key: permission.key,
            description: permission.description,
            pages: pageMap[permission.key] || [],
            roles: roleNames
          };
        });

        setPermissions(formattedPermissions);
      } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les permissions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Clé de permission</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Pages concernées</TableHead>
          <TableHead>Rôles avec accès</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              Aucune permission configurée
            </TableCell>
          </TableRow>
        ) : (
          permissions.map((permission) => (
            <TableRow key={permission.key}>
              <TableCell className="font-mono text-sm">
                {permission.key}
              </TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {permission.pages.map(page => (
                    <Badge key={page} variant="outline">{page}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {permission.roles.map(role => (
                    <Badge key={role} variant="secondary">{role}</Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PermissionsTab;
