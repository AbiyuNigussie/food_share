import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import {
  GiftIcon,
  ListIcon,
  UserIcon,
  SettingsIcon,
  HomeIcon,
} from "lucide-react";
import { SideBar, NavItem } from "../SideBar";
import { Header } from "../Header";
import { NewDonationFormModal } from "../NewDonationFormModal";
import { authService } from "../../services/authService"; // Adjust the import path
import { ViewDonationModal } from "../ViewDonationModal";
import { useAuth } from "../../contexts/AuthContext";
import { Donation } from "../../types";
import { toast } from "react-toastify";

export const DonorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );

  const { user } = useAuth();

  const openViewModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setViewModalOpen(true);
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = user?.token || "";
      const response = await authService.getDonations(token);
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchesText =
        d.foodType.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || d.status === filterStatus;
      return matchesText && matchesStatus;
    });
  }, [search, filterStatus, donations]);

  const pages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
    {
      label: "My Donations",
      icon: <GiftIcon className="w-5 h-5" />,
      href: "#",
    },
    { label: "Activity", icon: <ListIcon className="w-5 h-5" />, href: "#" },
    { label: "Profile", icon: <UserIcon className="w-5 h-5" />, href: "#" },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "#",
    },
  ];

  const handleDeleteDonation = async (donationId: number) => {
    const token = user?.token || ""; // Ensure 'user' is defined in your component

    try {
      await authService.deleteDonation(donationId, token);
      const response = await authService.getDonations(token);
      setDonations(response.data);
      toast.success("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation. Please try again.");
    }
  };

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="DonorX"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{ name: "Jane Doe", email: "jane@donorx.org" }}
      />
      <main
        className={clsx(
          "min-h-screen bg-gray-50 p-6 transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Donor Dashboard" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[{ label: "Total Donations", value: donations.length }].map(
            (stat) => (
              <div
                key={stat.label}
                className="bg-white p-4 rounded-lg shadow flex flex-col"
              >
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="pending">Pending</option>
              <option value="in-process">in-process</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Donation
            </button>

            <NewDonationFormModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onDonationCreated={() => {
                fetchDonations(); // refetch all donations after adding
              }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Donations</h2>
        {loading ? (
          <p>Loading donations...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Food Type",
                    "Quantity",
                    "Location",
                    "Expiry Date",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {row.foodType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {row.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {row.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {row.expiryDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          row.status === "matched"
                            ? "bg-purple-100 text-purple-800"
                            : row.status === "pending"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openViewModal(row)}
                        className="text-purple-600 hover:underline text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDonation(row.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No donations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-700">
            Showing {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <ViewDonationModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        donation={selectedDonation}
      />
    </>
  );
};
