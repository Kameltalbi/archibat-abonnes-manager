
import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel abonnement</DialogTitle>
        </DialogHeader>
        <SubscriberForm onClose={() => setOpen(false)} isInternational={false} />
      </DialogContent>
    </Dialog>
  );
}
