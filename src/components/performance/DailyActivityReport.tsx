
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DailySession {
  id: string;
  login_time: string;
  logout_time: string | null;
  status: string;
  activeTime: number;
  inactiveTime: number;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface DailyActivityReportProps {
  sessionsByUser: Array<{
    user_id: string;
    name: string;
    sessions: DailySession[];
    totalActiveTime: number;
    totalInactiveTime: number;
  }>;
  selectedDate: string;
}

export const DailyActivityReport: React.FC<DailyActivityReportProps> = ({ 
  sessionsByUser, 
  selectedDate 
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getActivityRate = (activeTime: number, inactiveTime: number) => {
    const total = activeTime + inactiveTime;
    return total > 0 ? (activeTime / total) * 100 : 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'logged_out':
        return <Badge className="bg-gray-100 text-gray-800">Déconnecté</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800">Inactif</Badge>;
    }
  };

  const selectedDateFormatted = format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Rapport d'activité du {selectedDateFormatted}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessionsByUser.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune activité enregistrée pour cette date
          </p>
        ) : (
          <div className="space-y-4">
            {sessionsByUser.map(user => (
              <div key={user.user_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">{user.name}</h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-green-600">
                      <Activity className="h-3 w-3" />
                      <span>{formatTime(user.totalActiveTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(user.totalInactiveTime)}</span>
                    </div>
                    <Badge variant="outline">
                      {getActivityRate(user.totalActiveTime, user.totalInactiveTime).toFixed(1)}% actif
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  {user.sessions
                    .filter(session => {
                      const sessionDate = format(new Date(session.login_time), 'yyyy-MM-dd');
                      return sessionDate === selectedDate;
                    })
                    .map(session => (
                      <div key={session.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                        <div className="flex items-center space-x-4">
                          <span>
                            {format(new Date(session.login_time), 'HH:mm')} - {' '}
                            {session.logout_time 
                              ? format(new Date(session.logout_time), 'HH:mm')
                              : 'En cours'
                            }
                          </span>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-600">
                            Actif: {formatTime(session.activeTime)}
                          </span>
                          <span className="text-red-600">
                            Inactif: {formatTime(session.inactiveTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Analyse de conformité aux horaires */}
                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs text-blue-800">
                    <strong>Analyse horaires (8h-17h):</strong>
                    {user.totalActiveTime >= 480 ? (
                      <span className="text-green-600 ml-2">✓ Objectif atteint</span>
                    ) : (
                      <span className="text-red-600 ml-2">
                        ⚠ Manque {formatTime(480 - user.totalActiveTime)} pour 8h
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
