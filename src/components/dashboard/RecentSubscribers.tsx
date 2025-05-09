
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  type: string;
  status: 'active' | 'pending' | 'expired';
  date: string;
}

interface RecentSubscribersProps {
  subscribers: Subscriber[];
}

export function RecentSubscribers({ subscribers }: RecentSubscribersProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="archibat-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Abonnés récents</h3>
        <a href="/abonnes-locaux" className="text-sm text-archibat-blue hover:underline">
          Voir tout
        </a>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.type}</TableCell>
                <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                <TableCell>{subscriber.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
