
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { SubscriberForm } from './SubscriberForm';
import { Plus } from 'lucide-react';

export function AddSubscriberModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un abonné
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel abonné</DialogTitle>
        </DialogHeader>
        <SubscriberForm />
      </DialogContent>
    </Dialog>
  );
}
