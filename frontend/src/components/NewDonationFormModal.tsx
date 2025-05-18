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
  onDonationCreated?: (donation: any) => void; // New prop
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
        setLoading(false);
        return;
      }

      // Create donation
      const response = await authService.createDonation(
        donationData,
        user.token
      );

      toast.success("Donation created successfully!");

      if (onDonationCreated) {
        onDonationCreated(response);
      }

      onClose();
    } catch (error) {
      console.error(error);
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
          {/* form inputs here as before */}
          {/* ... */}
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
