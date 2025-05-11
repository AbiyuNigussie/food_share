import React from "react";
import { DonationCardProps } from "../types";

export const AvailableDonationCard: React.FC<DonationCardProps> = ({
  title,
  donor,
  quantity,
  location,
  expires,
  distance,
  onClaim,
}) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{donor}</p>
      </div>
      {distance && <span className="text-sm text-gray-400">{distance}</span>}
    </div>

    <div className="flex justify-between text-sm text-gray-700 mb-4">
      <div className="space-y-1">
        <p className="font-medium">Quantity:</p>
        <p className="font-medium">Location:</p>
        {expires && <p className="font-medium">Expires:</p>}
      </div>
      <div className="space-y-1 text-right">
        <p>{quantity}</p>
        <p>{location}</p>
        {expires && <p className="text-gray-500">{expires}</p>}
      </div>
    </div>

    {onClaim && (
      <button
        onClick={onClaim}
        className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Claim Donation
      </button>
    )}
  </div>
);
