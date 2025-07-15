import React, { useState, useEffect } from "react";
import { Header } from "../Header";
import { StatCard } from "../StatCard";
import { SearchBar } from "../SearchBar";
import { FilterSelect } from "../FilterSelect";
import { DonationSection } from "../DonationSection";
import { Donation } from "../../types";
import { SideBar } from "../SideBar";
import clsx from "clsx";
import { authService } from "../../services/authService";
import {
  HomeIcon,
  PackageIcon,
  ClipboardListIcon,
  SettingsIcon,
  BarChart2Icon,
  TruckIcon,
} from "lucide-react";
import { donationService } from "../../services/donationService";
import { useAuth } from "../../contexts/AuthContext";
import PaginationControls from "../PaginationControl";
import ClaimDonationModal from "../ClaimDonationModal";
import { toast } from "react-toastify";

const recipientNavItems = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  {
    label: "My Claims",
    icon: <PackageIcon className="w-5 h-5" />,
    href: "/dashboard/my-donations",
  },
  {
    label: "Insights",
    icon: <BarChart2Icon className="w-5 h-5" />,
    href: "/dashboard/recipient-insights",
  },
  {
    label: "My Needs",
    icon: <ClipboardListIcon className="w-5 h-5" />,
    href: "/dashboard/Recipient-Needs",
  },
  {
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
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

  // donations & stats
  const [availableDonations, setAvailableDonations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [stat, setStat] = useState<{ month: string; volume: number }[]>([]);
  const [totalLbs, setTotalLbs] = useState(0);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );

  useEffect(() => {
    fetchAvailableDonations();
  }, [search, typeFilter, currentPage]);

  useEffect(() => {
    fetchInsights();
  }, [token]);

  // fetchers
  const fetchAvailableDonations = async () => {
    setLoading(true);
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
          id: d.id,
          title: d.title || d.donationType,
          donor:
            `${d.donor.user.firstName} ${d.donor.user.lastName}`.trim() ||
            "Unknown Donor",
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await authService.getRecipientInsights(token);
      setStat(res.data.data.monthly || []);
      setTotalLbs(res.data.data.totalLbs || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const totalReceived = stat.reduce((sum, s) => sum + s.volume, 0);

  const volumes = stat.map((s) => s.volume);

  const stats = [
    { label: "Available Donations", value: total },
    {
      label: "Donations Received",
      value: totalReceived,
      max: 100,
      trendData: volumes,
    },
    {
      label: "Total Food Received (lbs)",
      value: totalLbs,
      max: 1000,
      trendData: volumes,
    },
  ];

  const controls = (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by food or donor"
      />
      <FilterSelect
        options={[
          "All Types",
          "Baked Goods",
          "Canned Goods",
          "Fresh Produce",
          "Dairy",
          "Meat & Poultry",
        ]}
        value={typeFilter}
        onChange={setTypeFilter}
      />
    </>
  );

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Recipient Portal"
        navItems={recipientNavItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <div
        className={clsx(
          "min-h-screen p-10 transition-all",
          sidebarOpen ? "ml-64" : "ml-16",
          ""
        )}
      >
        <Header title="RECIPIENT DASHBOARD">
          <TruckIcon className="w-6 h-6 text-purple-500 mr-2" />
        </Header>

        {/* KPI stats with radial progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, max, trendData }) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              max={max}
              trendData={trendData}
            />
          ))}
        </div>

        {/* sticky controls */}
        <div className="sticky top-24 z-10 bg-white/60 backdrop-blur-md p-4 rounded-2xl mb-4 shadow">
          <div className="flex flex-col sm:flex-row gap-4">{controls}</div>
        </div>

        {/* donation grid */}
        <DonationSection
          title="Available Donations"
          donations={availableDonations}
          controls={null}
          layout="grid"
          loading={loading}
          id={""}
          type={"available"}
        />

        <div className="mt-6">
          <PaginationControls
            page={currentPage}
            rowsPerPage={rowsPerPage}
            total={total}
            onPageChange={setCurrentPage}
          />
        </div>

        <ClaimDonationModal
          open={!!selectedDonation}
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onSuccess={() => {
            toast.success("Donation claimed successfully!");
            setSelectedDonation(null);
            fetchAvailableDonations();
          }}
        />
      </div>
    </>
  );
};

export default RecipientDashboard;
