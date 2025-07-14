// src/pages/DonorDashboard.tsx
import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import {
  GiftIcon,
  SettingsIcon,
  HomeIcon,
  BarChart2Icon,
  TableIcon,
  GridIcon,
  EyeIcon,
  TrashIcon,
} from "lucide-react";
import { SideBar, NavItem } from "../SideBar";
import { Header } from "../Header";
import NewDonationFormModal from "../NewDonationFormModal";
import { authService } from "../../services/authService";
import { ViewDonationModal } from "../ViewDonationModal";
import { useAuth } from "../../contexts/AuthContext";
import { Donation } from "../../types";
import { toast } from "react-toastify";
import { donationService } from "../../services/donationService";
import { StatCard } from "../StatCard";

// Simple inline Sparkline component
const Sparkline: React.FC<{ data: number[]; width?: number; height?: number }> = ({
  data,
  width = 64,
  height = 24,
}) => {
  if (data.length < 2) return null;
  const max = Math.max(...data),
        min = Math.min(...data);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / (max - min)) * height;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  return (
    <svg width={width} height={height} className="block">
      <path
        d={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DonorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all"|"matched"|"pending"|"claimed">("all");
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const { user } = useAuth();
  const token = user?.token || "";

  // KPI counts
  const [matchedCount, setMatchedCount] = useState(0);
  const [claimedCount, setClaimedCount] = useState(0);

  // 🎯 New UI states:
  const [viewMode, setViewMode] = useState<"table"|"cards">("table");

  // Fetch functions unchanged
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await donationService.getMyDonations(token, page, rowsPerPage);
      setDonations(response.data.data);
      setTotal(response.data.total);
    } catch {
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };
  const fetchMatchedAndClaimed = async () => {
    try {
      const m = await authService.getDonorMatchedDonations(token, 1, 1);
      setMatchedCount(m.data.total);
      const c = await authService.getDonorClaimedDonations(token, 1, 1);
      setClaimedCount(c.data.total);
    } catch {
      console.error("Error fetching matched/claimed counts");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchMatchedAndClaimed();
  }, [page, rowsPerPage]);

  // Filter + search logic unchanged
  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch =
        d.foodType.toLowerCase().includes(search.toLowerCase()) ||
        d.location.label.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || d.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, donations]);

  const openViewModal = (d: Donation) => {
    setSelectedDonation(d);
    setViewModalOpen(true);
  };
  const handleDeleteDonation = async (id: string) => {
    try {
      await authService.deleteDonation(id, token);
      toast.success("Donation deleted");
      fetchDonations();
      fetchMatchedAndClaimed();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Build dummy monthly trends (you can replace with real data)
  const dummyTrend = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * matchedCount)
  );

  // KPI cards data
  const stats = [
    { label: "Total Donations",    value: total },
    {
      label: "Matched Donations",
      value: matchedCount,
      max: total,
      trendData: dummyTrend,
      onClick: () => setFilterStatus("matched"),
    },
    {
      label: "Claimed Donations",
      value: claimedCount,
      max: total,
      trendData: dummyTrend,
      onClick: () => setFilterStatus("claimed"),
    },
  ];

  const pages = Math.ceil(total / rowsPerPage);

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Donor Portal"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={[
          { label: "Dashboard", icon: <HomeIcon />, href: "#" },
          { label: "My Donations", icon: <GiftIcon />, href: "/dashboard/Donor-Donations" },
          { label: "Insights", icon: <BarChart2Icon />, href: "/dashboard/donor-insights" },
          { label: "Settings", icon: <SettingsIcon />, href: "/dashboard/settings" },
        ]}
        userInfo={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email || "" }}
      />

      <main className={clsx("min-h-screen p-6 transition-all", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header title="DONOR DASHBOARD" />

        {/* 1. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              max={s.max}
              trendData={s.trendData}
              onClick={s.onClick}
            />
          ))}
        </div>

        {/* 2. Sticky Filter Bar */}
        <div className="sticky top-20 z-20 bg-white px-4 py-3 rounded-xl shadow-sm mb-6">
  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
    {/* Left Controls: Search + Filter + Button */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search Donations…"
          className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <GiftIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <select
        className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value as any);
          setPage(1);
        }}
      >
        <option value="all">All Statuses</option>
        <option value="matched">Matched</option>
        <option value="pending">Pending</option>
        <option value="claimed">Claimed</option>
      </select>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-purple-600 transition"
      >
        + Add Donation
      </button>
    </div>

    {/* View Mode Toggle */}
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setViewMode("table")}
        className={viewMode === "table" ? "text-purple-600" : "text-gray-400"}
      >
        <TableIcon />
      </button>
      <button
        onClick={() => setViewMode("cards")}
        className={viewMode === "cards" ? "text-purple-600" : "text-gray-400"}
      >
        <GridIcon />
      </button>
    </div>
  </div>
</div>


        <NewDonationFormModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { fetchDonations(); fetchMatchedAndClaimed(); }}
        />

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Donations</h2>

        {/* 4. Table vs. Card View */}
        {loading ? (
          <p>Loading donations...</p>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-600 sticky top-0">
                <tr>
                  {["Food Type","Quantity","Location","Expiry","Status","Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-sm font-semibold text-white uppercase"
                    >{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No donations found
                    </td>
                  </tr>
                ) : (
                  filtered.map((d, idx) => (
                    <tr
                      key={d.id}
                      className={clsx(
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                        "group hover:bg-gray-100 transition"
                      )}
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 flex items-center space-x-2">
                        <span>{d.foodType}</span>
                        <div className="w-16 h-6 text-purple-500 opacity-50">
                          <Sparkline data={[ // replace with real per-donation data
                            1, 3, 2, 4, 3, 5
                          ]}/>
                        </div>
                      </td>
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
                        >{d.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 opacity-0 group-hover:opacity-100 transition">
                        <EyeIcon
                          onClick={() => openViewModal(d)}
                          className="inline h-4 w-4 cursor-pointer text-purple-600"
                        />
                        <TrashIcon
                          onClick={() => handleDeleteDonation(d.id)}
                          className="inline h-4 w-4 cursor-pointer text-red-600"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-1">
                    {d.foodType}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {d.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {d.location.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Expiry:</span>{" "}
                    {new Date(d.expiryDate).toLocaleDateString()}
                  </p>
                  <span
                    className={clsx(
                      "inline-block mt-3 px-2 py-1 text-xs font-semibold rounded-full",
                      d.status === "matched"
                        ? "bg-purple-100 text-purple-800"
                        : d.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {d.status}
                  </span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => openViewModal(d)}
                    className="text-sm text-purple-600 font-medium hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteDonation(d.id)}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-700">
            Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, total)} of {total}
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

        <ViewDonationModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          donation={selectedDonation}
        />
      </main>
    </>
  );
};
