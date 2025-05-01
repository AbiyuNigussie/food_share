import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
};
