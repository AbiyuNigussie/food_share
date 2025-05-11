import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ClipboardListIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  MapPinIcon,
  TruckIcon,
} from 'lucide-react';
import clsx from 'clsx';

interface Need {
  id: number;
  foodType: string;
  quantity: string;
  dropoffAddress: string;
  notes: string;
}

export const RecipientNeeds: React.FC = () => {
  const navigate = useNavigate();

  const [needs, setNeeds] = useState<Need[]>([]);

  const [foodType, setFoodType]           = useState('');
  const [quantity, setQuantity]           = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [notes, setNotes]                 = useState('');
  const [errors, setErrors]               = useState<Record<string,string>>({});

  const validate = () => {
    const errs: Record<string,string> = {};
    if (!foodType)      errs.foodType      = 'Required';
    if (!quantity)      errs.quantity      = 'Required';
    if (!dropoffAddress) errs.pickupAddress = 'Required';
    return errs;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const newNeed: Need = {
      id: needs.length + 1,
      foodType,
      quantity,
      dropoffAddress,
      notes,
    };
    setNeeds([newNeed, ...needs]);
    setFoodType('');
    setQuantity('');
    setDropoffAddress('');
    setNotes('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-stretch">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-8 py-6 bg-white shadow">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 focus:outline-none"
          >
            <ChevronLeftIcon className="w-5 h-5 text-purple-600" />
          </button>
          <HomeIcon className="w-8 h-8 text-purple-600 ml-6" />
          <h1 className="ml-4 text-2xl font-bold text-gray-900">List Your Needs</h1>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            <div className="p-8 overflow-auto">
              <form
                onSubmit={handleAdd}
                className="bg-white rounded-2xl shadow-lg p-8 space-y-6 min-h-full flex flex-col"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <ClipboardListIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Food Type *
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
                      Quantity *
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

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Dropoff Address *
                  </label>
                  <input
                    type="text"
                    value={dropoffAddress}
                    onChange={e => setDropoffAddress(e.target.value)}
                    placeholder="123 Main St, City"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.pickupAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupAddress}</p>
                  )}
                </div>

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

                <div className="mt-auto text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    <TruckIcon className="w-5 h-5 mr-2" />
                    Add Need
                  </button>
                </div>
              </form>
            </div>

            <div className="p-8 overflow-auto">
              <div className="bg-purple-100 text-purple-900 rounded-2xl shadow-lg p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center space-x-2">
                  <InfoIcon className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">How It Works</h2>
                </div>
                <p className="text-sm">
                  When a donor’s donation matches one of your listed needs, our system will automatically create a match and arrange pickup & delivery. You can also manually claim any available donation directly—no match needed.
                </p>
                <ol className="list-decimal list-inside space-y-2 flex-1 text-sm">
                  <li>List your needs with food type, quantity, and pickup address.</li>
                  <li>We match you automatically when a suitable donation appears.</li>
                  <li>Logistics provider picks up and delivers your matched food.</li>
                  <li>You can also browse & claim any available donation directly.</li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
