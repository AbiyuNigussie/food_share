import React from "react";
import { StatCard } from "../StatCard";
import { DonationSection } from "../DonationSection";

const RecipientDashboard: React.FC = () => {
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
    },
    {
      title: "Bread",
      donor: "City Bakery",
      quantity: "30 loaves",
      location: "456 Oak Ave",
      expires: "2024-02-08",
      distance: "1.2 miles",
    },
    {
      title: "Canned Goods",
      donor: "Food Market",
      quantity: "100 units",
      location: "789 Pine St",
      expires: "2024-03-15",
      distance: "2.5 miles",
    },
  ];

  const claimedDonations = [
    {
      title: "Dairy Products",
      donor: "Fresh Dairy Inc",
      quantity: "20 gallons",
      location: "321 Elm St",
      status: "in_transit" as "in_transit",
      showButton: false,
    },
    {
      title: "Vegetables",
      donor: "Green Gardens",
      quantity: "75 lbs",
      location: "654 Maple Dr",
      status: "completed" as "completed",
      showButton: false,
    },
  ];

  return (
    <main className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Recipient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
      <DonationSection
        title="Available Donations"
        donations={availableDonations}
      />
      <DonationSection title="Claimed Donations" donations={claimedDonations} />
    </main>
  );
};

export default RecipientDashboard;
