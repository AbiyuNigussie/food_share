import React from "react";
import { Bell } from "lucide-react";

export interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="flex items-center justify-between p-4">
    <h1 className="text-xl font-bold">{title}</h1>
    <button className="p-2 rounded-full hover:bg-gray-100">
      <Bell className="w-6 h-6 text-gray-600" />
    </button>
  </header>
);
