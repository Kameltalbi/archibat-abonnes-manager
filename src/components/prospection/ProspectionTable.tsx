
import React, { useState } from 'react';
import { Prospect, ProspectStatus } from '@/pages/Prospection';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProspectionTableProps {
  prospects: Prospect[];
  onUpdateStatus: (id: string, newStatus: ProspectStatus) => void;
}

export function ProspectionTable({ prospects, onUpdateStatus }: ProspectionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProspects = prospects.filter(
    (prospect) =>
      prospect.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ProspectStatus) => {
    switch (status) {
      case 'nouveau':
        return <Badge className="bg-blue-500">Nouveau</Badge>;
      case 'contact_initial':
        return <Badge className="bg-purple-500">Contact initial</Badge>;
      case 'proposition':
        return <Badge className="bg-amber-500">Proposition</Badge>;
      case 'negociation':
        return <Badge className="bg-orange-500">Négociation</Badge>;
      case 'gagne':
        return <Badge className="bg-green-500 hover:bg-green-600">Gagné</Badge>;
      case 'perdu':
        return <Badge className="bg-red-500 hover:bg-red-600">Perdu</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un prospect..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entreprise</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Valeur potentielle</TableHead>
              <TableHead>Date du dernier contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProspects.length > 0 ? (
              filteredProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">{prospect.entreprise}</TableCell>
                  <TableCell>{prospect.contact}</TableCell>
                  <TableCell>{prospect.email}</TableCell>
                  <TableCell>{prospect.telephone}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={prospect.statut} 
                      onValueChange={(value) => onUpdateStatus(prospect.id, value as ProspectStatus)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue>{getStatusBadge(prospect.statut)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nouveau">
                          <Badge className="bg-blue-500">Nouveau</Badge>
                        </SelectItem>
                        <SelectItem value="contact_initial">
                          <Badge className="bg-purple-500">Contact initial</Badge>
                        </SelectItem>
                        <SelectItem value="proposition">
                          <Badge className="bg-amber-500">Proposition</Badge>
                        </SelectItem>
                        <SelectItem value="negociation">
                          <Badge className="bg-orange-500">Négociation</Badge>
                        </SelectItem>
                        <SelectItem value="gagne">
                          <Badge className="bg-green-500">Gagné</Badge>
                        </SelectItem>
                        <SelectItem value="perdu">
                          <Badge className="bg-red-500">Perdu</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatCurrency(prospect.valeurPotentielle)}</TableCell>
                  <TableCell>{prospect.dateDernierContact}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
