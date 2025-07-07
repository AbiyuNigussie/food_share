import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  SettingsIcon,
  XIcon,
  EditIcon,
  SaveIcon,
  MailIcon,
  BellIcon,
} from "lucide-react";
import { SideBar } from "../SideBar";
import { StatCard } from "../StatCard";
import { Header } from "../Header";
import { toast } from "react-toastify";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

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
      label: "Contacts",
      icon: <MailIcon className="w-5 h-5" />,
      href: "/admin/contacts",
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "/admin/settings",
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

  const openUserSettings = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsModalOpen(true);
    setEditMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!selectedUser) return;

    try {
      // Show loading toast
      const toastId = toast.loading("Updating user...");

      const response = await axios.put(
        `/api/admin/users/${selectedUser.id}`,
        editedUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with the returned user data
      setUsers(
        users.map((u) => (u.id === response.data.id ? response.data : u))
      );
      setEditMode(false);

      // Update toast to success
      toast.update(toastId, {
        render: "User updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (error: any) {
      console.error("Failed to update user:", error);

      // Show error toast
      toast.error(
        error.response?.data?.message ||
          "Failed to update user. Please try again.",
        {
          autoClose: 5000,
        }
      );
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const toastId = toast.loading("Deleting user...");

      await axios.delete(`/api/admin/users/${userId}`);

      setUsers(users.filter((user) => user.id !== userId));

      toast.update(toastId, {
        render: "User deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      if (selectedUser?.id === userId) {
        closeModal();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user. Please try again.",
        { autoClose: 5000 }
      );
    }
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
                    {["Name", "Email", "Role", "isVerified", "Actions"].map(
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
                      <td className="px-6 py-4 text-gray-700">{`${u.firstName} ${u.lastName}`}</td>
                      <td className="px-6 py-4 text-gray-700">{u.email}</td>
                      <td className="px-6 py-4 text-gray-700">{u.role}</td>
                      <td className="px-6 py-4">
                        {u.isVerified ? "True" : "False"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <button
                          onClick={() => openUserSettings(u)}
                          className="p-2 rounded hover:bg-gray-100"
                        >
                          <SettingsIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {/* Other sections remain the same */}
          {/* ... */}
          {isModalOpen && selectedUser && (
            <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b px-8 py-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {editMode ? "Edit User" : "User Details"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      User ID: {selectedUser.id}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={editedUser.firstName || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter first name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={editedUser.lastName || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter last name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editedUser.email || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            User Role
                          </label>
                          <select
                            name="role"
                            value={editedUser.role || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="RECIPIENT">Recipient</option>
                            <option value="LOGISTICS_PROVIDER">
                              Logistics Provider
                            </option>
                            <option value="DONOR">Donor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Status
                          </label>
                          <div className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              name="isVerified"
                              checked={editedUser.isVerified || false}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  isVerified: e.target.checked,
                                })
                              }
                              className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              Email Verified
                            </label>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            User ID
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            {selectedUser.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            First Name
                          </p>
                          <p className="text-lg text-gray-800 font-medium">
                            {selectedUser.firstName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Last Name
                          </p>
                          <p className="text-lg text-gray-800 font-medium">
                            {selectedUser.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Email Address
                          </p>
                          <p className="text-lg text-gray-800 font-medium">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            User Role
                          </p>
                          <p className="text-lg text-gray-800 font-medium capitalize">
                            {selectedUser.role}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Verification Status
                          </p>
                          <div className="mt-1">
                            {selectedUser.isVerified ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Verified
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            User ID
                          </p>
                          <p className="text-sm text-gray-600 font-mono">
                            {selectedUser.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 border-t px-8 py-6">
                  {editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Discard Changes
                      </button>
                      <button
                        onClick={saveChanges}
                        className="px-6 py-3 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <SaveIcon className="w-5 h-5" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-3 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <EditIcon className="w-5 h-5" />
                      Edit User Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
