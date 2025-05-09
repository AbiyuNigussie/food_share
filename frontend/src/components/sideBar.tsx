import React from "react";
import { MenuIcon, ChevronLeftIcon, UserIcon, TruckIcon } from "lucide-react";
import clsx from "clsx";

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface SidebarProps {
  open: boolean;
  toggle: () => void;
  navItems: NavItem[];
  title?: string;
  logoIcon?: React.ReactNode;
  userInfo?: {
    name: string;
    email: string;
  };
}

export const SideBar: React.FC<SidebarProps> = ({
  open,
  toggle,
  navItems,
  title = "Dashboard",
  logoIcon = <TruckIcon className="w-6 h-6 text-purple-600" />,
  userInfo,
}) => (
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

    {/* Logo */}
    <div
      className={clsx(
        "flex items-center px-4 mb-10 pt-12",
        open ? "justify-start" : "justify-center"
      )}
    >
      {open ? (
        <span className="text-purple-600 font-bold text-xl whitespace-nowrap">
          {title}
        </span>
      ) : (
        logoIcon
      )}
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

    {/* Footer */}
    <div className="px-4 py-4 border-t border-gray-200">
      {open ? (
        userInfo ? (
          <>
            <p className="text-sm font-medium text-gray-600">{userInfo.name}</p>
            <p className="text-xs text-gray-500">{userInfo.email}</p>
          </>
        ) : null
      ) : (
        <UserIcon className="w-6 h-6 text-gray-500 mx-auto" />
      )}
    </div>
  </aside>
);
