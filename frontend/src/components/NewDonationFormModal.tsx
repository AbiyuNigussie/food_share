import React, { useState } from "react";
import { toast } from "react-toastify";
import GeoAutoComplete, { Place } from "../components/GeoAutoComplete";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

interface NewDonationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewDonationFormModal: React.FC<NewDonationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    title: "",
    foodType: "",
    quantity: "",
    expiryDate: "",
    availableFrom: "",
    availableTo: "",
    notes: "",
  });

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [locationInput, setLocationInput] = useState(""); // text input for GeoAutoComplete
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  if (!open) return null;

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleLocationChange = (val: string, place?: Place) => {
    setLocationInput(val);
    if (place) {
      setSelectedPlace(place);
    } else {
      setSelectedPlace(null);
    }
  };

  const handleSubmit = async () => {
    const {
      title,
      foodType,
      quantity,
      expiryDate,
      availableFrom,
      availableTo,
      notes,
    } = form;

    if (!title.trim()) {
      toast.error("Please provide a title.");
      return;
    }
    if (!foodType.trim()) {
      toast.error("Please specify the food type.");
      return;
    }
    if (!quantity.trim()) {
      toast.error("Please specify the quantity.");
      return;
    }
    if (!expiryDate.trim()) {
      toast.error("Please specify expiry date.");
      return;
    }
    if (!availableFrom.trim()) {
      toast.error("Please specify available from date.");
      return;
    }
    if (!availableTo.trim()) {
      toast.error("Please specify available to date.");
      return;
    }
    if (!selectedPlace) {
      toast.error("Please select a location from the suggestions.");
      return;
    }

    try {
      setLoading(true);

      // Example payload structure - replace with your actual API call
      const payload = {
        title: title.trim(),
        foodType: foodType.trim(),
        quantity: quantity.trim(),
        expiryDate: new Date(expiryDate).toISOString(),
        availableFrom: new Date(availableFrom).toISOString(),
        availableTo: new Date(availableTo).toISOString(),
        notes: notes.trim() || undefined,
        location: {
          label: selectedPlace.label,
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lon,
        },
      };
      const token = user?.token || "";
      await authService.createDonation(payload, token);
      console.log("Submitting donation:", payload);

      toast.success("Donation created successfully!");
      onSuccess();
      onClose();
      setForm({
        title: "",
        foodType: "",
        quantity: "",
        expiryDate: "",
        availableFrom: "",
        availableTo: "",
        notes: "",
      });
      setSelectedPlace(null);
      setLocationInput("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to create donation. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">
          Create New Donation
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Donation title"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none hover:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="foodType"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              Food Type
            </label>
            <select
              id="foodType"
              value={form.foodType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, foodType: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:outline-none hover:border-gray-400"
            >
              <option value="">Select type…</option>
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Canned Goods">Canned Goods</option>
              <option value="Dairy">Dairy</option>
              <option value="Baked Goods">Baked Goods</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="text"
              value={form.quantity}
              onChange={handleChange("quantity")}
              placeholder="E.g. 10 loaves, 5 kg"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none hover:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              Expires
            </label>
            <input
              id="expiryDate"
              type="datetime-local"
              value={form.expiryDate}
              onChange={handleChange("expiryDate")}
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:outline-none hover:border-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="availableFrom"
                className="mb-2 block text-base font-medium text-gray-800"
              >
                Available From
              </label>
              <input
                id="availableFrom"
                type="datetime-local"
                value={form.availableFrom}
                onChange={handleChange("availableFrom")}
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:outline-none hover:border-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="availableTo"
                className="mb-2 block text-base font-medium text-gray-800"
              >
                Available To
              </label>
              <input
                id="availableTo"
                type="datetime-local"
                value={form.availableTo}
                onChange={handleChange("availableTo")}
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:outline-none hover:border-gray-400"
              />
            </div>
          </div>

          <div>
            <GeoAutoComplete
              label="Location"
              value={locationInput}
              onChange={handleLocationChange}
              placeholder="Search for location"
              className=""
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-base font-medium text-gray-800"
            >
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={handleChange("notes")}
              rows={3}
              placeholder="Any special instructions or info"
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
              {loading ? "Submitting..." : "Create Donation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDonationFormModal;
