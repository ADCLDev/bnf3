import { FC } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}; 