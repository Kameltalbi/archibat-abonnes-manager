
import React from 'react';
import { SubscriptionType } from '@/pages/SubscriptionTypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface SubscriptionTypeTableProps {
  subscriptionTypes: SubscriptionType[];
  onToggleActive: (id: string) => void;
}

export function SubscriptionTypeTable({ subscriptionTypes, onToggleActive }: SubscriptionTypeTableProps) {
  const getReaderTypeBadge = (type: 'particulier' | 'etudiant' | 'institution') => {
    switch (type) {
      case 'particulier':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Particulier</Badge>;
      case 'etudiant':
        return <Badge className="bg-green-500 hover:bg-green-600">Étudiant</Badge>;
      case 'institution':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Institution</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Type de lecteur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptionTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="font-medium">{type.nom}</TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell>{type.duree} {type.duree > 1 ? 'mois' : 'mois'}</TableCell>
              <TableCell>{type.prix} €</TableCell>
              <TableCell>{getReaderTypeBadge(type.typeLecteur)}</TableCell>
              <TableCell>
                <Badge variant={type.actif ? 'default' : 'outline'} className={type.actif ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {type.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Switch 
                    checked={type.actif} 
                    onCheckedChange={() => onToggleActive(type.id)} 
                    aria-label={type.actif ? 'Désactiver' : 'Activer'}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
