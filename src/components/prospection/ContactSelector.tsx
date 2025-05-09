
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneIcon, UserIcon, MailIcon } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface ContactSelectorProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

export function ContactSelector({ contacts, onSelectContact }: ContactSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input 
          placeholder="Rechercher un contact..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Aucun contact trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {contact.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      {contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => onSelectContact(contact)}
                      variant="outline"
                      size="sm"
                    >
                      Contacter
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
