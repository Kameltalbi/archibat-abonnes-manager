
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTab from '../components/settings/UsersTab';
import RolesTab from '../components/settings/RolesTab';
import PermissionsTab from '../components/settings/PermissionsTab';

const Settings = () => {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les utilisateurs, les rôles et les permissions</p>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Ajoutez, modifiez ou supprimez des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des rôles</CardTitle>
              <CardDescription>Configurez les rôles et leurs permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <RolesTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions système</CardTitle>
              <CardDescription>Consultez toutes les permissions disponibles dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
