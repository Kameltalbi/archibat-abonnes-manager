
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Interface pour les utilisateurs
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const { toast } = useToast();

  // Récupérer les rôles depuis Supabase
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    try {
      // Récupérer les utilisateurs depuis la table auth.users via la fonction admin
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, full_name, email, roles(name)')
        .order('created_at', { ascending: false });

      if (authError) throw authError;

      const formattedUsers = authUsers.map(user => ({
        id: user.id,
        name: user.full_name || 'Sans nom',
        email: user.email || '',
        role: user.roles?.name || 'Viewer'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('name')
        .order('name');

      if (error) throw error;

      if (data) {
        setRoles(data.map(role => role.name));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: '' });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', // Vider le mot de passe lors de l'édition
      role: user.role 
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        // Supprimer le profil (qui a une contrainte FK sur auth.users avec ON DELETE CASCADE)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        // Mettre à jour la liste des utilisateurs
        setUsers(users.filter(user => user.id !== userId));
        
        toast({
          title: "Succès",
          description: "L'utilisateur a été supprimé",
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.role) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (editingUser) {
        // Mise à jour d'un utilisateur existant
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', formData.role)
          .single();

        if (!roleData) throw new Error("Rôle non trouvé");

        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.name,
            role_id: roleData.id
          })
          .eq('id', editingUser.id);

        if (error) throw error;

        // Mettre à jour la liste locale
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, name: formData.name, role: formData.role }
            : user
        ));

        toast({
          title: "Succès",
          description: "L'utilisateur a été mis à jour",
        });
      } else {
        // Création d'un nouvel utilisateur via l'API d'administration de Supabase
        const { data, error } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
          user_metadata: {
            full_name: formData.name
          }
        });

        if (error) throw error;

        if (data && data.user) {
          // Le trigger DB s'occupe de créer le profil par défaut
          // On met à jour uniquement le rôle si différent de "Viewer" (défaut)
          if (formData.role !== 'Viewer') {
            const { data: roleData } = await supabase
              .from('roles')
              .select('id')
              .eq('name', formData.role)
              .single();

            if (roleData) {
              await supabase
                .from('profiles')
                .update({ role_id: roleData.id })
                .eq('id', data.user.id);
            }
          }

          const newUser = {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role
          };
          
          setUsers([newUser, ...users]);
          
          toast({
            title: "Succès",
            description: "Nouvel utilisateur créé avec succès",
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddUser}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center py-8">
          <p>Chargement des utilisateurs...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.id)}>
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Modal for adding/editing users */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? "Modifiez les informations de l'utilisateur" : "Remplissez le formulaire pour créer un nouvel utilisateur"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                disabled={!!editingUser} // Désactiver l'édition de l'email pour les utilisateurs existants
              />
            </div>
            {!editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleFormChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Traitement..." : editingUser ? "Mettre à jour" : "Inviter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
