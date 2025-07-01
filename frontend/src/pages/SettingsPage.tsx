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
  let title = "Portal"
  if (user) {
    switch (user.role) {
      case "DONOR":
        title = "DonorX";
        navItems = [
          { label: "Dashboard",    icon: <HomeIcon className="w-5 h-5" />,           href: "/dashboard" },
          { label: "My Donations", icon: <GiftIcon className="w-5 h-5" />,          href: "/dashboard/Donor-Donations" },
          { label: "Insights",     icon: <BarChart2Icon className="w-5 h-5" />,     href: "/dashboard/donor-insights" },
          { label: "Settings",     icon: <SettingsIcon className="w-5 h-5" />,       href: "/dashboard/settings" },
        ];
        break;
      case "RECIPIENT":
        title = "Recipient Portal";
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,              href: "/dashboard" },
          { label: "Donations", icon: <PackageIcon className="w-5 h-5" />,           href: "/dashboard/my-donations" },
          { label: "Insights",  icon: <BarChart2Icon className="w-5 h-5" />,         href: "/dashboard/recipient-insights" },
          { label: "My Needs",  icon: <ClipboardListIcon className="w-5 h-5" />,     href: "/dashboard/Recipient-Needs" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,           href: "/dashboard/settings" },
        ];
        break;
      case "LOGISTIC_PROVIDER":
        title = "Logistic  Portal";
        navItems = [
          { label: "Dashboard",  icon: <HomeIcon className="w-5 h-5" />,             href: "/dashboard" },
          { label: "Deliveries", icon: <TruckIcon className="w-5 h-5" />,            href: "/dashboard/deliveries" },
          { label: "Settings",   icon: <SettingsIcon className="w-5 h-5" />,         href: "/dashboard/settings" },
        ];
        break;
      case "ADMIN":
        title = "Admin Portal";
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,              href: "/dashboard" },
          { label: "Users",     icon: <UserIcon className="w-5 h-5" />,              href: "/dashboard/users" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,          href: "/dashboard/settings" },
        ];
        break;
      default:
        navItems = [
          { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />,              href: "/dashboard" },
          { label: "Settings",  icon: <SettingsIcon className="w-5 h-5" />,          href: "/dashboard/settings" },
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
        email: user?.email || "",  // if email editable add state for it
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
        toggle={() => setSidebarOpen((o) => !o)}
        title={title}
        navItems={navItems}
        userInfo={{
          name:  `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={clsx(
          "min-h-screen bg-gradient-to-br from-purple-200 via-white to-indigo-100  border border-purple-200 transition-all duration-200",
          sidebarOpen ? "ml-64 p-8" : "ml-16 p-4"
        )}
      >
        <Header title="Settings" />

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-6">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={clsx(
                  "flex items-center px-4 py-2 space-x-2 -mb-px font-medium",
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
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="sm:col-span-2 text-right">
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
            <section className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
              <form
                onSubmit={handlePasswordSubmit}
                className="grid gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
