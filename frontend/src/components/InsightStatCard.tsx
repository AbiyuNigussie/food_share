import React from 'react';

interface InsightStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const InsightStatCard: React.FC<InsightStatCardProps> = ({ label, value, icon }) => (
  <div className="relative bg-white rounded-2xl shadow hover:shadow-lg p-6 flex items-center space-x-4">
    {icon && <div className="text-2xl text-purple-600">{icon}</div>}
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
    <div className="absolute top-0 right-0 w-12 h-12 bg-purple-100 rounded-full -translate-x-2 translate-y-2" />
  </div>
);
