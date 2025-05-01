import { DonationCard, DonationCardProps } from "./DonationCard";

interface DonationSectionProps {
  title: string;
  donations: DonationCardProps[];
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  title,
  donations,
}) => (
  <section className="mt-6">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {donations.map((donation, idx) => (
        <DonationCard key={idx} {...donation} />
      ))}
    </div>
  </section>
);
