// src/pages/SettingsPage.tsx
import React, { useState, useEffect, FormEvent } from "react";
import clsx from "clsx";
import { SideBar, NavItem } from "../components/SideBar";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

// icons
import {
  HomeIcon,
  GiftIcon,
  BarChart2Icon,
  UserIcon,
  SettingsIcon,
  ClipboardListIcon,
  PackageIcon,
  TruckIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";

// Tabs definition
const tabs = [
  { key: "profile",  label: "Profile",  icon: <UserIcon /> },
  { key: "security", label: "Security", icon: <LockIcon /> },
];

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const token = user?.token || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile fields
  const [firstName,       setFirstName]       = useState(user?.firstName   || "");
  const [lastName,        setLastName]        = useState(user?.lastName    || "");
  const [phone,           setPhone]           = useState(user?.phoneNumber || "");
  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // keep form in sync if context changes
  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phoneNumber || "");
  }, [user]);

  // pick nav items by role
  let navItems: NavItem[] = [];
  let title = "Portal";
  if (user) {
    switch (user.role) {
      case "DONOR":
        title = "DonorX";
        navItems = [
          { label: "Dashboard",    icon: <HomeIcon className="w-5 h-5" />,       href: "/dashboard" },
          { label: "My Donations", icon: <GiftIcon className="w-5 h-5" />,      href: "/dashboard/Donor-Donations" },
          { label: "Insights",     icon: <BarChart2Icon className="w-5 h-5" />, href: "/dashboard/donor-insights" },
          { label: "Settings",     icon: <SettingsIcon className="w-5 h-5" />,   href: "/dashboard/settings" },
        ];
        break;
      case "RECIPIENT":
        title = "Recipient Portal";
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,              href: "/dashboard" },
          { label: "My Claims", icon: <PackageIcon className="w-5 h-5" />,           href: "/dashboard/my-donations" },
          { label: "Insights",  icon: <BarChart2Icon className="w-5 h-5" />,         href: "/dashboard/recipient-insights" },
          { label: "My Needs",  icon: <ClipboardListIcon className="w-5 h-5" />,     href: "/dashboard/Recipient-Needs" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,           href: "/dashboard/settings" },
        ];
        break;
      case "LOGISTIC_PROVIDER":
        title = "Logistic Portal";
        navItems = [
          { label: "Dashboard",    icon: <HomeIcon className="w-5 h-5" />,       href: "/dashboard" },
          { label: "Deliveries",   icon: <TruckIcon className="w-5 h-5" />,      href: "/dashboard/deliveries" },
          { label: "My Deliveries",icon: <BarChart2Icon className="w-5 h-5" />, href: "/dashboard/my-deliveries" },
          { label: "Settings",     icon: <SettingsIcon className="w-5 h-5" />,   href: "/dashboard/settings" },
        ];
        break;
      case "ADMIN":
        title = "Admin Portal";
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,        href: "/dashboard" },
          { label: "Recipient Approvals", icon: <ClipboardListIcon className="w-5 h-5" />, href: "/admin/recipients/approvals" },
          { label: "Reports",   icon: <ClipboardListIcon className="w-5 h-5" />, href: "/admin/reports" },
          { label: "Contacts",  icon: <MailIcon className="w-5 h-5" />,         href: "/admin/contacts" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,     href: "/admin/settings" },
        ];
        break;
      default:
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,      href: "/dashboard" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,  href: "/dashboard/settings" },
        ];
    }
  }

  // submit handlers
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(token, {
        firstName,
        lastName,
        email: user?.email || "",
        phoneNumber: phone,
      });
      toast.success("Profile updated");
      setUser!({ ...user!, firstName, lastName, phoneNumber: phone });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await authService.changePassword(token, currentPassword, newPassword);
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen(o => !o)}
        title={title}
        navItems={navItems}
        userInfo={{
          name:  `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={clsx(
          "min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64 p-8" : "ml-16 p-4",
          "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        )}
      >
        <Header title="SETTINGS" />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Profile Card */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-8 flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </div>
              <div className="text-white">
                {/* NEW: full name above email */}
                <h1 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <h2 className="text-xl font-semibold">{user?.email}</h2>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b pb-2">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={clsx(
                  "flex items-center space-x-2 pb-1 font-medium",
                  activeTab === key
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                )}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Profile Panel */}
          {activeTab === "profile" && (
            <section className="bg-white rounded-2xl shadow p-8">
              <form
                onSubmit={handleProfileSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2 text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Security Panel */}
          {activeTab === "security" && (
            <section className="bg-white rounded-2xl shadow p-8 mx-auto max-w-md">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </>
  );
};
