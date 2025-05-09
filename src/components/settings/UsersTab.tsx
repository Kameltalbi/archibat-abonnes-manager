
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { User } from '@/lib/supabase-types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Supposons que ces rôles soient disponibles
const roles = ["Admin", "Éditeur", "Abonné", "Viewer"];

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'active' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur lors du chargement des utilisateurs",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error fetching users:', error);
      // Pour les fins de la démo, utilisez les données mockées si une erreur se produit
      setUsers([
        { id: "1", name: "Jean Dupont", email: "jean@archibat.com", role: "Admin", created_at: new Date().toISOString(), status: "active" },
        { id: "2", name: "Marie Laurent", email: "marie@archibat.com", role: "Éditeur", created_at: new Date().toISOString(), status: "active" },
        { id: "3", name: "Luc Martin", email: "luc@archibat.com", role: "Viewer", created_at: new Date().toISOString(), status: "active" },
        { id: "4", name: "Sophie Bernard", email: "sophie@archibat.com", role: "Abonné", created_at: new Date().toISOString(), status: "active" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès",
        });
      } catch (error: any) {
        toast({
          title: "Erreur lors de la suppression",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status as 'active' | 'inactive' | 'pending'
          })
          .eq('id', editingUser.id);
        
        if (error) throw error;
        
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, name: formData.name, email: formData.email, role: formData.role, status: formData.status as 'active' | 'inactive' | 'pending' }
            : user
        ));
        
        toast({
          title: "Utilisateur mis à jour",
          description: "Les informations de l'utilisateur ont été mises à jour avec succès",
        });
      } else {
        // Add new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status as 'active' | 'inactive' | 'pending'
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setUsers([data[0], ...users]);
        }
        
        toast({
          title: "Utilisateur ajouté",
          description: "L'utilisateur a été ajouté avec succès",
        });
      }
      
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 
                    user.status === 'pending' ? 'En attente' : 'Inactif'}
                  </span>
                </TableCell>
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
            ))}
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
              />
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleFormChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Mettre à jour" : "Inviter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
