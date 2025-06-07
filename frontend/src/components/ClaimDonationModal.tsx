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

  const [form, setForm] = useState({
    dropoffText: "",
    recipientPhone: "",
    additionalNotes: "",
  });
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open || !donation) return null;

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleConfirm = async () => {
    const { dropoffText, recipientPhone, additionalNotes } = form;

    if (!dropoffText.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }
    if (!recipientPhone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }
    if (!selectedPlace) {
      toast.error("Please select a location from the suggestions.");
      return;
    }

    try {
      setLoading(true);
      const token = user?.token || "";

      await donationService.claimDonation(donation.id, token, {
        dropoffLocation: {
          label: selectedPlace.label,
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lon,
        },
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

  const renderDetail = (label: string, value: string | number) => (
    <div className="flex flex-col border-b border-gray-200 pb-3">
      <span className="font-semibold text-gray-900">{label}</span>
      <span>{value}</span>
    </div>
  );

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
            {renderDetail("Food Type", donation.foodType)}
            {renderDetail("Quantity", donation.quantity)}
            {renderDetail("Location", donation.location.label)}
            {renderDetail(
              "Expires",
              new Date(donation.expiryDate).toLocaleString()
            )}
            {renderDetail(
              "Available From",
              new Date(donation.availableFrom).toLocaleString()
            )}
            {renderDetail(
              "Available To",
              new Date(donation.availableTo).toLocaleString()
            )}
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
              value={form.dropoffText}
              onChange={(val, place) => {
                setForm((prev) => ({ ...prev, dropoffText: val }));
                if (place) setSelectedPlace(place);
              }}
              label="Delivery Address"
            />

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
                value={form.recipientPhone}
                onChange={handleChange("recipientPhone")}
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
                value={form.additionalNotes}
                onChange={handleChange("additionalNotes")}
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
                className="flex-1 rounded-lg bg-purple-600 py-3 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
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
