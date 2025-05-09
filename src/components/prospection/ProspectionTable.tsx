
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProspectionItem {
  id: number;
  contactName: string;
  date: string;
  time?: string;
  type: string;
  notes: string;
  result: string;
}

interface ProspectionTableProps {
  data: ProspectionItem[];
  onDelete: (id: number) => void;
}

export function ProspectionTable({ data, onDelete }: ProspectionTableProps) {
  const getBadgeVariant = (result: string) => {
    switch(result) {
      case 'Rendez-vous fixé':
        return 'default';
      case 'À relancer':
        return 'secondary';
      case 'Intéressé':
        return 'outline';
      case 'Pas intéressé':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Contact / Entreprise</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Résumé</TableHead>
            <TableHead>Résultat</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucune action de prospection enregistrée
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{formatDate(item.date)}</div>
                  {item.time && <div className="text-sm text-muted-foreground">{item.time}</div>}
                </TableCell>
                <TableCell className="font-medium">{item.contactName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted/50">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(item.result)}>
                    {item.result}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(item.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
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
