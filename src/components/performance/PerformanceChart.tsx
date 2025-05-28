
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceChartProps {
  data: Array<{
    name: string;
    totalActiveTime: number;
    totalInactiveTime: number;
  }>;
  type?: 'bar' | 'pie';
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, type = 'bar' }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (type === 'pie') {
    const pieData = data.map((item, index) => ({
      name: item.name,
      value: item.totalActiveTime,
      color: COLORS[index % COLORS.length],
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition du temps actif par utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatTime(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temps d'activité par utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatTime} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatTime(value), 
                name === 'totalActiveTime' ? 'Temps actif' : 'Temps inactif'
              ]} 
            />
            <Bar dataKey="totalActiveTime" fill="#3b82f6" name="Temps actif" />
            <Bar dataKey="totalInactiveTime" fill="#ef4444" name="Temps inactif" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
