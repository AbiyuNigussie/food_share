import React, { useEffect, useState } from "react";
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

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

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
      label: "Recipient Approvals",
      icon: <ClipboardListIcon className="w-5 h-5" />,
      href: "/admin/recipients/approvals",
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
    { label: "Total Users", value: 324 },
    { label: "Active Users", value: 256 },
    { label: "Total Donations", value: 1458 },
    { label: "Success Rate", value: "92%" },
  ];

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    const normalized = status.toLowerCase();
    if (normalized === "active")
      return (
        <span className={`${base} bg-purple-100 text-purple-700`}>Active</span>
      );
    if (normalized === "suspended")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Suspended</span>
      );
    return <span className={`${base} bg-gray-200 text-gray-600`}>Pending</span>;
  };

  return (
    <div className="min-h-screen">
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Admin Panel"
        navItems={navItems}
        userInfo={{ name: "Admin User", email: "admin@logistix.com" }}
      />

      <div
        className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header title="Admin Dashboard" />

        <main className="p-8 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} />
            ))}
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              User Management
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-white sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["Name", "Email", "Role", "Status", "Actions"].map(
                      (hdr) => (
                        <th
                          key={hdr}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {hdr}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr
                      key={u.email}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-purple-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-gray-700">{u.name}</td>
                      <td className="px-6 py-4 text-gray-700">{u.email}</td>
                      <td className="px-6 py-4 text-gray-700">{u.role}</td>
                      <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <button className="p-2 rounded hover:bg-gray-100">
                          <SettingsIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Feedback
            </h2>
            {[
              {
                from: "jane@foo.com",
                message: "Pickup was delayed by 2 hours.",
              },
              {
                from: "shelter@bar.org",
                message: "Donation quality was excellent!",
              },
              { from: "bob@foo.com", message: "App crashed on feedback form." },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-4 hover:shadow-xl transition-shadow"
              >
                <p className="text-gray-800">{f.message}</p>
                <p className="mt-2 text-sm text-gray-500">— {f.from}</p>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Detailed Reports
            </h2>
            <p className="text-gray-600 mb-4">
              View full analytics on donations, users, and impact metrics.
            </p>
            <a
              href="/admin/reports"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Go to Reports
            </a>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
