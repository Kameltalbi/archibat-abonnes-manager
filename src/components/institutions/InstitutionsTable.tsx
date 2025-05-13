
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
import { Building2, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  onRefresh?: () => void;
}

export function InstitutionsTable({ institutions, onRefresh }: InstitutionsTableProps) {
  const handleDeleteInstitution = async (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'institution "${nom}" ?`)) {
      try {
        const { error } = await supabase
          .from('institutions')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Suppression réussie",
          description: `L'institution "${nom}" a été supprimée`,
        });
        
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          variant: "destructive",
          title: "Erreur de suppression",
          description: "Impossible de supprimer l'institution",
        });
      }
    }
  };

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
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteInstitution(institution.id, institution.nom)}
                        className="text-red-500 hover:text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
