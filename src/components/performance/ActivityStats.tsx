
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAymenPerformanceData } from '@/hooks/useAymenPerformanceData';

interface ActivityStatsProps {
  selectedPeriod: string;
  selectedDate: Date;
}

const ActivityStats: React.FC<ActivityStatsProps> = React.memo(({ 
  selectedPeriod, 
  selectedDate 
}) => {
  const { data: performanceData, isLoading } = useAymenPerformanceData(selectedPeriod, selectedDate);

  const getStatusColor = React.useCallback((status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getStatusText = React.useCallback((status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bon';
      case 'warning': return 'Attention';
      case 'poor': return 'Insuffisant';
      default: return 'En attente';
    }
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData?.aymenUserId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Utilisateur Aymen Boubakri non trouvé dans la base de données
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Temps de travail quotidien - Aymen Boubakri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceData?.dailyStats?.map((day, index) => {
            const percentage = Math.min((day.total_active_minutes / day.expected_work_minutes) * 100, 100);
            const hours = Math.floor(day.total_active_minutes / 60);
            const minutes = day.total_active_minutes % 60;
            
            return (
              <div key={day.id || index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{hours}h {minutes}min</span>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(day.performance_status)} text-white`}
                    >
                      {getStatusText(day.performance_status)}
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          {(!performanceData?.dailyStats || performanceData.dailyStats.length === 0) && (
            <div className="text-center text-muted-foreground py-4">
              Aucune donnée d'activité trouvée pour Aymen Boubakri sur cette période
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques de la période</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Temps total travaillé :</span>
              <span className="font-bold">
                {Math.floor((performanceData?.totalActiveMinutes || 0) / 60)}h{' '}
                {(performanceData?.totalActiveMinutes || 0) % 60}min
              </span>
            </div>
            <div className="flex justify-between">
              <span>Temps attendu :</span>
              <span className="font-bold">
                {Math.floor((performanceData?.expectedMinutes || 0) / 60)}h{' '}
                {(performanceData?.expectedMinutes || 0) % 60}min
              </span>
            </div>
            <div className="flex justify-between">
              <span>Performance globale :</span>
              <span className="font-bold text-green-600">
                {performanceData?.overallPerformance || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Jours avec alertes :</span>
              <span className="font-bold text-red-600">
                {performanceData?.alertDays || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ActivityStats.displayName = 'ActivityStats';

export { ActivityStats };
