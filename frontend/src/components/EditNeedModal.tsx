// src/components/EditNeedModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { RecipientNeed } from "../types";
import GeoAutoComplete, { Place } from "./GeoAutoComplete";
import { MapPinIcon } from "lucide-react";

interface EditNeedModalProps {
  need: RecipientNeed | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditNeedModal: React.FC<EditNeedModalProps> = ({
  need,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const { user } = useAuth();
  const token = user?.token || "";

  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [DropOffAddress, setDropOffAddress] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [notes, setNotes] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (need) {
      setFoodType(need.foodType);
      setQuantity(need.quantity);
      setDropOffAddress(need.DropOffAddress);
      setSelectedPlace(null);
      setNotes(need.notes || "");
      setContactPhone(need.contactPhone);
    }
  }, [need]);

  const handleSave = async () => {
    if (!need) return;
    try {
      await authService.updateNeed(
        need.id.toString(),
        {
          foodType,
          quantity,
          DropOffAddress,
          contactPhone,
          notes,
        },
        token
      );
      toast.success("Need updated");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update need");
    }
  };

  if (!need) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Need
          </Dialog.Title>

          <div className="space-y-4">
            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium">Food Type</label>
              <input
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            {/* DropOff Address with GeoAutoComplete */}
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                Drop-Off Address
              </label>
              <GeoAutoComplete
                value={DropOffAddress}
                onChange={(val, place) => {
                  setDropOffAddress(val);
                  if (place) setSelectedPlace(place);
                }}
                placeholder="Search for a location…"
                className="w-full"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded">
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
