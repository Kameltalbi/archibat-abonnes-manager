
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className }: StatCardProps) {
  return (
    <div className={cn("archibat-stat", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-3xl font-bold mt-1">{value}</h4>
        </div>
        {icon && <div className="text-archibat-blue">{icon}</div>}
      </div>

      {change && (
        <div className="mt-2 flex items-center text-sm">
          <span 
            className={
              change.positive ? "text-green-500" : "text-red-500"
            }
          >
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
          <span className="text-muted-foreground ml-1">depuis le mois dernier</span>
        </div>
      )}
    </div>
  );
}
