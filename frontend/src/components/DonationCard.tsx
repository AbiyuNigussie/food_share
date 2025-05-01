export interface DonationCardProps {
  title: string;
  donor: string;
  quantity: string;
  location: string;
  expires?: string;
  distance?: string;
  onClaim?: () => void;
  status?: "in_transit" | "completed";
  showButton?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  title,
  donor,
  quantity,
  location,
  expires,
  distance,
  onClaim,
  status,
  showButton = true,
}) => (
  <div className="bg-white p-4 rounded shadow w-full">
    <div className="flex justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      {distance && <p className="text-sm text-gray-400">{distance}</p>}
    </div>
    <p className="text-sm text-gray-600">{donor}</p>
    <p className="text-sm">Quantity: {quantity}</p>
    <p className="text-sm">Location: {location}</p>
    {expires && <p className="text-sm text-gray-500">Expires: {expires}</p>}
    {status && (
      <span
        className={`inline-block text-xs mt-2 px-2 py-1 rounded-full ${
          status === "completed"
            ? "bg-green-200 text-green-800"
            : "bg-blue-200 text-blue-800"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    )}
    {showButton && (
      <button
        onClick={onClaim}
        className="mt-4 w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700"
      >
        Claim Donation
      </button>
    )}
  </div>
);
