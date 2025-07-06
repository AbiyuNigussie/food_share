// src/pages/RecipientDashboard.tsx
import React, { useState, useEffect } from "react";
import { Header } from "../Header";
import { StatCard } from "../StatCard";
import { SearchBar } from "../SearchBar";
import { FilterSelect } from "../FilterSelect";
import { DonationSection } from "../DonationSection";
import { DonationStatus, Donation } from "../../types";
import { SideBar } from "../SideBar";
import clsx from "clsx";
import { authService } from "../../services/authService";
import {
  HomeIcon,
  PackageIcon,
  ClipboardListIcon,
  SettingsIcon,
  BarChart2Icon,
} from "lucide-react";
import { donationService } from "../../services/donationService";
import { useAuth } from "../../contexts/AuthContext";
import PaginationControls from "../PaginationControl";
import ClaimDonationModal from "../ClaimDonationModal";
import { toast } from "react-toastify";

const recipientNavItems = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  { label: "Donations", icon: <PackageIcon className="w-5 h-5" />, href: "/dashboard/my-donations" },
  { label: "Insights", icon: <BarChart2Icon />, href: "/dashboard/recipient-insights" },
  {
    label: "My Needs",
    icon: <ClipboardListIcon className="w-5 h-5" />,
    href: "/dashboard/Recipient-Needs",
  },
  { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, href: "/dashboard/settings" },
];

const RecipientDashboard: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token!;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // filters & pagination
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [loading, setLoading] = useState(false);

  // donation lists
  const [availableDonations, setAvailableDonations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  // claimed total
  const [claimedCount, setClaimedCount] = useState(0);

  // claim modal
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // insight stats
  type RReceiveStat = { month: string; volume: number };
  const [stat, setStat] = useState<RReceiveStat[]>([]);
  const [totalLbs, setTotalLbs] = useState(0);
  const [selectedYear] = useState(new Date().getFullYear());

  // fetch available donations
  const fetchAvailableDonations = async () => {
    try {
      const res = await donationService.getFilteredDonations(token, {
        page: currentPage,
        rowsPerPage,
        donorName: search,
        foodType: typeFilter !== "All Types" ? typeFilter : undefined,
        status: "pending",
      });
      setTotal(res.data.total);
      setAvailableDonations(
        res.data.data.map((d: any) => ({
          title: d.title || d.donationType,
          donor: `${d.donor.user.firstName} ${d.donor.user.lastName}`.trim() || "Unknown Donor",
          foodType: d.foodType,
          quantity: d.quantity,
          location: d.location,
          expiryDate: new Date(d.expiryDate).toLocaleDateString(),
          availableFrom: new Date(d.availableFrom).toLocaleDateString(),
          availableTo: new Date(d.availableTo).toLocaleDateString(),
          notes: d.notes,
          onClaim: () => setSelectedDonation(d),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    }
  };

  // fetch insight stats
  const fetchInsights = async () => {
    try {
      const res = await authService.getRecipientInsights(token);
      const data = res.data.data;
      setStat(data.monthly || []);
      setTotalLbs(data.totalLbs || 0);
    } catch (err) {
      console.error("Failed to fetch recipient insights:", err);
    }
  };

  // fetch claimed donations count
  const fetchClaimedCount = async () => {
    try {
      const res = await authService.getClaimedDonations(token, 1, 1);
      setClaimedCount(res.data.total);
    } catch (err) {
      console.error("Failed to fetch claimed count:", err);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, [search, typeFilter, currentPage]);

  useEffect(() => {
    fetchInsights();
    fetchClaimedCount();
  }, [token, selectedYear]);

  // top stats
  const stats = [
    { label: "Available Donations",       value: total },
    { label: "Donations Received",        value: claimedCount },
    { label: "Total Food Received (lbs)", value: totalLbs },
    
  ];

  const controls = (
    <>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by food or donor" />
      <FilterSelect
        options={["All Types","Baked Goods","Canned Goods","Fresh Produce","Dairy","Meat & Poultry"]}
        value={typeFilter}
        onChange={setTypeFilter}
      />
    </>
  );

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen(o => !o)}
        title="Recipient Portal"
        navItems={recipientNavItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <div className={clsx("min-h-screen p-8 transition-all", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header title="Recipient Dashboard" />

        {/* three stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Available Donations */}
        <DonationSection
          title="Available Donations"
          donations={availableDonations}
          controls={controls}
          type="available"
          layout="grid"
          loading={loading}
        />
        <PaginationControls
          page={currentPage}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={setCurrentPage}
        />

        {/* Claim Donation Modal */}
        <ClaimDonationModal
          open={!!selectedDonation}
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onSuccess={() => {
            toast.success("Donation claimed successfully!");
            setSelectedDonation(null);
            fetchAvailableDonations();
            fetchClaimedCount();
          }}
        />
      </div>
    </>
  );
};

export default RecipientDashboard;
