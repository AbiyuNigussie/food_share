import React from 'react';
import { ArrowLeftIcon, PhoneCallIcon } from 'lucide-react';

export const DeliveryDetails: React.FC = () => {
  const timeline = [
    { label: 'Picked up from donor', time: '10:15 AM', detail: '123 Farm Road' },
    { label: 'In transit', time: '10:45 AM', detail: 'En route to recipient' },
    { label: 'Arriving soon', time: '11:30 AM', detail: '0.5 miles away' },
  ];

  const checkpoints = [
    { label: 'Checkpoint 1', color: 'bg-purple-600', status: 'completed', statusColor: 'text-purple-600' },
    { label: 'Checkpoint 2', color: 'bg-yellow-500', status: 'in_progress', statusColor: 'text-yellow-600' },
    { label: 'Checkpoint 3', color: 'bg-gray-300', status: 'pending', statusColor: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded hover:bg-gray-100">
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Delivery Details</h1>
            <p className="text-sm text-gray-500">Tracking ID: DEL-2024-001</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            <PhoneCallIcon className="w-4 h-4 mr-2" /> Contact Driver
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
            View Route
          </button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-start flex-1">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Status</h2>
            <p className="mt-2 text-sm text-gray-500">Estimated Arrival</p>
            <p className="mt-1 font-semibold text-gray-900">2024-01-21 14:30</p>
          </div>
          <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
            in transit
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Info</h2>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                40×40
              </div>
              <div>
                <p className="font-medium text-gray-900">Michael Brown</p>
                <p className="text-sm text-gray-500">White Van • XYZ-789</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <PhoneCallIcon className="w-4 h-4 mr-1" /> (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Timeline</h2>
            <div className="flex flex-col space-y-6">
              {timeline.map((step, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1"></div>
                    {idx < timeline.length - 1 && <div className="w-px h-9 bg-gray-200"></div>}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.time}</p>
                    <p className="text-xs text-gray-500">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Donation Details</h2>
            <div className="border border-gray-200 rounded p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Type</p>
                <p className="font-medium text-gray-900">Fresh Produce</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Quantity</p>
                <p className="font-medium text-gray-900">50 lbs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-500 uppercase">Donor</p>
                <p className="font-medium text-gray-900">Local Farm Co</p>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-500 uppercase">Recipient</p>
                <p className="font-medium text-gray-900">Community Food Bank</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Route Information</h2>
          <div className="bg-gray-100 rounded h-48 mb-4" />
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>8.5 miles</span>
            <span>25 mins</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Local Farm Co</p>
                <p className="text-xs text-gray-500">123 Farm Road, Rural County</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center">
                B
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Community Food Bank</p>
                <p className="text-xs text-gray-500">456 Main Street, Urban City</p>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Checkpoints</h3>
            <ul className="space-y-2 text-sm">
              {checkpoints.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="flex items-center space-x-1 text-gray-900">
                    <span className={`${c.color} w-2 h-2 rounded-full`}></span>
                    <span>{c.label}</span>
                  </span>
                  <span className={`${c.statusColor} text-xs`}>{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
