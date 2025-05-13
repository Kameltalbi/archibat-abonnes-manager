import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type Vente } from '@/pages/Ventes';
import { formatCurrency } from '@/lib/utils';

interface VentesTableProps {
  ventes: Vente[];
}

export function VentesTable({ ventes }: VentesTableProps) {
  const getStatusBadge = (statut: Vente['statut']) => {
    switch (statut) {
      case 'payé':
        return <Badge className="bg-green-500 hover:bg-green-600">Payé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En attente</Badge>;
      case 'annulé':
        return <Badge className="bg-red-500 hover:bg-red-600">Annulé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Mode de paiement</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune vente enregistrée
              </TableCell>
            </TableRow>
          ) : (
            ventes.map((vente) => (
              <TableRow key={vente.id}>
                <TableCell>{vente.numero}</TableCell>
                <TableCell>{vente.quantite}</TableCell>
                <TableCell>{vente.date}</TableCell>
                <TableCell>{vente.client}</TableCell>
                <TableCell>{formatCurrency(vente.montant)}</TableCell>
                <TableCell>{vente.modePaiement}</TableCell>
                <TableCell>{getStatusBadge(vente.statut)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
