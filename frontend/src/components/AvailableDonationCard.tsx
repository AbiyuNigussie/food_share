// src/components/AvailableDonationCard.tsx
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
  <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 overflow-hidden">
    {/* Decorative purple accent */}
    <div className="absolute top-0 left-0 w-2 h-12 bg-purple-500 rounded-br-lg" />

    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Donor: {donor}</p>
      </div>
      {distance && (
        <span className="text-sm font-medium text-purple-600">{distance}</span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-6">
      <div className="space-y-1">
        <p className="font-medium">Quantity</p>
        <p className="font-medium">Location</p>
        {expires && <p className="font-medium">Expires</p>}
      </div>
      <div className="space-y-1 text-right">
        <p className="text-gray-900">{quantity}</p>
        <p className="text-gray-900">{location.label}</p>
        {expires && <p className="text-gray-500">{expires}</p>}
      </div>
    </div>

    {onClaim && (
      <button
        onClick={onClaim}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:from-purple-600 hover:to-purple-800 transition"
      >
        Claim Donation
      </button>
    )}
  </div>
);
