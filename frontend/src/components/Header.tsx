import React from "react";
import { BellIcon } from "lucide-react";

export interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    <button className="relative p-2 rounded-full hover:bg-gray-200">
      <BellIcon className="w-6 h-6 text-gray-700" />
      <span className="absolute top-0 right-0 block w-2 h-2 bg-purple-600 rounded-full" />
    </button>
  </div>
);
