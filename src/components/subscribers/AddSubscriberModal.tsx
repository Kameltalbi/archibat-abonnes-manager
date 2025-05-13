
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

interface AddSubscriberModalProps {
  onSubscriberAdded?: () => void;
}

export function AddSubscriberModal({ onSubscriberAdded }: AddSubscriberModalProps) {
  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
    // Appeler la fonction de rafraîchissement si elle existe
    if (onSubscriberAdded) {
      onSubscriberAdded();
    }
  };
  
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
        <SubscriberForm onClose={handleClose} isInternational={false} />
      </DialogContent>
    </Dialog>
  );
}
