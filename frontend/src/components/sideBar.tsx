import React from "react";
import {
  HomeIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  BarChart2Icon,
  SettingsIcon,
  MenuIcon,
  ChevronLeftIcon,
} from "lucide-react";
import clsx from "clsx";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  { label: "Deliveries", icon: <TruckIcon className="w-5 h-5" />, href: "#" },
  { label: "Routes", icon: <MapPinIcon className="w-5 h-5" />, href: "#" },
  { label: "Drivers", icon: <UserIcon className="w-5 h-5" />, href: "#" },
  { label: "Reports", icon: <BarChart2Icon className="w-5 h-5" />, href: "#" },
  { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, href: "#" },
];

interface SidebarProps {
  open: boolean;
  toggle: () => void;
}

export const SideBar: React.FC<SidebarProps> = ({ open, toggle }) => (
  <aside
    className={clsx(
      "fixed inset-y-0 left-0",
      "bg-white shadow-md h-screen flex flex-col transition-all duration-200",
      open ? "w-64" : "w-16"
    )}
  >
    {/* Toggle Button */}
    <button
      onClick={toggle}
      className="absolute top-4 right-4 p-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none"
    >
      {open ? (
        <ChevronLeftIcon className="w-4 h-4" />
      ) : (
        <MenuIcon className="w-4 h-4" />
      )}
    </button>

    <div className="flex-1 pt-12 flex flex-col">
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center px-4 mb-10",
          open ? "justify-start" : "justify-center"
        )}
      >
        <span
          className={clsx(
            "text-purple-600 font-bold text-xl whitespace-nowrap",
            open ? "" : "sr-only"
          )}
        >
          LogistiX
        </span>
        {!open && <TruckIcon className="w-6 h-6 text-purple-600" />}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
            title={!open ? item.label : undefined}
          >
            <div className="text-gray-700 group-hover:text-purple-600">
              {item.icon}
            </div>
            {open && (
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-purple-600">
                {item.label}
              </span>
            )}
          </a>
        ))}
      </nav>
    </div>

    {/* Footer */}
    <div className="px-4 py-4 border-t border-gray-200">
      {open ? (
        <>
          <p className="text-sm font-medium text-gray-600">Admin User</p>
          <p className="text-xs text-gray-500">admin@logistix.com</p>
        </>
      ) : (
        <UserIcon className="w-6 h-6 text-gray-500 mx-auto" />
      )}
    </div>
  </aside>
);
