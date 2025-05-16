
import React from 'react';
import { ProspectionTable, ProspectionItem } from './ProspectionTable';
import { Button } from '@/components/ui/button';

interface ProspectionHistoryProps {
  data: ProspectionItem[];
  onDelete: (id: string) => void;
  onEdit?: (item: ProspectionItem) => void;
}

export function ProspectionHistory({ data, onDelete, onEdit }: ProspectionHistoryProps) {
  return (
    <div>
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
        data={data}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}
