import React from "react";
import { DonationCardProps } from "../types";

export const ClaimedDonationCard: React.FC<DonationCardProps> = ({
  title,
  donor,
  quantity,
  location,
  status,
  onFeedback,
}) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{donor}</p>
      </div>
      {status && (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === "completed"
              ? "bg-purple-600 text-white"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      )}
    </div>
    <div className="grid grid-cols-2 gap-x-8 text-sm text-gray-700 mb-4">
      <div className="space-y-2">
        <p className="font-medium">Quantity:</p>
        <p className="font-medium">Location:</p>
      </div>
      <div className="space-y-2 text-right">
        <p>{quantity}</p>
        <p>{location}</p>
      </div>
    </div>
    {status === "completed" && onFeedback && (
      <button
        onClick={onFeedback}
        className="mt-auto w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        Leave Feedback
      </button>
    )}
  </div>
);
