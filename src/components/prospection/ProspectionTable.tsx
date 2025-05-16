
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export interface ProspectionItem {
  id: string;
  contactName: string;
  phone?: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  result?: string;
}

interface ProspectionTableProps {
  data: ProspectionItem[];
  onDelete: (id: string) => void;
}

export function ProspectionTable({ data, onDelete }: ProspectionTableProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'appel':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'réunion':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'email':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Résultat</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune activité de prospection
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.contactName}</TableCell>
                <TableCell>
                  {row.phone ? (
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-archibat-blue" />
                      <span>{row.phone}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Non précisé</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(row.type)}>{row.type}</Badge>
                </TableCell>
                <TableCell>
                  {row.result ? (
                    <span className="text-sm">{row.result}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Non précisé</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
