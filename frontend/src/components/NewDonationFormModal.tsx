import React, { useState } from "react";
import {
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  InfoIcon,
  MapPinIcon,
  HomeIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

interface NewDonationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationCreated?: () => void;
}

export const NewDonationFormModal: React.FC<NewDonationFormModalProps> = ({
  isOpen,
  onClose,
  onDonationCreated,
}) => {
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!availableFrom) errs.availableFrom = "Required";
    if (!availableTo) errs.availableTo = "Required";
    if (availableFrom && availableTo && availableFrom >= availableTo)
      errs.availableTo = "End must be after start";
    if (!expiryDate) errs.expiryDate = "Required";
    if (!foodType) errs.foodType = "Required";
    if (!quantity) errs.quantity = "Required";
    if (!location) errs.location = "Required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const donationData = {
        availableFrom,
        availableTo,
        expiryDate,
        foodType,
        quantity,
        location,
        notes,
      };
      if (!user?.token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Call the createDonation method from authService
      const response = await authService.createDonation(
        donationData,
        user.token
      );

      // Success toast
      if (onDonationCreated) {
        onDonationCreated();
      }
      toast.success("Donation created successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      // Error toast
      toast.error("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <HomeIcon className="w-6 h-6 mr-2 text-purple-600" />
          New Donation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
                Available From
              </label>
              <input
                type="datetime-local"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.availableFrom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.availableFrom}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
                Available To
              </label>
              <input
                type="datetime-local"
                value={availableTo}
                onChange={(e) => setAvailableTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.availableTo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.availableTo}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <ClipboardListIcon className="w-5 h-5 mr-2 text-purple-600" />
                Food Type
              </label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select type…</option>
                <option>Fresh Produce</option>
                <option>Canned Goods</option>
                <option>Dairy</option>
                <option>Baked Goods</option>
                <option>Meat & Poultry</option>
              </select>
              {errors.foodType && (
                <p className="mt-1 text-sm text-red-600">{errors.foodType}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FileTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                Quantity
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 20 lbs"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
              Pickup Address
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main St, City"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <InfoIcon className="w-5 h-5 mr-2 text-purple-600" />
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Create Donation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// update this modal to accept ondonationcreated props and fetch donation after successful donation creation
