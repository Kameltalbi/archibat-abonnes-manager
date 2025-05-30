
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ActivityStats } from '@/components/performance/ActivityStats';
import { ActivityTable } from '@/components/performance/ActivityTable';
import { ActivityFilters } from '@/components/performance/ActivityFilters';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAymenPerformanceData } from '@/hooks/useAymenPerformanceData';

const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: performanceData, isLoading } = useAymenPerformanceData(selectedPeriod, selectedDate);

  // Calculer les statistiques pour aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todayData = performanceData?.dailyStats?.find(day => day.date === today);
  const todayActiveMinutes = todayData?.total_active_minutes || 0;
  const todayHours = Math.floor(todayActiveMinutes / 60);
  const todayMinutes = todayActiveMinutes % 60;
  const todaySessions = todayData?.total_sessions || 0;

  // Calculer la performance de la période
  const overallPerformance = performanceData?.overallPerformance || 0;
  const alertDays = performanceData?.alertDays || 0;

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="space-y-6">
          <PageHeader 
            title="Suivi de l'activité de Aymen" 
            description="Surveillance du temps de travail et de la présence quotidienne"
          />
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="space-y-6">
        <PageHeader 
          title="Suivi de l'activité de Aymen" 
          description="Surveillance du temps de travail et de la présence quotidienne"
        />
        
        <ActivityFilters 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps aujourd'hui</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayHours}h {todayMinutes}min
              </div>
              <p className="text-xs text-muted-foreground">
                {todayData ? `${todaySessions} session${todaySessions > 1 ? 's' : ''}` : 'Aucune activité'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions actives</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySessions}</div>
              <p className="text-xs text-muted-foreground">
                Connexions aujourd'hui
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${overallPerformance >= 85 ? 'text-green-600' : overallPerformance >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {overallPerformance}%
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPeriod === 'day' ? 'Aujourd\'hui' : 
                 selectedPeriod === 'week' ? 'Cette semaine' : 'Ce mois'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${alertDays > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {alertDays}
              </div>
              <p className="text-xs text-muted-foreground">
                Jours avec performances faibles
              </p>
            </CardContent>
          </Card>
        </div>

        <ActivityStats 
          selectedPeriod={selectedPeriod}
          selectedDate={selectedDate}
        />

        <ActivityTable 
          selectedPeriod={selectedPeriod}
          selectedDate={selectedDate}
        />
      </div>
    </AdminRoute>
  );
};

export default Performance;
