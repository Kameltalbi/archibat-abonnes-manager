
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Monitor, AlertCircle } from 'lucide-react';
import { useAymenSessions } from '@/hooks/useAymenSessions';

interface SessionsListProps {
  selectedPeriod: string;
  selectedDate: Date;
}

export const SessionsList: React.FC<SessionsListProps> = ({ 
  selectedPeriod, 
  selectedDate 
}) => {
  const { data: sessions, isLoading } = useAymenSessions(selectedDate, selectedPeriod);

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const calculateSessionDuration = (loginTime: string, logoutTime: string | null) => {
    const start = new Date(loginTime);
    const end = logoutTime ? new Date(logoutTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60)); // en minutes
  };

  const getStatusBadge = (status: string, logoutTime: string | null) => {
    if (status === 'active' && !logoutTime) {
      return <Badge className="bg-green-500 text-white">En cours</Badge>;
    } else if (status === 'inactive' || logoutTime) {
      return <Badge variant="secondary">Terminée</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Sessions de connexion - Aymen Boubakri
          <Badge variant="outline">{sessions?.length || 0} sessions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions && sessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Heure de connexion</TableHead>
                <TableHead>Heure de déconnexion</TableHead>
                <TableHead>Durée totale</TableHead>
                <TableHead>Temps d'inactivité</TableHead>
                <TableHead>Appareil</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Détails inactivité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const sessionDuration = calculateSessionDuration(session.login_time, session.logout_time);
                const activeTime = sessionDuration - session.total_inactivity_minutes;
                
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {formatTime(session.login_time)}
                    </TableCell>
                    <TableCell>
                      {formatTime(session.logout_time)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDuration(sessionDuration)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Actif: {formatDuration(activeTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.total_inactivity_minutes > 0 ? (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          {formatDuration(session.total_inactivity_minutes)}
                        </div>
                      ) : (
                        <span className="text-green-600">Aucune</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {session.device || 'Non spécifié'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status, session.logout_time)}
                    </TableCell>
                    <TableCell>
                      {session.inactivity_periods.length > 0 ? (
                        <div className="space-y-1">
                          {session.inactivity_periods.map((period, index) => (
                            <div key={index} className="text-xs bg-orange-50 p-1 rounded">
                              {new Date(period.start_idle).toLocaleTimeString('fr-FR')} - {' '}
                              {period.end_idle 
                                ? new Date(period.end_idle).toLocaleTimeString('fr-FR')
                                : 'En cours'
                              }
                              {period.duration_minutes && (
                                <span className="ml-1 font-medium">
                                  ({formatDuration(period.duration_minutes)})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Aucune période</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">Aucune session trouvée</p>
            <p className="text-sm">
              Aucune session de connexion n'a été enregistrée pour Aymen Boubakri sur cette période.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
