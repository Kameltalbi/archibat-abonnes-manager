
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubscriptionsData {
  month: string;
  locaux: number;
  internationaux: number;
  institutions: number;
}

interface SubscriptionsChartProps {
  data: SubscriptionsData[];
}

export function SubscriptionsChart({ data }: SubscriptionsChartProps) {
  return (
    <div className="archibat-card h-[400px]">
      <h3 className="text-lg font-medium mb-4">Évolution des abonnements</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLocaux" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0057FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0057FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInternat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7F00FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7F00FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInst" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF4E8E" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF4E8E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="locaux" 
            name="Abonnés locaux"
            stroke="#0057FF" 
            fillOpacity={1} 
            fill="url(#colorLocaux)" 
          />
          <Area 
            type="monotone" 
            dataKey="internationaux" 
            name="Abonnés internationaux"
            stroke="#7F00FF" 
            fillOpacity={1} 
            fill="url(#colorInternat)" 
          />
          <Area 
            type="monotone" 
            dataKey="institutions" 
            name="Institutions"
            stroke="#FF4E8E" 
            fillOpacity={1} 
            fill="url(#colorInst)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
