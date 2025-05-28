import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { PerformanceStats } from '@/components/performance/PerformanceStats';
import { PerformanceChart } from '@/components/performance/PerformanceChart';
import { DailyActivityReport } from '@/components/performance/DailyActivityReport';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Performance = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDailyDate, setSelectedDailyDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { stats, sessionsByUser, sessions, isLoading } = usePerformanceData(dateFrom, dateTo);

  const exportToCSV = () => {
    if (!sessions) return;

    const csvData = sessions.map(session => ({
      'Utilisateur': session.profiles?.full_name || session.profiles?.email,
      'Date de connexion': format(new Date(session.login_time), 'dd/MM/yyyy HH:mm'),
      'Date de déconnexion': session.logout_time ? format(new Date(session.logout_time), 'dd/MM/yyyy HH:mm') : 'En cours',
      'Statut': session.status,
      'Appareil': session.device,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `performance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Chargement des données de performance...</div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Performance & Activité</h1>
          <p className="text-muted-foreground">
            Suivi du temps de travail et de l'activité des collaborateurs
          </p>
        </div>

        {/* Rapport quotidien */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="dailyDate">Rapport d'activité quotidien :</Label>
            <Input
              id="dailyDate"
              type="date"
              value={selectedDailyDate}
              onChange={(e) => setSelectedDailyDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <DailyActivityReport 
            sessionsByUser={sessionsByUser} 
            selectedDate={selectedDailyDate}
          />
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres période</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date de début</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Date de fin</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="flex-1"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={exportToCSV}
                    className="flex items-center space-x-2"
                    disabled={!sessions?.length}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques globales */}
        <PerformanceStats stats={stats} />

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart data={sessionsByUser} type="bar" />
          <PerformanceChart data={sessionsByUser} type="pie" />
        </div>

        {/* Tableau détaillé des sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Utilisateur</th>
                    <th className="text-left p-2">Connexion</th>
                    <th className="text-left p-2">Déconnexion</th>
                    <th className="text-left p-2">Temps actif</th>
                    <th className="text-left p-2">Temps inactif</th>
                    <th className="text-left p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsByUser.map(user => 
                    user.sessions.map((session: any) => (
                      <tr key={session.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">
                          {format(new Date(session.login_time), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="p-2">
                          {session.logout_time 
                            ? format(new Date(session.logout_time), 'dd/MM/yyyy HH:mm')
                            : 'En cours'
                          }
                        </td>
                        <td className="p-2 text-green-600 font-medium">
                          {Math.floor(session.activeTime / 60)}h {Math.round(session.activeTime % 60)}m
                        </td>
                        <td className="p-2 text-red-600">
                          {Math.floor(session.inactiveTime / 60)}h {Math.round(session.inactiveTime % 60)}m
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : session.status === 'logged_out'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {session.status === 'active' ? 'Actif' : 
                             session.status === 'logged_out' ? 'Déconnecté' : 'Expiré'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
};

export default Performance;
