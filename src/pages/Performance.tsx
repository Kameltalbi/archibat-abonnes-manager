
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ActivityStats } from '@/components/performance/ActivityStats';
import { ActivityTable } from '@/components/performance/ActivityTable';
import { ActivityFilters } from '@/components/performance/ActivityFilters';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
              <div className="text-2xl font-bold">6h 45min</div>
              <p className="text-xs text-muted-foreground">
                +1h 15min par rapport à hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions actives</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
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
              <div className="text-2xl font-bold text-green-600">96%</div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">0</div>
              <p className="text-xs text-muted-foreground">
                Jours sous 6h ce mois
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
