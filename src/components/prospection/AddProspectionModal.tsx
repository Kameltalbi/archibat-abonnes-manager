
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from './ContactSelector';
import { ProspectionForm } from './ProspectionForm';
import { ProspectionItem } from './ProspectionTable';

interface AddProspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any) => void;
  selectedContact?: Contact | null;
  editingProspection?: ProspectionItem | null;
}

export function AddProspectionModal({ open, onOpenChange, onAdd, selectedContact, editingProspection }: AddProspectionModalProps) {
  const handleFormSubmit = (data: any) => {
    onAdd(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingProspection
              ? `Modifier l'action de prospection`
              : selectedContact 
                ? `Contacter ${selectedContact.name}`
                : 'Ajouter un appel ou rendez-vous'
            }
          </DialogTitle>
        </DialogHeader>
        <ProspectionForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          selectedContact={selectedContact}
          editingProspection={editingProspection}
        />
      </DialogContent>
    </Dialog>
  );
}
