import React from "react";
import { Dialog } from "@headlessui/react";
import { XIcon } from "lucide-react";
import clsx from "clsx";
import { Donation } from "../types";

interface ViewDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
}

export const ViewDonationModal: React.FC<ViewDonationModalProps> = ({
  isOpen,
  onClose,
  donation,
}) => {
  if (!donation) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            Donation Details
          </Dialog.Title>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>Food Type:</strong> {donation.foodType}
            </div>
            <div>
              <strong>Quantity:</strong> {donation.quantity}
            </div>
            <div>
              <strong>Location:</strong> {donation.location.label}
            </div>
            <div>
              <strong>Expiry Date:</strong> {donation.expiryDate}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                className={clsx(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  donation.status === "matched"
                    ? "bg-purple-100 text-purple-800"
                    : donation.status === "pending"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-800"
                )}
              >
                {donation.status}
              </span>
            </div>
            <div>
              <strong>Notes: </strong>
              {donation.notes}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
