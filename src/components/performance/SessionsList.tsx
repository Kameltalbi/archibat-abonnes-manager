
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Monitor, AlertCircle, User } from 'lucide-react';
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

  const formatTimeOnly = (timeString: string | null) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('fr-FR', { 
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
      return <Badge className="bg-green-500 text-white hover:bg-green-600">🟢 En cours</Badge>;
    } else if (status === 'inactive' || logoutTime) {
      return <Badge variant="secondary" className="bg-gray-500 text-white">⚫ Terminée</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          <User className="h-5 w-5 text-blue-600" />
          Sessions de connexion - Aymen Boubakri
          <Badge variant="outline" className="ml-2">
            {sessions?.length || 0} session{(sessions?.length || 0) > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions && sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Connexion</TableHead>
                  <TableHead className="font-semibold">Déconnexion</TableHead>
                  <TableHead className="font-semibold">Durée session</TableHead>
                  <TableHead className="font-semibold">Temps actif</TableHead>
                  <TableHead className="font-semibold">Inactivité</TableHead>
                  <TableHead className="font-semibold">Appareil</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Détails inactivité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const sessionDuration = calculateSessionDuration(session.login_time, session.logout_time);
                  const activeTime = sessionDuration - session.total_inactivity_minutes;
                  
                  return (
                    <TableRow key={session.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {formatDate(session.login_time)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatTimeOnly(session.login_time)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatTimeOnly(session.logout_time)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">{formatDuration(sessionDuration)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">{formatDuration(activeTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {session.total_inactivity_minutes > 0 ? (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-semibold">{formatDuration(session.total_inactivity_minutes)}</span>
                          </div>
                        ) : (
                          <span className="text-green-600 font-semibold">Aucune</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {session.device || 'Non spécifié'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(session.status, session.logout_time)}
                      </TableCell>
                      <TableCell>
                        {session.inactivity_periods.length > 0 ? (
                          <div className="space-y-1 max-w-xs">
                            {session.inactivity_periods.map((period, index) => (
                              <div key={index} className="text-xs bg-orange-50 border border-orange-200 p-2 rounded-md">
                                <div className="flex items-center gap-1 text-orange-700 font-medium">
                                  <AlertCircle className="h-3 w-3" />
                                  Période {index + 1}
                                </div>
                                <div className="mt-1">
                                  <span className="font-mono">
                                    {new Date(period.start_idle).toLocaleTimeString('fr-FR')} → {' '}
                                    {period.end_idle 
                                      ? new Date(period.end_idle).toLocaleTimeString('fr-FR')
                                      : 'En cours'
                                    }
                                  </span>
                                  {period.duration_minutes && (
                                    <div className="text-orange-600 font-semibold">
                                      {formatDuration(period.duration_minutes)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">Aucune période d'inactivité</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Aucune session trouvée</p>
            <p className="text-sm text-gray-500">
              Aucune session de connexion n'a été enregistrée pour Aymen Boubakri sur cette période.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
