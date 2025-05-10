
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ContactSelector, Contact } from './ContactSelector';
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal';

interface ContactsTabProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

export function ContactsTab({ contacts, onSelectContact }: ContactsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Contacts à prospecter</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Nouveau contact
          </Button>
          <AddSubscriberModal />
        </div>
      </div>
      
      <ContactSelector 
        contacts={contacts} 
        onSelectContact={onSelectContact} 
      />
    </div>
  );
}
