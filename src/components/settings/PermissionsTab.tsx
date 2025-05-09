
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for permissions
const permissions = [
  { key: "dashboard.view", description: "Accès au tableau de bord (lecture)", pages: ["Dashboard"], roles: ["Admin", "Éditeur", "Viewer"] },
  { key: "dashboard.edit", description: "Accès au tableau de bord (édition)", pages: ["Dashboard"], roles: ["Admin"] },
  { key: "program.view", description: "Accès au programme de travail (lecture)", pages: ["Programme de travail"], roles: ["Admin", "Éditeur", "Abonné", "Viewer"] },
  { key: "program.edit", description: "Accès au programme de travail (édition)", pages: ["Programme de travail"], roles: ["Admin", "Éditeur"] },
  { key: "invoices.view", description: "Accès aux factures (lecture)", pages: ["Factures"], roles: ["Admin", "Éditeur", "Abonné"] },
  { key: "invoices.edit", description: "Accès aux factures (édition)", pages: ["Factures"], roles: ["Admin"] },
  { key: "subscribers.view", description: "Accès aux abonnés (lecture)", pages: ["Abonnés locaux", "Abonnés internationaux"], roles: ["Admin", "Éditeur"] },
  { key: "subscribers.edit", description: "Accès aux abonnés (édition)", pages: ["Abonnés locaux", "Abonnés internationaux"], roles: ["Admin"] },
  { key: "statistics.view", description: "Accès aux statistiques", pages: ["Statistiques"], roles: ["Admin", "Éditeur", "Viewer"] },
];

const PermissionsTab = () => {
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
        {permissions.map((permission) => (
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
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionsTab;
