// components/reuseable/ContributorStats
import React from 'react';
import { Users, Download, FileType, LucideIcon, User } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex flex-col items-center">
      <Icon className="w-6 h-6 text-red-500 mb-3" />
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  </div>
);

const ContributorStats: React.FC = () => {
  const stats: StatsCardProps[] = [
    { icon: Users, value: "50+", label: 'Active Contributors' },
    { icon: FileType, value: "500+", label: 'Fonts Created' },
    { icon: Download, value: "1M+", label: 'Total Downloads' },
    { icon: User, value: "2M+", label: 'Font Users' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ContributorStats;