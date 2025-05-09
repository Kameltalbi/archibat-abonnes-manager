
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createUserTableSQL, createRolesTableSQL, createPermissionsTableSQL, createRolePermissionsTableSQL } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Tableau contenant tous les scripts SQL
const sqlScripts = [
  { name: "Users", sql: createUserTableSQL },
  { name: "Roles", sql: createRolesTableSQL },
  { name: "Permissions", sql: createPermissionsTableSQL },
  { name: "Role Permissions", sql: createRolePermissionsTableSQL },
];

const DatabaseSetupTab = () => {
  // État pour suivre quelle table est en cours de visualisation
  const [activeTable, setActiveTable] = useState("Users");
  
  // Fonction pour copier le SQL dans le presse-papiers
  const copyToClipboard = (sql: string) => {
    navigator.clipboard.writeText(sql).then(() => {
      toast({
        title: "SQL copié",
        description: "Le script SQL a été copié dans le presse-papiers",
      });
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier le SQL",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Configuration des tables Supabase</h2>
        <p className="text-muted-foreground">
          Exécutez ces scripts SQL dans l'éditeur SQL de Supabase pour créer les tables nécessaires.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Comment créer les tables dans Supabase:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>Connectez-vous à votre compte Supabase et accédez à votre projet</li>
              <li>Cliquez sur "SQL Editor" dans le menu latéral</li>
              <li>Créez une nouvelle requête</li>
              <li>Copiez et collez le script SQL ci-dessous</li>
              <li>Exécutez la requête</li>
              <li>Répétez pour chaque table</li>
            </ol>
          </CardContent>
        </Card>

        <Tabs value={activeTable} onValueChange={setActiveTable}>
          <TabsList className="grid grid-cols-4">
            {sqlScripts.map((script) => (
              <TabsTrigger key={script.name} value={script.name}>
                {script.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sqlScripts.map((script) => (
            <TabsContent key={script.name} value={script.name}>
              <Card>
                <CardHeader>
                  <CardTitle>Script SQL pour {script.name}</CardTitle>
                  <CardDescription>
                    Cliquez sur le bouton ci-dessous pour copier le SQL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto">
                    <code>{script.sql}</code>
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => copyToClipboard(script.sql)}>
                    Copier le SQL
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseSetupTab;
