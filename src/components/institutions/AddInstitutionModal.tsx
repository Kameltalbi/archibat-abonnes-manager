
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { InstitutionForm } from './InstitutionForm';
import { Plus } from 'lucide-react';

interface AddInstitutionModalProps {
  onInstitutionAdded?: () => void;
}

export function AddInstitutionModal({ onInstitutionAdded }: AddInstitutionModalProps) {
  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
    // Appeler la fonction de rafraîchissement si elle existe
    if (onInstitutionAdded) {
      onInstitutionAdded();
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
          <DialogTitle>Nouvelle institution abonnée</DialogTitle>
        </DialogHeader>
        <InstitutionForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
