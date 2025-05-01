import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow w-full text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-gray-500">{label}</p>
  </div>
);
