// src/pages/AdminDashboard.tsx
import React, { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  BellIcon,
  SettingsIcon,
} from "lucide-react";
import { SideBar } from "../SideBar";
import { StatCard } from "../StatCard";
import { Header } from "../Header";

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: <UsersIcon className="w-5 h-5" />,
      href: "/admin/users",
    },
    {
      label: "Feedback",
      icon: <BellIcon className="w-5 h-5" />,
      href: "/admin/feedback",
    },
    {
      label: "Reports",
      icon: <ClipboardListIcon className="w-5 h-5" />,
      href: "/admin/reports",
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "/admin/config",
    },
  ];

  const stats = [
    { label: "Total Users", value: 3421 },
    { label: "Donations Created", value: 874 },
    { label: "Pending Feedback", value: 27 },
    { label: "Total Impact (lbs)", value: 13250 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Admin Panel"
        navItems={navItems}
        userInfo={{ name: "Admin User", email: "admin@logistix.com" }}
      />

      <div
        className={`flex-1 p-8 transition-all duration-200 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <Header title="Admin Dashboard" />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* User Management Preview */}
          <section>
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Recent Users
            </h2>
            <div className="bg-white border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Jane Doe",
                      email: "jane@foo.com",
                      role: "Donor",
                      status: "Active",
                    },
                    {
                      name: "Acme Shelter",
                      email: "shelter@bar.org",
                      role: "Recipient",
                      status: "Active",
                    },
                    {
                      name: "Bob Smith",
                      email: "bob@foo.com",
                      role: "Donor",
                      status: "Suspended",
                    },
                  ].map((u, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Feedback Preview */}
          <section>
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Recent Feedback
            </h2>
            <div className="space-y-4">
              {[
                {
                  from: "jane@foo.com",
                  message: "Pickup was delayed by 2 hours.",
                },
                {
                  from: "shelter@bar.org",
                  message: "Donation quality was excellent!",
                },
                {
                  from: "bob@foo.com",
                  message: "App crashed on feedback form.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded p-4"
                >
                  <p className="text-sm text-gray-800">{f.message}</p>
                  <p className="mt-2 text-xs text-gray-500">— {f.from}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Reports CTA */}
          <section className="bg-white border border-gray-200 rounded p-6 text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Detailed Reports
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              View full analytics on donations, users, and impact metrics.
            </p>
            <a
              href="/admin/reports"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Go to Reports
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
