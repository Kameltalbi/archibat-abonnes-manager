
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SubscriberForm } from '@/components/subscribers/SubscriberForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const NewSubscriber = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader 
        title="Nouvel abonné" 
        description="Créer un nouvel abonné local"
      >
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <SubscriberForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSubscriber;
