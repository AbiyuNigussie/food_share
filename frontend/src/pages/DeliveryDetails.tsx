// src/pages/DeliveryDetails.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deliveryService } from "../services/deliveryService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Phone, MapPin, Truck, User, Clock, ArrowLeftIcon } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { DeliveryTimelineEvent } from "../types";

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
      <div className="max-w-[90rem] mx-auto space-y-16 px-4 sm:px-6 lg:px-8 h-full">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start h-full">
          {/* Left Column */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 h-full">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-2 flex items-center gap-4">
              <div
                className={`
    flex items-center justify-center h-12 w-12 rounded-full
    ${
      delivery.deliveryStatus === "DELIVERED"
        ? "bg-green-100"
        : delivery.deliveryStatus === "CANCELLED"
        ? "bg-red-100"
        : "bg-yellow-100"
    }
  `}
              >
                <Clock
                  className={`
      w-6 h-6
      ${
        delivery.deliveryStatus === "DELIVERED"
          ? "text-green-600"
          : delivery.deliveryStatus === "CANCELLED"
          ? "text-red-600"
          : "text-yellow-600"
      }
    `}
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-1">
                  Status
                </div>
                <span
                  className={`
      px-4 py-1 rounded-full text-xs md:text-sm font-bold w-fit
      ${
        delivery.deliveryStatus === "DELIVERED"
          ? "bg-green-100 text-green-800"
          : delivery.deliveryStatus === "CANCELLED"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }
    `}
                >
                  {delivery.deliveryStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Donation Details */}
            <div className="flex flex-col bg-white rounded-2xl shadow-lg p-4 md:p-6 gap-6 md:gap-8">
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase">
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
                <p>
                  <span className="font-medium text-gray-700">
                    Available From:
                  </span>{" "}
                  {formatDateTime(delivery.donation.availableFrom)}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Available To:
                  </span>{" "}
                  {formatDateTime(delivery.donation.availableTo)}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Expiry Date:
                  </span>{" "}
                  {formatDateTime(delivery.donation.expiryDate)}
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
                  <p className="text-gray-500">
                    {delivery.donation.donor?.address ?? "No address"}
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
                  <p className="text-gray-500">
                    {delivery.donation.recipient?.address ?? "No address"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium text-gray-600 mb-1">
                  Additional Notes
                </p>
                <p className="text-gray-800">
                  {delivery.donation.notes?.trim() ||
                    "No additional notes provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 h-full">
            {/* Driver Info */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-2">
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase">
                <Truck className="w-4 h-4" /> Driver Info
              </div>
              {delivery.logisticsStaff?.user ? (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-100">
                    <Truck className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base md:text-lg font-semibold">
                      {delivery.logisticsStaff.user.firstName}{" "}
                      {delivery.logisticsStaff.user.lastName}
                    </p>
                    <p className="text-xs md:text-sm text-indigo-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{" "}
                      {delivery.logisticsStaff.user.phoneNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs md:text-sm text-gray-500 mt-2">
                  No driver assigned
                </p>
              )}
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-y-auto h-95">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                Delivery Timeline
              </h3>
              <ul className="space-y-2">
                {delivery.timeline && delivery.timeline.length > 0 ? (
                  delivery.timeline.map((event: DeliveryTimelineEvent) => (
                    <li key={event.id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      <span className="font-medium">
                        {event.status.replace(/_/g, " ")}
                      </span>
                      {event.note && (
                        <span className="text-gray-400 text-xs">
                          ({event.note})
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm">
                    No timeline events yet.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Route Info */}
          <div className="h-130 bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 md:mb-4">
              <MapPin className="w-4 h-4" /> Route Information
            </div>

            <div className="flex-grow rounded-lg min-h-[180px] overflow-hidden">
              {delivery?.pickupLocation && delivery?.dropoffLocation && (
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                >
                  <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={pickupCoords}
                      zoom={10}
                    >
                      <Marker position={pickupCoords} label="P" />
                      <Marker position={dropoffCoords} label="D" />
                    </GoogleMap>
                  </div>
                </LoadScript>
              )}
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
                    <p className="font-medium text-gray-600">
                      Dropoff Location
                    </p>
                    <p>{delivery.dropoffLocation?.label ?? "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
