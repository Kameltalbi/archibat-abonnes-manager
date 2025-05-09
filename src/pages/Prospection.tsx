
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ProspectionTable } from '@/components/prospection/ProspectionTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, PhoneCallIcon, UsersIcon } from 'lucide-react';
import { AddProspectionModal } from '@/components/prospection/AddProspectionModal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactSelector } from '@/components/prospection/ContactSelector';

const Prospection = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Mock data - in a real app, this would come from Supabase
  const [prospectionData, setProspectionData] = useState([
    { 
      id: 1, 
      contactName: "Entreprise ABC", 
      date: "2025-05-07", 
      time: "14:30", 
      type: "Appel téléphonique", 
      notes: "Discussion sur les besoins en abonnement", 
      result: "À relancer" 
    },
    { 
      id: 2, 
      contactName: "Cabinet XYZ", 
      date: "2025-05-08", 
      time: "10:00", 
      type: "Rendez-vous physique", 
      notes: "Présentation des offres", 
      result: "Rendez-vous fixé" 
    },
    { 
      id: 3, 
      contactName: "Société 123", 
      date: "2025-05-09", 
      time: "16:15", 
      type: "Visio", 
      notes: "Démonstration de la plateforme", 
      result: "Intéressé" 
    }
  ]);

  // Mock data for contacts
  const contacts = [
    { id: 1, name: "Entreprise ABC", email: "contact@abc.com", phone: "+33 1 23 45 67 89" },
    { id: 2, name: "Cabinet XYZ", email: "info@xyz.fr", phone: "+33 1 98 76 54 32" },
    { id: 3, name: "Société 123", email: "contact@123.com", phone: "+33 6 12 34 56 78" },
    { id: 4, name: "Agence DEF", email: "info@def.fr", phone: "+33 6 98 76 54 32" },
    { id: 5, name: "Groupe GHI", email: "contact@ghi.com", phone: "+33 1 45 67 89 01" }
  ];

  const handleAddProspection = (newProspection) => {
    setProspectionData([
      ...prospectionData,
      { id: prospectionData.length + 1, ...newProspection }
    ]);
  };

  const handleDeleteProspection = (id) => {
    setProspectionData(prospectionData.filter(item => item.id !== id));
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setIsAddModalOpen(true);
  };

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Prospection commerciale" 
        description="Gestion des prospects et des appels"
        icon={<PhoneCallIcon className="h-6 w-6 text-archibat-blue" />}
      >
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-base py-1 px-3">
            Appels: {prospectionData.length}
          </Badge>
          <Button 
            onClick={() => {
              setSelectedContact(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter un appel
          </Button>
        </div>
      </PageHeader>
      
      <div className="mt-6">
        <Tabs defaultValue="historique">
          <TabsList className="mb-4">
            <TabsTrigger value="historique">Historique des appels</TabsTrigger>
            <TabsTrigger value="contacts">Liste de contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="historique">
            <Card className="bg-white rounded-lg border shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Liste des actions de prospection</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Cette semaine
                  </Button>
                  <Button variant="outline" size="sm">
                    Ce mois
                  </Button>
                  <Button variant="outline" size="sm">
                    Tout
                  </Button>
                </div>
              </div>
              
              <ProspectionTable 
                data={prospectionData}
                onDelete={handleDeleteProspection}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts">
            <Card className="bg-white rounded-lg border shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Contacts à prospecter</h2>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nouveau contact
                </Button>
              </div>
              
              <ContactSelector 
                contacts={contacts} 
                onSelectContact={handleSelectContact} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddProspectionModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddProspection}
        selectedContact={selectedContact}
      />
    </div>
  );
};

export default Prospection;

