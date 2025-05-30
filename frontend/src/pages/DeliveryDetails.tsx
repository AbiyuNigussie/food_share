import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deliveryService } from "../services/deliveryService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDelivery = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const token = user?.token || "";
        const res = await deliveryService.getDeliveryById(token, id);
        console.log("Fetched delivery:", res.data);
        setDelivery(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching delivery details");
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id, user?.token]);

  // Debug: show raw JSON if loaded but UI blank
  if (!loading && delivery && Object.keys(delivery).length === 0) {
    return (
      <pre className="p-4 bg-red-100 text-red-800">
        Empty delivery object received: {JSON.stringify(delivery, null, 2)}
      </pre>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg text-gray-600">Loading delivery details...</p>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-xl text-gray-500">No delivery found with this ID.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Delivery Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Tracking ID:{" "}
              <span className="font-medium text-gray-700">{delivery.id}</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition">
              📞 Contact Driver
            </button>
            <button className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
              View Route
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500">
              Status
            </h2>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              {delivery.status}
            </span>
            <div>
              <p className="text-sm text-gray-500">Estimated Arrival</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">
                {new Date(
                  delivery.estimatedArrival || delivery.date
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500">
              Driver Info
            </h2>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                🚚
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {delivery.driver?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {delivery.driver?.vehicle}
                </p>
                <p className="text-sm text-indigo-600">
                  {delivery.driver?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Route Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500">
              Route Information
            </h2>
            <div className="bg-gray-100 h-40 rounded-lg" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{delivery.route?.distance || 0} miles</span>
              <span>{delivery.route?.duration || 0} mins</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                📍 <strong>{delivery.route?.origin?.name}</strong> -{" "}
                {delivery.route?.origin?.address}
              </li>
              <li>
                🏁 <strong>{delivery.route?.destination?.name}</strong> -{" "}
                {delivery.route?.destination?.address}
              </li>
            </ul>
            <div className="space-y-1 text-sm">
              {delivery.checkpoints?.map((cp: any, idx: number) => (
                <p key={idx} className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      cp.status === "completed"
                        ? "bg-purple-600"
                        : cp.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {cp.name} -{" "}
                  <span className="capitalize text-gray-600">
                    {cp.status.replace("_", " ")}
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* Timeline Card (span 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-sm font-semibold uppercase text-gray-500">
              Delivery Timeline
            </h2>
            <ul className="space-y-6">
              {delivery.timeline?.map((event: any, i: number) => (
                <li key={i} className="flex space-x-4">
                  <div className="h-3 w-3 mt-1 rounded-full bg-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.time} - {event.details}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Donation Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-sm font-semibold uppercase text-gray-500">
              Donation Details
            </h2>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Type:</strong> {delivery.donation.foodType}
              </p>
              <p className="text-sm">
                <strong>Quantity:</strong> {delivery.donation.quantity}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Donor</p>
                <p className="text-gray-800 font-medium">
                  {`${delivery.donation.donor?.user.firstName} ${delivery.donation.donor?.user.firstName}`}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Recipient</p>
                <p className="text-gray-800 font-medium">
                  {delivery.recipient?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
