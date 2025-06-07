// src/components/ChangeMatchModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { TruckIcon, MapPinIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import GeoAutoComplete, { Place } from './GeoAutoComplete';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  donationId: string;
  initialAddress?: string;
  initialPhone?: string;
  token: string;
  onClaimed: () => void;
}

export const ChangeMatchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  donationId,
  initialAddress = '',
  initialPhone = '',
  token,
  onClaimed,
}) => {
  const [dropoffLocation, setDropoffLocation] = useState(initialAddress);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [recipientPhone, setRecipientPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  // Sync when props change
  useEffect(() => {
    setDropoffLocation(initialAddress);
    setSelectedPlace(null);
    setRecipientPhone(initialPhone);
  }, [initialAddress, initialPhone, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropoffLocation || !recipientPhone) {
      toast.error('Address and phone are required');
      return;
    }
    setLoading(true);
    try {
      // Call claimDonation with updates
      await authService.claimDonation(
        donationId,
        { dropoffLocation, recipientPhone },
        token
      );
      toast.success('Donation claimed and logistics notified.');
      onClaimed();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to claim donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Delivery Details
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drop-off Address */}
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                Drop-off Address
              </label>
              <GeoAutoComplete
                value={dropoffLocation}
                onChange={(val, place) => {
                  setDropoffLocation(val);
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
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                <TruckIcon className="w-4 h-4 mr-1" />
                {loading ? 'Saving…' : 'Save & Claim'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
