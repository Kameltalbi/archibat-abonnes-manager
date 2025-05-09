
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export interface Institution {
  id: string;
  nom: string;
  type: 'Université' | 'École' | 'Institut' | 'Centre de recherche' | 'Autre';
  adresse: string;
  telephone: string;
  email: string;
  contact: string;
  dateAdhesion: string;
  statut: 'actif' | 'inactif' | 'en_attente';
}

interface InstitutionsTableProps {
  institutions: Institution[];
}

export function InstitutionsTable({ institutions }: InstitutionsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date d'adhésion</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Building2 className="h-8 w-8 opacity-30" />
                  <p>Aucune institution trouvée</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            institutions.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{institution.nom}</span>
                    <span className="text-xs text-muted-foreground">{institution.email}</span>
                  </div>
                </TableCell>
                <TableCell>{institution.type}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{institution.contact}</span>
                    <span className="text-xs text-muted-foreground">{institution.telephone}</span>
                  </div>
                </TableCell>
                <TableCell>{institution.dateAdhesion}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      institution.statut === 'actif' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : institution.statut === 'inactif' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }
                  >
                    {institution.statut === 'actif' 
                      ? 'Actif' 
                      : institution.statut === 'inactif' 
                      ? 'Inactif' 
                      : 'En attente'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
