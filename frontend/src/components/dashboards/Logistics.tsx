import React, { useState } from "react";
import clsx from "clsx";
import {
  HomeIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  BarChart2Icon,
  SettingsIcon,
} from "lucide-react";

import { SideBar, NavItem } from "../SideBar";
import { StatCard } from "../StatCard";
import { Header } from "../Header";
import { useAuth } from "../../contexts/AuthContext";

interface Delivery {
  status: "Pending" | "In Progress" | "Completed";
  time: string;
  distance: string;
  pickup: { name: string; address: string };
  dropoff: { name: string; address: string };
  badge?: { text: string; color: string };
  actions: { label: string; variant: "primary" | "outline" }[];
}

const stats = [
  { label: "Total Deliveries Today", value: 45 },
  { label: "Average Delivery Time (min)", value: 28 },
  { label: "Total Distance (mi)", value: 142 },
];

const deliveries: Delivery[] = [
  {
    status: "Pending",
    time: "10:00 AM",
    distance: "3.2 mi",
    pickup: { name: "Local Farm Co", address: "123 Farm Rd" },
    dropoff: { name: "Food Bank West", address: "456 Bank St" },
    actions: [
      { label: "Start Delivery", variant: "primary" },
      { label: "View Details", variant: "outline" },
    ],
  },
  {
    status: "In Progress",
    time: "11:30 AM",
    distance: "2.8 mi",
    pickup: { name: "City Bakery", address: "789 Baker St" },
    dropoff: { name: "Shelter North", address: "321 Shelter Ave" },
    badge: { text: "ETA: 15 min", color: "bg-yellow-100 text-yellow-800" },
    actions: [
      { label: "Complete Delivery", variant: "primary" },
      { label: "View Details", variant: "outline" },
    ],
  },
  {
    status: "Completed",
    time: "09:00 AM",
    distance: "4.1 mi",
    pickup: { name: "Fresh Dairy Inc", address: "654 Dairy Ln" },
    dropoff: { name: "Community Center", address: "987 Center Blvd" },
    actions: [{ label: "View Details", variant: "outline" }],
  },
];

const statusColors: Record<Delivery["status"], string> = {
  Pending: "bg-gray-400",
  "In Progress": "bg-yellow-400",
  Completed: "bg-purple-600",
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  {
    label: "Deliveries",
    icon: <TruckIcon className="w-5 h-5" />,
    href: "deliveries",
  },
  { label: "Routes", icon: <MapPinIcon className="w-5 h-5" />, href: "#" },
  { label: "Drivers", icon: <UserIcon className="w-5 h-5" />, href: "#" },
  { label: "Reports", icon: <BarChart2Icon className="w-5 h-5" />, href: "#" },
  { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, href: "#" },
];

export const Logistics: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const Button: React.FC<{
    variant: "primary" | "outline";
    children: React.ReactNode;
  }> = ({ variant, children }) => {
    const base = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
    const styles =
      variant === "primary"
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "border border-gray-300 text-gray-700 hover:bg-gray-50";
    return <button className={`${base} ${styles}`}>{children}</button>;
  };
  const { user } = useAuth();

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="LogistiX"
        logoIcon={<TruckIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{ name: "Logistix User", email: user?.email || "" }}
      />
      <main
        className={clsx(
          "p-8 bg-gray-50 min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Logistics Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
          <div className="space-y-6">
            {deliveries.map((d, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusColors[d.status]
                      }`}
                    />
                    <span className="text-gray-700 font-medium">
                      {d.status}
                    </span>
                  </div>
                  {d.badge && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${d.badge.color}`}
                    >
                      {d.badge.text}
                    </span>
                  )}
                </div>

                <div className="text-gray-500 text-sm mb-4">
                  {d.time} • {d.distance}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Pickup</p>
                    <p className="font-medium text-gray-900">{d.pickup.name}</p>
                    <p className="text-gray-500 text-sm">{d.pickup.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Dropoff</p>
                    <p className="font-medium text-gray-900">
                      {d.dropoff.name}
                    </p>
                    <p className="text-gray-500 text-sm">{d.dropoff.address}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {d.actions.map((action, aidx) => (
                    <Button key={aidx} variant={action.variant}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};
