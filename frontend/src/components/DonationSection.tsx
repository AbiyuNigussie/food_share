import React, { ReactNode } from "react";
import { DonationCardProps } from "../types";
import { AvailableDonationCard } from "./AvailableDonationCard";
import { ClaimedDonationCard } from "./ClaimedDonationCard";

interface DonationSectionProps {
  title: string;
  donations: DonationCardProps[];
  controls?: ReactNode;
  type: "available" | "claimed";
  layout?: "grid" | "row";
  loading?: boolean;
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  title,
  donations,
  controls,
  type,
  layout = "grid",
  loading = false,
}) => {
  const renderCard = (donation: DonationCardProps, index: number) =>
    type === "available" ? (
      <AvailableDonationCard key={index} {...donation} />
    ) : (
      <ClaimedDonationCard key={index} {...donation} />
    );

  const containerClass =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "flex flex-col gap-6";

  return (
    <section className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      {controls && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">{controls}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-6">
          Loading donations...
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No donations available.
        </div>
      ) : (
        <div className={containerClass}>{donations.map(renderCard)}</div>
      )}
    </section>
  );
};
