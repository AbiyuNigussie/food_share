// src/pages/NewDonationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ClipboardListIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  MapPinIcon,
  TruckIcon,
} from 'lucide-react';

export const NewDonationForm: React.FC = () => {
  const navigate = useNavigate();

  // form state
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!availableFrom) errs.availableFrom = 'Required';
    if (!availableTo) errs.availableTo = 'Required';
    if (availableFrom && availableTo && availableFrom >= availableTo)
      errs.availableTo = 'End must be after start';
    if (!expiryDate) errs.expiryDate = 'Required';
    if (!foodType) errs.foodType = 'Required';
    if (!quantity) errs.quantity = 'Required';
    if (!location) errs.location = 'Required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // TODO: submit to API
    alert('Donation created successfully!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-stretch">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center px-8 py-6 bg-white shadow">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 focus:outline-none"
          >
            <ChevronLeftIcon className="w-5 h-5 text-purple-600" />
          </button>
          <TruckIcon className="w-8 h-8 text-purple-600 ml-6" />
          <h1 className="ml-4 text-2xl font-bold text-gray-900">New Donation</h1>
        </div>

        {/* Two-column layout */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Left: Form */}
            <div className="p-8 overflow-auto">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-8 space-y-6 min-h-full flex flex-col"
              >
                {/* Availability Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Available From
                    </label>
                    <input
                      type="datetime-local"
                      value={availableFrom}
                      onChange={e => setAvailableFrom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.availableFrom && (
                      <p className="mt-1 text-sm text-red-600">{errors.availableFrom}</p>
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
                      onChange={e => setAvailableTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.availableTo && (
                      <p className="mt-1 text-sm text-red-600">{errors.availableTo}</p>
                    )}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>

                {/* Food Type & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <ClipboardListIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Food Type
                    </label>
                    <select
                      value={foodType}
                      onChange={e => setFoodType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      onChange={e => setQuantity(e.target.value)}
                      placeholder="e.g. 20 lbs"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="123 Main St, City"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <InfoIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special instructions…"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Submit button */}
                <div className="mt-auto text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Create Donation
                  </button>
                </div>
              </form>
            </div>

            {/* Right: How It Works (light purple) */}
            <div className="p-8 overflow-auto">
              <div className="bg-purple-100 text-purple-900 rounded-2xl shadow-lg p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center space-x-2">
                  <InfoIcon className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">How It Works</h2>
                </div>
                <ol className="list-decimal list-inside space-y-2 flex-1">
                  <li>Fill out your donation details and availability.</li>
                  <li>Our team schedules a pick-up at your chosen time.</li>
                  <li>You receive confirmation and driver contact info.</li>
                  <li>Track your donation’s impact in your dashboard.</li>
                </ol>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => window.open('/faq', '_blank')}
                    className="text-sm underline"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
