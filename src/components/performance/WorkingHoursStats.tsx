
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, CalendarDays, TrendingUp, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WorkingHoursStatsProps {
  workingHours: {
    dailyHours: number;
    weeklyHours: number;
    monthlyHours: number;
    expectedDailyHours: number;
    lunchBreakMinutes: number;
  };
}

export const WorkingHoursStats: React.FC<WorkingHoursStatsProps> = ({ workingHours }) => {
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const expectedWeeklyHours = workingHours.expectedDailyHours * 5; // 5 jours ouvrables
  const expectedMonthlyHours = workingHours.expectedDailyHours * 22; // ~22 jours ouvrables par mois

  const dailyProgress = (workingHours.dailyHours / workingHours.expectedDailyHours) * 100;
  const weeklyProgress = (workingHours.weeklyHours / expectedWeeklyHours) * 100;
  const monthlyProgress = (workingHours.monthlyHours / expectedMonthlyHours) * 100;

  // Calcul du salaire estimé (exemple: 15€/heure)
  const hourlyRate = 15;
  const estimatedDailySalary = workingHours.dailyHours * hourlyRate;
  const estimatedWeeklySalary = workingHours.weeklyHours * hourlyRate;
  const estimatedMonthlySalary = workingHours.monthlyHours * hourlyRate;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Heures quotidiennes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures travaillées aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatHours(workingHours.dailyHours)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Objectif: {formatHours(workingHours.expectedDailyHours)}
            </div>
            <Progress value={Math.min(dailyProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {dailyProgress.toFixed(1)}% de l'objectif
            </div>
          </CardContent>
        </Card>

        {/* Heures hebdomadaires */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures cette semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatHours(workingHours.weeklyHours)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Objectif: {formatHours(expectedWeeklyHours)}
            </div>
            <Progress value={Math.min(weeklyProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {weeklyProgress.toFixed(1)}% de l'objectif
            </div>
          </CardContent>
        </Card>

        {/* Heures mensuelles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures ce mois</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatHours(workingHours.monthlyHours)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Objectif: {formatHours(expectedMonthlyHours)}
            </div>
            <Progress value={Math.min(monthlyProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {monthlyProgress.toFixed(1)}% de l'objectif
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calcul du salaire estimé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Estimation des salaires (basé sur 15€/heure)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {estimatedDailySalary.toFixed(2)}€
              </div>
              <div className="text-sm text-muted-foreground">Salaire quotidien</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {estimatedWeeklySalary.toFixed(2)}€
              </div>
              <div className="text-sm text-muted-foreground">Salaire hebdomadaire</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {estimatedMonthlySalary.toFixed(2)}€
              </div>
              <div className="text-sm text-muted-foreground">Salaire mensuel</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les horaires de travail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Paramètres horaires</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Début de journée</div>
              <div className="text-muted-foreground">8h00</div>
            </div>
            <div>
              <div className="font-medium">Fin de journée</div>
              <div className="text-muted-foreground">17h00</div>
            </div>
            <div>
              <div className="font-medium">Pause déjeuner</div>
              <div className="text-muted-foreground">{workingHours.lunchBreakMinutes} min</div>
            </div>
            <div>
              <div className="font-medium">Heures quotidiennes</div>
              <div className="text-muted-foreground">{workingHours.expectedDailyHours}h</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
