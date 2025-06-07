// src/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 overflow-hidden">
      {/* Decorative purple circle */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="relative flex flex-col">
        <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
          {label}
        </span>
        <span className="mt-3 text-4xl font-extrabold text-purple-800">
          {value}
        </span>
      </div>
    </div>
  );
};
