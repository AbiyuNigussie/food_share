import React, { useState } from "react";
import { Header } from "../Header";
import { StatCard } from "../StatCard";
import { SearchBar } from "../SearchBar";
import { FilterSelect } from "../FilterSelect";
import { DonationSection } from "../DonationSection";
import { DonationStatus } from "../../types";
import clsx from "clsx";
import { SideBar } from "../SideBar";
import {
  HomeIcon,
  PackageIcon,
  MapPinIcon,
  UserIcon,
  SettingsIcon,
  ClipboardListIcon,
} from "lucide-react";

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
const RecipientDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [distanceFilter, setDistanceFilter] = useState("All Distances");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Food Received (lbs)", value: 486 },
    { label: "Meals Served", value: 1458 },
    { label: "Community Members Helped", value: 324 },
  ];

  const availableDonations = [
    {
      title: "Fresh Produce",
      donor: "Local Farm Co",
      quantity: "50 lbs",
      location: "123 Main St",
      expires: "2024-02-10",
      distance: "0.8 miles",
      onClaim: () => alert("Claimed!"),
    },
    {
      title: "Bread",
      donor: "City Bakery",
      quantity: "30 loaves",
      location: "456 Oak Ave",
      expires: "2024-02-08",
      distance: "1.2 miles",
      onClaim: () => alert("Claimed!"),
    },
    {
      title: "Canned Goods",
      donor: "Food Market",
      quantity: "100 units",
      location: "789 Pine St",
      expires: "2024-03-15",
      distance: "2.5 miles",
      onClaim: () => alert("Claimed!"),
    },
  ];

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

  const controls = (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by food or donor"
      />
      <FilterSelect
        options={["All Types", "Fresh Produce", "Bread", "Canned Goods"]}
        value={typeFilter}
        onChange={setTypeFilter}
      />
      <FilterSelect
        options={["All Distances", "0-1 miles", "1-2 miles", "2+ miles"]}
        value={distanceFilter}
        onChange={setDistanceFilter}
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
