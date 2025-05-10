
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from './ContactSelector';
import { ProspectionForm } from './ProspectionForm';

interface AddProspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any) => void;
  selectedContact?: Contact | null;
}

export function AddProspectionModal({ open, onOpenChange, onAdd, selectedContact }: AddProspectionModalProps) {
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
            {selectedContact 
              ? `Contacter ${selectedContact.name}`
              : 'Ajouter un appel ou rendez-vous'
            }
          </DialogTitle>
        </DialogHeader>
        <ProspectionForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          selectedContact={selectedContact}
        />
      </DialogContent>
    </Dialog>
  );
}
