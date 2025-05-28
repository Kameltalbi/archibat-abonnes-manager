
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';

export const GDPRNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('tracking-consent');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tracking-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('tracking-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="border-blue-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Suivi d'activité et temps de travail
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ce site suit votre temps de travail actif et périodes d'inactivité pour des raisons 
                de productivité et de gestion. Les données collectées incluent vos heures de connexion, 
                déconnexion et périodes d'inactivité. En continuant, vous acceptez cette politique de suivi.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button onClick={handleAccept} className="flex-1">
                  J'accepte
                </Button>
                <Button variant="outline" onClick={handleDecline} className="flex-1">
                  Je refuse
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
