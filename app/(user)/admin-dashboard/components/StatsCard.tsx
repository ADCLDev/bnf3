import { FC } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: FC<StatsCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      </div>
    </div>
  );
}; 