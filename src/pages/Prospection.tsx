
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ProspectionItem } from '@/components/prospection/ProspectionTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, PhoneCallIcon } from 'lucide-react';
import { AddProspectionModal } from '@/components/prospection/AddProspectionModal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact } from '@/components/prospection/ContactSelector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProspectionHistory } from '@/components/prospection/ProspectionHistory';
import { ContactsTab } from '@/components/prospection/ContactsTab';

const Prospection = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [prospectionData, setProspectionData] = useState<ProspectionItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState({
    prospection: true,
    contacts: true
  });
  
  useEffect(() => {
    // Fetch prospection data and contacts
    fetchProspectionData();
    fetchContacts();
  }, []);

  async function fetchProspectionData() {
    try {
      setLoading(prev => ({ ...prev, prospection: true }));
      
      const { data, error } = await supabase
        .from('prospection')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      const formattedData: ProspectionItem[] = data.map(item => ({
        id: item.id,
        contactName: item.contact_name,
        phone: item.phone || '',
        date: item.date,
        time: item.time,
        type: item.type,
        notes: item.notes || '',
        result: item.result || ''
      }));
      
      setProspectionData(formattedData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de prospection:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données de prospection",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, prospection: false }));
    }
  }
  
  async function fetchContacts() {
    try {
      setLoading(prev => ({ ...prev, contacts: true }));
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      const formattedContacts: Contact[] = data.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || ''
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  }

  const handleAddProspection = async (newProspection: Omit<ProspectionItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('prospection')
        .insert([
          {
            contact_name: newProspection.contactName,
            phone: newProspection.phone,
            date: newProspection.date,
            time: newProspection.time,
            type: newProspection.type,
            notes: newProspection.notes,
            result: newProspection.result
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const formattedProspection: ProspectionItem = {
          id: data[0].id,
          contactName: data[0].contact_name,
          phone: data[0].phone || '',
          date: data[0].date,
          time: data[0].time,
          type: data[0].type,
          notes: data[0].notes || '',
          result: data[0].result || ''
        };
        
        setProspectionData([formattedProspection, ...prospectionData]);
        
        toast({
          title: "Prospection ajoutée",
          description: "L'activité de prospection a été enregistrée avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la prospection:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'activité de prospection",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProspection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prospection')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProspectionData(prospectionData.filter(item => item.id !== id));
      
      toast({
        title: "Suppression réussie",
        description: "L'activité de prospection a été supprimée",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité de prospection",
        variant: "destructive"
      });
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsAddModalOpen(true);
  };

  if (loading.prospection || loading.contacts) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-archibat-blue"></div>
      </div>
    );
  }

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
              <ProspectionHistory 
                data={prospectionData} 
                onDelete={handleDeleteProspection} 
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts">
            <Card className="bg-white rounded-lg border shadow p-6">
              <ContactsTab 
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
