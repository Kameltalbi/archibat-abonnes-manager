
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useAymenPerformanceData } from '@/hooks/useAymenPerformanceData';

interface ActivityTableProps {
  selectedPeriod: string;
  selectedDate: Date;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ 
  selectedPeriod, 
  selectedDate 
}) => {
  const { data: performanceData, isLoading } = useAymenPerformanceData(selectedPeriod, selectedDate);

  const getStatusBadge = (status: string) => {
    const config = {
      excellent: { label: 'Excellent', variant: 'default' as const, className: 'bg-green-500 text-white' },
      good: { label: 'Bon', variant: 'secondary' as const, className: 'bg-blue-500 text-white' },
      warning: { label: 'Attention', variant: 'outline' as const, className: 'bg-yellow-500 text-white' },
      poor: { label: 'Insuffisant', variant: 'destructive' as const, className: 'bg-red-500 text-white' },
      pending: { label: 'En attente', variant: 'outline' as const, className: 'bg-gray-500 text-white' }
    };
    
    const { label, variant, className } = config[status as keyof typeof config] || config.pending;
    return <Badge variant={variant} className={className}>{label}</Badge>;
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const calculateGap = (activeMinutes: number, expectedMinutes: number) => {
    const gap = activeMinutes - expectedMinutes;
    const hours = Math.floor(Math.abs(gap) / 60);
    const mins = Math.abs(gap) % 60;
    const sign = gap >= 0 ? '+' : '-';
    return `${sign}${hours}h ${mins}min`;
  };

  const exportToPDF = () => {
    // TODO: Implémenter l'export PDF
    console.log('Export PDF non implémenté');
  };

  const exportToExcel = () => {
    // TODO: Implémenter l'export Excel
    console.log('Export Excel non implémenté');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData?.aymenUserId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Détail de l'activité - Aymen Boubakri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Utilisateur Aymen Boubakri non trouvé dans la base de données
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Détail de l'activité - Aymen Boubakri</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Première connexion</TableHead>
              <TableHead>Dernière activité</TableHead>
              <TableHead>Temps actif</TableHead>
              <TableHead>Écart</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData?.dailyStats?.map((day, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {new Date(day.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{formatTime(day.first_login_time)}</TableCell>
                <TableCell>{formatTime(day.last_activity_time)}</TableCell>
                <TableCell className="font-medium">
                  {formatDuration(day.total_active_minutes)}
                </TableCell>
                <TableCell className={
                  day.total_active_minutes >= day.expected_work_minutes 
                    ? 'text-green-600 font-medium' 
                    : 'text-red-600 font-medium'
                }>
                  {calculateGap(day.total_active_minutes, day.expected_work_minutes)}
                </TableCell>
                <TableCell>{day.total_sessions}</TableCell>
                <TableCell>
                  {getStatusBadge(day.performance_status)}
                </TableCell>
              </TableRow>
            ))}
            {(!performanceData?.dailyStats || performanceData.dailyStats.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucune donnée d'activité trouvée pour Aymen Boubakri sur cette période
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
