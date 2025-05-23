import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, UserIcon, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contact } from './ContactSelector';
import { ProspectionItem } from './ProspectionTable';

interface ProspectionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  selectedContact?: Contact | null;
  editingProspection?: ProspectionItem | null;
}

export function ProspectionForm({ onSubmit, onCancel, selectedContact, editingProspection }: ProspectionFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    time: '',
    type: 'Appel téléphonique',
    notes: '',
    result: 'À relancer'
  });

  // Pre-fill form with selected contact data or editing data
  useEffect(() => {
    if (editingProspection) {
      // If editing an existing prospection, pre-fill with its data
      setFormData({
        contactName: editingProspection.contactName,
        phone: editingProspection.phone || '',
        time: editingProspection.time || '',
        type: editingProspection.type,
        notes: editingProspection.notes || '',
        result: editingProspection.result || 'À relancer'
      });
      
      // Set the date from the editing prospection
      if (editingProspection.date) {
        const prospectionDate = parse(editingProspection.date, 'yyyy-MM-dd', new Date());
        setDate(prospectionDate);
      }
    } else if (selectedContact) {
      // Otherwise, if a contact is selected, pre-fill with contact data
      setFormData(prev => ({
        ...prev,
        contactName: selectedContact.name,
        phone: selectedContact.phone || ''
      }));
    }
  }, [selectedContact, editingProspection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom ou entreprise contactée</Label>
          <div className="relative">
            <Input 
              id="contactName" 
              name="contactName"
              placeholder="Entrez le nom du contact ou de l'entreprise" 
              value={formData.contactName}
              onChange={handleInputChange}
              required
              className="pl-10"
            />
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {selectedContact && !editingProspection && (
            <p className="text-sm text-muted-foreground">
              {selectedContact.phone} • {selectedContact.email}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="relative">
            <Input 
              id="phone" 
              name="phone"
              placeholder="Entrez le numéro de téléphone" 
              value={formData.phone}
              onChange={handleInputChange}
              className="pl-10"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date de l'appel</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Heure (optionnelle)</Label>
            <Input 
              id="time" 
              name="time"
              type="time" 
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type de contact</Label>
          <select 
            id="type" 
            name="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="Appel téléphonique">Appel téléphonique</option>
            <option value="Rendez-vous physique">Rendez-vous physique</option>
            <option value="Visio">Visioconférence</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Objet ou notes</Label>
          <textarea 
            id="notes" 
            name="notes"
            placeholder="Entrez vos notes concernant cet échange"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="result">Résultat</Label>
          <select 
            id="result" 
            name="result"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.result}
            onChange={handleInputChange}
          >
            <option value="À relancer">À relancer</option>
            <option value="Rendez-vous fixé">Rendez-vous fixé</option>
            <option value="Intéressé">Intéressé</option>
            <option value="Pas intéressé">Pas intéressé</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit">
          {editingProspection ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
