
import React from 'react';
import { AlertTriangle, Clock, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface InactivityWarningProps {
  onDismiss: () => void;
  inactivityLevel: 'warning' | 'reminder1' | 'reminder2';
}

export const InactivityWarning: React.FC<InactivityWarningProps> = ({ onDismiss, inactivityLevel }) => {
  const getContent = () => {
    switch (inactivityLevel) {
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
          title: "Inactivité détectée",
          bgColor: "border-orange-200",
          buttonColor: "bg-orange-500 hover:bg-orange-600",
          message: "Vous êtes inactif depuis 5 minutes.",
          details: [
            "• Tout le travail administratif DOIT être saisi sur ce site",
            "• Horaires obligatoires : 8h00 - 17h00 (pause déjeuner incluse)",
            "• Vous devez rester actif pendant vos heures de travail"
          ]
        };
      case 'reminder1':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          title: "RAPPEL URGENT - 30 minutes d'inactivité",
          bgColor: "border-red-300",
          buttonColor: "bg-red-500 hover:bg-red-600",
          message: "Vous êtes inactif depuis 30 minutes !",
          details: [
            "• Votre temps de travail n'est pas comptabilisé",
            "• Reprenez immédiatement votre activité",
            "• Saisissez vos tâches administratives",
            "• La société surveille votre activité"
          ]
        };
      case 'reminder2':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-700" />,
          title: "ALERTE - 1 HEURE D'INACTIVITÉ",
          bgColor: "border-red-500",
          buttonColor: "bg-red-700 hover:bg-red-800",
          message: "INACTIVITÉ CRITIQUE - 1 HEURE !",
          details: [
            "• Vous serez marqué comme INACTIF",
            "• Votre responsable sera notifié",
            "• Justification requise",
            "• Reprise de travail immédiate obligatoire"
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <Card className={`w-96 shadow-xl ${content.bgColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {content.icon}
            <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-gray-700 font-medium">
                {content.message}
              </p>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium mb-2">
                RAPPEL IMPORTANT :
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                {content.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
          
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
              className={`flex items-center space-x-2 ${content.buttonColor}`}
            >
              <span>Je reprends le travail</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
