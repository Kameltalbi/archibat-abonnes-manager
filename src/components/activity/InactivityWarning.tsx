
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface InactivityWarningProps {
  onDismiss: () => void;
}

export const InactivityWarning: React.FC<InactivityWarningProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 shadow-lg border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Inactivité détectée</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Vous êtes inactif depuis 5 minutes. Cliquez sur le bouton ci-dessous pour rester connecté.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onDismiss}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Ignorer</span>
            </Button>
            <Button
              onClick={onDismiss}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600"
            >
              <span>Je suis là !</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
