import React, { useState, useEffect } from "react";
import { Header } from "../Header";
import { StatCard } from "../StatCard";
import { SearchBar } from "../SearchBar";
import { FilterSelect } from "../FilterSelect";
import { DonationSection } from "../DonationSection";
import { DonationStatus } from "../../types";
import { SideBar } from "../SideBar";
import clsx from "clsx";
import {
  HomeIcon,
  PackageIcon,
  MapPinIcon,
  UserIcon,
  SettingsIcon,
  ClipboardListIcon,
} from "lucide-react";
import { donationService } from "../../services/donationService"; // use your refactored service
import { useAuth } from "../../contexts/AuthContext";
import PaginationControls from "../PaginationControl";

const recipientNavItems = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  { label: "Donations", icon: <PackageIcon className="w-5 h-5" />, href: "#" },
  {
    label: "Nearby Locations",
    icon: <MapPinIcon className="w-5 h-5" />,
    href: "#",
  },
  {
    label: "My Needs",
    icon: <ClipboardListIcon className="w-5 h-5" />,
    href: "/dashboard/Recipient-Needs",
  },
  { label: "Profile", icon: <UserIcon className="w-5 h-5" />, href: "#" },
  { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, href: "#" },
];

const stats = [
  { label: "Total Food Received (lbs)", value: 486 },
  { label: "Meals Served", value: 1458 },
  { label: "Community Members Helped", value: 324 },
];

const RecipientDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [distanceFilter, setDistanceFilter] = useState("All Distances");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 6;

  const { user } = useAuth();

  const fetchAvailableDonations = async () => {
    setLoading(true);
    try {
      const res = await donationService.getFilteredDonations(
        user?.token || "",
        {
          page: currentPage,
          rowsPerPage,
          donorName: search,
          foodType: typeFilter !== "All Types" ? typeFilter : undefined,
          status: "pending",
        }
      );

      const mapped = res.data.data.map((d: any) => ({
        title: d.title || d.donationType,
        donor:
          `${d.donor?.user?.firstName || ""} ${
            d.donor?.user?.lastName || ""
          }`.trim() || "Unknown Donor",
        quantity: d.quantity || "",
        location: d.location || "",
        expires: new Date(d.expiryDate).toLocaleDateString(),
        onClaim: () => alert(`Claimed donation ID: ${d.id}`),
      }));

      setTotal(res.data.total);

      setAvailableDonations(mapped);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, [search, typeFilter, currentPage]);

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

  const claimedDonations = [
    {
      title: "Dairy Products",
      donor: "Fresh Dairy Inc",
      quantity: "20 gallons",
      location: "321 Elm St",
      status: "in_transit" as DonationStatus,
      onFeedback: undefined,
    },
    {
      title: "Vegetables",
      donor: "Green Gardens",
      quantity: "75 lbs",
      location: "654 Maple Dr",
      status: "completed" as DonationStatus,
      onFeedback: () => alert("Feedback requested"),
    },
  ];

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Recipient Portal"
        navItems={recipientNavItems}
        userInfo={{
          name: "Recipient User",
          email: "recipient@foodshare.org",
        }}
      />

      <div
        className={clsx(
          "p-8 bg-gray-50 min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Recipient Dashboard" />
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

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
            total={total || 0}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />

          <DonationSection
            title="Claimed Donations"
            donations={claimedDonations}
            type="claimed"
            layout="row"
          />
        </div>
      </div>
    </>
  );
};

export default RecipientDashboard;
