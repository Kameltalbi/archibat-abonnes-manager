
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyIcon, SettingsIcon, PlusIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
  userCount: number;
  permissions: string[];
}

interface Permission {
  id: string;
  key: string;
  description: string;
}

const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', permissions: [] as string[] });
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRolesAndPermissions() {
      try {
        setLoading(true);
        
        // Récupérer tous les rôles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*');
          
        if (rolesError) throw rolesError;

        // Récupérer toutes les permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*');
          
        if (permissionsError) throw permissionsError;
          
        setAllPermissions(permissionsData);

        // Récupérer les associations rôles-permissions
        const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
          .from('role_permissions')
          .select('*');
          
        if (rolePermissionsError) throw rolePermissionsError;

        // Récupérer le nombre d'utilisateurs par rôle
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('role_id');
          
        if (profilesError) throw profilesError;

        // Compter les utilisateurs par rôle
        const roleCounts = profilesData.reduce((counts: Record<string, number>, profile) => {
          if (profile.role_id) {
            counts[profile.role_id] = (counts[profile.role_id] || 0) + 1;
          }
          return counts;
        }, {});

        // Formater les données
        const formattedRoles = rolesData.map(role => {
          // Trouver les clés de permission pour ce rôle
          const rolePermissionIds = rolePermissionsData
            .filter(rp => rp.role_id === role.id)
            .map(rp => rp.permission_id);
            
          // Récupérer les clés de permission
          const permissionKeys = permissionsData
            .filter(p => rolePermissionIds.includes(p.id))
            .map(p => p.key);

          return {
            id: role.id,
            name: role.name,
            userCount: roleCounts[role.id] || 0,
            permissions: permissionKeys
          };
        });

        setRoles(formattedRoles);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les rôles",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRolesAndPermissions();
  }, []);

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, permissions: [...role.permissions] });
    setIsDrawerOpen(true);
  };

  const handleDuplicateRole = async (role: Role) => {
    try {
      // Créer une copie du rôle dans la base de données
      const { data: newRole, error: roleError } = await supabase
        .from('roles')
        .insert([{ name: `${role.name} (copie)` }])
        .select()
        .single();
        
      if (roleError) throw roleError;

      // Récupérer les IDs des permissions
      const permissionIds = allPermissions
        .filter(p => role.permissions.includes(p.key))
        .map(p => p.id);
        
      // Créer les associations de permissions pour le nouveau rôle
      const rolePermissionsToInsert = permissionIds.map(permId => ({
        role_id: newRole.id,
        permission_id: permId
      }));
      
      const { error: permError } = await supabase
        .from('role_permissions')
        .insert(rolePermissionsToInsert);
        
      if (permError) throw permError;

      // Ajouter le nouveau rôle à l'état local
      const newRoleObj: Role = {
        id: newRole.id,
        name: newRole.name,
        userCount: 0,
        permissions: [...role.permissions]
      };
      
      setRoles([...roles, newRoleObj]);
      
      toast({
        title: "Rôle dupliqué",
        description: `Le rôle ${role.name} a été dupliqué avec succès`,
      });
      
    } catch (error) {
      console.error('Erreur lors de la duplication du rôle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le rôle",
        variant: "destructive"
      });
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      
      return { ...prev, permissions };
    });
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;
    
    try {
      // Mettre à jour le nom du rôle
      const { error: roleError } = await supabase
        .from('roles')
        .update({ name: formData.name })
        .eq('id', editingRole.id);
        
      if (roleError) throw roleError;

      // Récupérer tous les IDs des permissions actuelles
      const permissionIds = allPermissions
        .filter(p => formData.permissions.includes(p.key))
        .map(p => p.id);

      // Supprimer toutes les associations existantes
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', editingRole.id);
        
      if (deleteError) throw deleteError;

      // Créer les nouvelles associations
      const rolePermissionsToInsert = permissionIds.map(permId => ({
        role_id: editingRole.id,
        permission_id: permId
      }));
      
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissionsToInsert);
        
      if (insertError) throw insertError;

      // Mettre à jour l'état local
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: formData.name, permissions: formData.permissions }
          : role
      ));
      
      toast({
        title: "Rôle mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });
      
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive"
      });
    }
  };

  const handleAddRole = () => {
    // Réinitialiser le formulaire
    setEditingRole(null);
    setFormData({ name: '', permissions: [] });
    setIsDrawerOpen(true);
  };

  const handleCreateNewRole = async () => {
    if (!formData.name) {
      toast({
        title: "Erreur",
        description: "Le nom du rôle est requis",
        variant: "destructive"
      });
      return;
    }

    try {
      // Créer un nouveau rôle
      const { data: newRole, error: roleError } = await supabase
        .from('roles')
        .insert([{ name: formData.name }])
        .select()
        .single();
        
      if (roleError) throw roleError;

      // Récupérer les IDs des permissions
      const permissionIds = allPermissions
        .filter(p => formData.permissions.includes(p.key))
        .map(p => p.id);
        
      if (permissionIds.length > 0) {
        // Créer les associations de permissions pour le nouveau rôle
        const rolePermissionsToInsert = permissionIds.map(permId => ({
          role_id: newRole.id,
          permission_id: permId
        }));
        
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(rolePermissionsToInsert);
          
        if (permError) throw permError;
      }

      // Ajouter le nouveau rôle à l'état local
      const newRoleObj: Role = {
        id: newRole.id,
        name: newRole.name,
        userCount: 0,
        permissions: formData.permissions
      };
      
      setRoles([...roles, newRoleObj]);
      
      toast({
        title: "Rôle créé",
        description: "Le nouveau rôle a été créé avec succès",
      });
      
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du rôle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rôle",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddRole}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un rôle
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du rôle</TableHead>
            <TableHead>Utilisateurs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                Aucun rôle configuré
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.userCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)}>
                      <SettingsIcon className="h-4 w-4" />
                      <span className="sr-only">Modifier les permissions</span>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDuplicateRole(role)}>
                      <CopyIcon className="h-4 w-4" />
                      <span className="sr-only">Dupliquer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Drawer for editing role permissions */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editingRole ? 'Modifier les permissions du rôle' : 'Créer un nouveau rôle'}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nom du rôle</Label>
                <Input 
                  id="role-name" 
                  value={formData.name} 
                  onChange={(e) => handleNameChange(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Permissions</Label>
                <div className="grid gap-3 pt-2">
                  {allPermissions.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="flex items-start space-x-2"
                    >
                      <Checkbox 
                        id={permission.key} 
                        checked={formData.permissions.includes(permission.key)}
                        onCheckedChange={() => handlePermissionChange(permission.key)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={permission.key} 
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.description}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.key}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <SheetFooter className="sm:justify-end">
            <Button variant="outline" className="mr-2" onClick={() => setIsDrawerOpen(false)}>
              Annuler
            </Button>
            <Button onClick={editingRole ? handleSaveRole : handleCreateNewRole}>
              {editingRole ? 'Enregistrer les modifications' : 'Créer le rôle'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RolesTab;
