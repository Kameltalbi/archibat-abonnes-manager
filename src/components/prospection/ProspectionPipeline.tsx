
import React from 'react';
import { Prospect, ProspectStatus } from '@/pages/Prospection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ProspectionPipelineProps {
  prospects: Prospect[];
  onUpdateStatus: (id: string, newStatus: ProspectStatus) => void;
}

const statusLabels: Record<ProspectStatus, string> = {
  nouveau: 'Nouveaux',
  contact_initial: 'Contact initial',
  proposition: 'Proposition',
  negociation: 'Négociation',
  gagne: 'Gagnés',
  perdu: 'Perdus',
};

const statusColors: Record<ProspectStatus, string> = {
  nouveau: 'bg-blue-100 border-blue-300',
  contact_initial: 'bg-purple-100 border-purple-300',
  proposition: 'bg-amber-100 border-amber-300',
  negociation: 'bg-orange-100 border-orange-300',
  gagne: 'bg-green-100 border-green-300',
  perdu: 'bg-red-100 border-red-300',
};

const dragStatus = (event: React.DragEvent<HTMLDivElement>, prospectId: string) => {
  event.dataTransfer.setData('prospectId', prospectId);
};

export function ProspectionPipeline({ prospects, onUpdateStatus }: ProspectionPipelineProps) {
  const stages: ProspectStatus[] = ['nouveau', 'contact_initial', 'proposition', 'negociation', 'gagne', 'perdu'];
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: ProspectStatus) => {
    event.preventDefault();
    const prospectId = event.dataTransfer.getData('prospectId');
    onUpdateStatus(prospectId, status);
  };

  const getTotalValue = (status: ProspectStatus): number => {
    return prospects
      .filter(prospect => prospect.statut === status)
      .reduce((sum, prospect) => sum + prospect.valeurPotentielle, 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Pipeline de prospection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map(status => (
          <div 
            key={status}
            className="flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <Card className="h-full">
              <CardHeader className={`py-3 ${status === 'gagne' ? 'bg-green-100' : status === 'perdu' ? 'bg-red-100' : 'bg-gray-100'}`}>
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{statusLabels[status]}</span>
                  <span className="bg-white rounded-full px-2 py-0.5 text-xs">
                    {prospects.filter(p => p.statut === status).length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex flex-col space-y-2 overflow-y-auto" style={{ maxHeight: '400px' }}>
                {prospects
                  .filter(prospect => prospect.statut === status)
                  .map(prospect => (
                    <div
                      key={prospect.id}
                      draggable
                      onDragStart={(e) => dragStatus(e, prospect.id)}
                      className={`p-3 rounded-md border ${statusColors[status]} cursor-move hover:shadow-md transition-shadow`}
                    >
                      <div className="font-medium truncate">{prospect.entreprise}</div>
                      <div className="text-sm text-gray-600 truncate">{prospect.contact}</div>
                      <div className="mt-1 text-sm font-semibold">{formatCurrency(prospect.valeurPotentielle)}</div>
                    </div>
                  ))}
                {prospects.filter(p => p.statut === status).length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-400 italic">
                    Déposez des prospects ici
                  </div>
                )}
              </CardContent>
              <div className="px-3 py-2 border-t bg-gray-50 text-sm font-medium">
                Total: {formatCurrency(getTotalValue(status))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
