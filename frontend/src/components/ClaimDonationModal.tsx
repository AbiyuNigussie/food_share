// src/modals/ClaimDonationModal.tsx
import React, { useState } from "react";
import { donationService } from "../services/donationService";
import { Donation } from "../types";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import GeoAutoComplete from "./GeoAutoComplete";

interface ClaimDonationModalProps {
  open: boolean;
  onClose: () => void;
  donation: Donation | null;
  onSuccess: () => void;
}

type Place = {
  label: string;
  lat: number;
  lon: number;
};

const ClaimDonationModal: React.FC<ClaimDonationModalProps> = ({
  open,
  onClose,
  donation,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [dropoffLocation, setDropOffLocation] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !donation) return null;

  const handleConfirm = async () => {
    if (!dropoffLocation.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }
    if (!recipientPhone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }

    try {
      setLoading(true);
      const token = user?.token || "";

      await donationService.claimDonation(donation.id, token, {
        dropoffLocation,
        recipientPhone,
        deliveryNotes: additionalNotes.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to claim donation. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">
          Claim “{donation.title}” and provide delivery details
        </h2>

        {/* Donation Details Section */}
        <section className="mb-10">
          <h3 className="mb-6 border-b border-gray-300 pb-2 text-lg font-semibold text-gray-800">
            Donation Details
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-sm leading-relaxed">
            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Food Type</span>
              <span>{donation.foodType}</span>
            </div>
            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Quantity</span>
              <span>{donation.quantity}</span>
            </div>

            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Location</span>
              <span>{donation.location}</span>
            </div>
            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Expires</span>
              <span>{new Date(donation.expires).toLocaleString()}</span>
            </div>

            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">
                Available From
              </span>
              <span>{new Date(donation.availableFrom).toLocaleString()}</span>
            </div>
            <div className="flex flex-col border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Available To</span>
              <span>{new Date(donation.availableTo).toLocaleString()}</span>
            </div>

            <div className="flex flex-col col-span-2 pt-3">
              <span className="font-semibold text-gray-900">Note</span>
              <span>{donation.notes || "N/A"}</span>
            </div>
          </div>
        </section>

        {/* Delivery Details Section */}
        <section>
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-lg font-semibold text-gray-800">
            Delivery Details
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="space-y-6"
          >
            <GeoAutoComplete
              value={dropoffLocation}
              onChange={(val, place) => {
                setDropOffLocation(val);
                if (place) setSelectedPlace(place);
              }}
              label="Delivery Address"
            />
            {/* <div>
              <label
                htmlFor="deliveryAddress"
                className="mb-2 block text-base font-medium text-gray-800"
              >
                Delivery Address
              </label>
              <textarea
                id="deliveryAddress"
                value={dropoffLocation}
                onChange={(e) => setDropOffLocation(e.target.value)}
                rows={3}
                placeholder="Enter the delivery address"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div> */}
            <div>
              <label
                htmlFor="contactPhone"
                className="mb-2 block text-base font-medium text-gray-800"
              >
                Contact Phone
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Recipient phone number"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none hover:border-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="additionalNotes"
                className="mb-2 block text-base font-medium text-gray-800"
              >
                Additional Delivery Notes (optional)
              </label>
              <textarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions?"
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none hover:border-gray-400"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg bg-gray-300 py-3 text-gray-900 font-semibold hover:bg-gray-400 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Claiming..." : "Confirm Claim"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ClaimDonationModal;
