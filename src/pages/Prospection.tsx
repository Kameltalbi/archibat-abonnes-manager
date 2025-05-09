
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';

const Prospection = () => {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Prospection" 
        description="Gérer vos activités de prospection" 
      />
      
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-4">Activités de prospection</h2>
        <p className="text-gray-500">
          Cette section vous permet de suivre et gérer toutes vos activités de prospection.
        </p>
        
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
            Le contenu de cette page est en cours de développement.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prospection;
