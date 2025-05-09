
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyIcon, SettingsIcon, PlusIcon } from 'lucide-react';

// Mock data for roles
const initialRoles = [
  { id: 1, name: "Admin", userCount: 2, permissions: ["dashboard.view", "dashboard.edit", "program.view", "program.edit", "invoices.view", "invoices.edit", "subscribers.view", "subscribers.edit", "statistics.view"] },
  { id: 2, name: "Éditeur", userCount: 3, permissions: ["dashboard.view", "program.view", "program.edit", "invoices.view", "subscribers.view", "statistics.view"] },
  { id: 3, name: "Abonné", userCount: 5, permissions: ["program.view", "invoices.view"] },
  { id: 4, name: "Viewer", userCount: 8, permissions: ["dashboard.view", "program.view", "statistics.view"] },
];

// Mock data for all available permissions
const allPermissions = [
  { key: "dashboard.view", description: "Accès au tableau de bord (lecture)" },
  { key: "dashboard.edit", description: "Accès au tableau de bord (édition)" },
  { key: "program.view", description: "Accès au programme de travail (lecture)" },
  { key: "program.edit", description: "Accès au programme de travail (édition)" },
  { key: "invoices.view", description: "Accès aux factures (lecture)" },
  { key: "invoices.edit", description: "Accès aux factures (édition)" },
  { key: "subscribers.view", description: "Accès aux abonnés (lecture)" },
  { key: "subscribers.edit", description: "Accès aux abonnés (édition)" },
  { key: "statistics.view", description: "Accès aux statistiques" },
];

const RolesTab = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', permissions: [] });

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({ name: role.name, permissions: [...role.permissions] });
    setIsDrawerOpen(true);
  };

  const handleDuplicateRole = (role) => {
    const newRole = {
      id: Math.max(...roles.map(r => r.id)) + 1,
      name: `${role.name} (copie)`,
      userCount: 0,
      permissions: [...role.permissions]
    };
    setRoles([...roles, newRole]);
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      
      return { ...prev, permissions };
    });
  };

  const handleNameChange = (name) => {
    setFormData({ ...formData, name });
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: formData.name, permissions: formData.permissions }
          : role
      ));
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
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
          {roles.map((role) => (
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
          ))}
        </TableBody>
      </Table>

      {/* Drawer for editing role permissions */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Modifier les permissions du rôle</SheetTitle>
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
                      key={permission.key} 
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
            <Button onClick={handleSaveRole}>
              Enregistrer les modifications
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RolesTab;
