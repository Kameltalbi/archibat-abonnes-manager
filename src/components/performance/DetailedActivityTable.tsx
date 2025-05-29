
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, AlertTriangle, User } from 'lucide-react';

interface SessionData {
  id: string;
  user_id: string;
  login_time: string;
  logout_time: string | null;
  status: string;
  device: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface InactivityData {
  id: string;
  session_id: string;
  start_idle: string;
  end_idle: string | null;
  duration_minutes: number | null;
}

interface DetailedActivityTableProps {
  sessions: SessionData[];
  inactivityData: InactivityData[];
}

export const DetailedActivityTable: React.FC<DetailedActivityTableProps> = ({ 
  sessions, 
  inactivityData 
}) => {
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getInactivityForSession = (sessionId: string) => {
    return inactivityData.filter(inactivity => 
      inactivity.session_id === sessionId && 
      (inactivity.duration_minutes || 0) >= 5
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
      case 'logged_out':
        return <Badge variant="secondary">Déconnecté</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Activité détaillée des utilisateurs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Aucune activité enregistrée pour la période sélectionnée
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Activité détaillée des utilisateurs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Connexion</TableHead>
                <TableHead>Déconnexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Appareil</TableHead>
                <TableHead>Absences +5min</TableHead>
                <TableHead>Durée totale d'absence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const inactivityPeriods = getInactivityForSession(session.id);
                const totalInactivityMinutes = inactivityPeriods.reduce(
                  (sum, period) => sum + (period.duration_minutes || 0), 
                  0
                );

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{session.profiles?.full_name || 'Utilisateur inconnu'}</div>
                        <div className="text-sm text-gray-500">{session.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span>{formatTime(session.login_time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.logout_time ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-red-600" />
                          <span>{formatTime(session.logout_time)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">En cours</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{session.device}</span>
                    </TableCell>
                    <TableCell>
                      {inactivityPeriods.length > 0 ? (
                        <div className="space-y-1">
                          {inactivityPeriods.map((period, index) => (
                            <div key={period.id || index} className="flex items-center space-x-1 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span>
                                {formatTime(period.start_idle)} 
                                {period.end_idle && ` - ${format(new Date(period.end_idle), 'HH:mm')}`}
                                {period.duration_minutes && ` (${formatDuration(period.duration_minutes)})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Aucune</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {totalInactivityMinutes > 0 ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          {formatDuration(totalInactivityMinutes)}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          0m
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
