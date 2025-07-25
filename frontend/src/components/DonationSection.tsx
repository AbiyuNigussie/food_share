import React, { ReactNode } from "react";
import { DonationCardProps } from "../types";
import { AvailableDonationCard } from "./AvailableDonationCard";
import { ClaimedDonationCard } from "./ClaimedDonationCard";
import { motion } from "framer-motion";

interface DonationSectionProps {
  id: string;
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
  const renderCard = (donation: DonationCardProps) =>
    type === "available" ? (
      <AvailableDonationCard {...donation} />
    ) : (
      <ClaimedDonationCard {...donation} />
    );

  // grid vs. stacked list
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "flex flex-col gap-6";

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

      {controls && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">{controls}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-12">
          Loading donations...
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No donations available.
        </div>
      ) : (
        <div className={containerClass}>
          {donations.map((donation, idx) => (
            <motion.div
              key={donation.id ?? idx}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                bg-white 
                rounded-2xl 
                shadow-lg 
                p-4 
                hover:shadow-2xl 
                transition-shadow 
                relative
              "
            >
              {renderCard(donation)}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
