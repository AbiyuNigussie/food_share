// src/pages/DeliveryDetails.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deliveryService } from "../services/deliveryService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Phone, MapPin, Truck, User, Clock, ArrowLeftIcon } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const formatDateTime = (iso: string | null) => {
  if (!iso) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const fallbackCenter = {
  lat: 9.03,
  lng: 38.74,
};

export const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDelivery = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const token = user?.token || "";
        const res = await deliveryService.getDeliveryById(token, id);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4" />
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

  // Compute coordinates for the map. If no lat/lng, use fallback.
  const pickupCoords = {
    lat: delivery.pickupLocation?.latitude ?? fallbackCenter.lat,
    lng: delivery.pickupLocation?.longitude ?? fallbackCenter.lng,
  };

  const dropoffCoords = {
    lat: delivery.dropoffLocation?.latitude ?? fallbackCenter.lat,
    lng: delivery.dropoffLocation?.longitude ?? fallbackCenter.lng,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 text-gray-800">
      <div className="max-w-[90rem] mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => navigate("/dashboard/deliveries")}
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-4xl font-bold tracking-tight ml-5">
                Delivery Details
              </span>
            </div>

            <p className="mt-2 text-base text-gray-500">
              Tracking ID:{" "}
              <span className="font-medium text-gray-700">{delivery.id}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              aria-label="Contact Driver"
              className="flex items-center gap-2 justify-center px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-xl shadow hover:bg-gray-100 transition"
              disabled={!delivery.logisticsStaff?.user?.phoneNumber}
            >
              <Phone className="w-4 h-4" />{" "}
              {delivery.logisticsStaff?.user?.phoneNumber
                ? "Contact Driver"
                : "No Driver Yet"}
            </button>
            <button
              onClick={() => navigate(`/tracking/${delivery.id}`)}
              type="button"
              aria-label="View Route"
              className="flex items-center gap-2 justify-center px-5 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
            >
              <MapPin className="w-4 h-4" /> View Route
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:auto-rows-fr items-stretch">
          {/* Status Card */}
          <div className="min-h-[260px] flex flex-col justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase">
              <Clock className="w-4 h-4" /> Status
            </div>
            <span className="self-start bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-1 rounded-full">
              {delivery.deliveryStatus}
            </span>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Scheduled For</p>
              <p className="text-lg font-semibold">
                {formatDateTime(delivery.scheduledDate)}
              </p>
            </div>
          </div>

          {/* Driver Info Card */}
          <div className="min-h-[260px] flex flex-col justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase">
              <Truck className="w-4 h-4" /> Driver Info
            </div>
            {delivery.logisticsStaff?.user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <Truck className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-lg font-semibold">
                    {delivery.logisticsStaff.user.firstName}{" "}
                    {delivery.logisticsStaff.user.lastName}
                  </p>
                  <p className="text-sm text-indigo-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />{" "}
                    {delivery.logisticsStaff.user.phoneNumber}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No driver assigned</p>
            )}
          </div>

          {/* Route Information Card */}
          <div className="lg:row-span-2 flex flex-col bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              <MapPin className="w-4 h-4" /> Route Information
            </div>

            <div className="flex-grow rounded-lg overflow-hidden">
              {delivery?.pickupLocation && delivery?.dropoffLocation && (
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={pickupCoords}
                    zoom={10}
                    options={{
                      fullscreenControl: false,
                      streetViewControl: false,
                    }}
                  >
                    <Marker position={pickupCoords} label="P" title="Pickup" />
                    <Marker
                      position={dropoffCoords}
                      label="D"
                      title="Dropoff"
                    />
                  </GoogleMap>
                </LoadScript>
              )}
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-700 mt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-600">Pickup Location</p>
                  <p>{delivery.pickupLocation?.label ?? "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-600">Dropoff Location</p>
                  <p>{delivery.dropoffLocation?.label ?? "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-lg p-6 gap-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase">
              <User className="w-4 h-4" /> Donation Details
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <p>
                <span className="font-medium text-gray-700">Type:</span>{" "}
                {delivery.donation.foodType}
              </p>
              <p>
                <span className="font-medium text-gray-700">Quantity:</span>{" "}
                {delivery.donation.quantity}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
              <div className="flex flex-col gap-1">
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Donor
                </p>
                <p className="text-gray-900 text-base font-medium">
                  {delivery.donation.donor?.user?.firstName ?? "N/A"}{" "}
                  {delivery.donation.donor?.user?.lastName ?? ""}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" />{" "}
                  {delivery.donation.donor?.user?.phoneNumber ?? "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Recipient
                </p>
                <p className="text-gray-900 text-base font-medium">
                  {delivery.donation.recipient?.user?.firstName ?? "N/A"}{" "}
                  {delivery.donation.recipient?.user?.lastName ?? ""}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" />{" "}
                  {delivery.donation.recipient?.user?.phoneNumber ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-medium text-gray-600 mb-1">Additional Notes</p>
              <p className="text-gray-800">
                {delivery.donation.notes?.trim() ||
                  "No additional notes provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
