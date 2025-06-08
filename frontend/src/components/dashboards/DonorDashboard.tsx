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
import NewDonationFormModal from "../NewDonationFormModal";
import { authService } from "../../services/authService";
import { ViewDonationModal } from "../ViewDonationModal";
import { useAuth } from "../../contexts/AuthContext";
import { Donation } from "../../types";
import { toast } from "react-toastify";

export const DonorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );

  const { user } = useAuth();

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

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = user?.token || "";
      const response = await authService.getDonations(token, page, rowsPerPage);
      setDonations(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [page, rowsPerPage]);

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch =
        d.foodType?.toLowerCase().includes(search.toLowerCase()) ||
        d.location.label?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || d.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, donations]);

  const openViewModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setViewModalOpen(true);
  };

  const handleDeleteDonation = async (donationId: string) => {
    try {
      const token = user?.token || "";
      await authService.deleteDonation(donationId, token);
      toast.success("Donation deleted successfully!");
      fetchDonations(); // refresh after deletion
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete donation.");
    }
  };

  const pages = Math.ceil(total / rowsPerPage);

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        title="DonorX"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{ name: "Donor User", email: user?.email || "" }}
      />
      <main
        className={clsx(
          "min-h-screen bg-gray-50 p-6",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Donor Dashboard" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 overflow-hidden">
            {/* Decorative purple circle */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full transform translate-x-1/3 -translate-y-1/3" />

            <div className="relative flex flex-col">
              <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                Total Donations
              </span>
              <span className="mt-3 text-4xl font-extrabold text-purple-800">
                {total}
              </span>
            </div>
          </div>
        </div>

       <div className="max-w-10x1 mx-auto mb-6 px-1">
  <div className="bg-white rounded-xl shadow-inner px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
    {/* Search */}
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Search Donations…"
        className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      <GiftIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>

    {/* Status Filter */}
    <select
      className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
      value={filterStatus}
      onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
    >
      <option value="all">All Statuses</option>
      <option value="matched">Matched</option>
      <option value="pending">Pending</option>
      <option value="in-process">In-Process</option>
    </select>

    {/* Add Donation */}
    <button
      onClick={() => setModalOpen(true)}
      className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-purple-600 transition"
    >
      + Add Donation
    </button>
  </div>
</div>

        <NewDonationFormModal
          open={isModalOpen} // ❌ This should be `open`
          onClose={() => setModalOpen(false)}
          onSuccess={fetchDonations}
        />

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Donations</h2>

        {loading ? (
          <p>Loading donations...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-purple-600 sticky top-0">
        <tr>
          {[
            "Food Type",
            "Quantity",
            "Location",
            "Expiry",
            "Status",
            "Actions",
          ].map((col) => (
            <th
              key={col}
              className="px-6 py-3 text-left text-sm font-semibold text-white uppercase"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-6 py-8 text-center text-sm text-gray-500"
            >
              No donations found
            </td>
          </tr>
        ) : (
          filtered.map((d, idx) => (
            <tr
              key={d.id}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 text-sm text-gray-800">{d.foodType}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{d.quantity}</td>
              <td className="px-6 py-4 text-sm text-gray-800 truncate">
                {d.location.label}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {new Date(d.expiryDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={clsx(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    d.status === "matched"
                      ? "bg-purple-100 text-purple-800"
                      : d.status === "pending"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {d.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-4">
                <button
                  onClick={() => openViewModal(d)}
                  className="text-purple-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteDonation(d.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
        )}

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-700">
            Showing {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, total)} of {total}
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
