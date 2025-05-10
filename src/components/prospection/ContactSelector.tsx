
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

export interface Contact {
  id: string | number;
  name: string;
  email: string;
  phone: string;
}

interface ContactSelectorProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

export function ContactSelector({ contacts, onSelectContact }: ContactSelectorProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Aucun contact disponible
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSelectContact(contact)}
                    className="flex items-center gap-2 text-archibat-blue hover:text-archibat-blue hover:bg-blue-50"
                  >
                    <PhoneCall size={16} />
                    Appeler
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
