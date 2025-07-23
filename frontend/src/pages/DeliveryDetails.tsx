import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deliveryService } from "../services/deliveryService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  Phone,
  MapPin,
  Truck,
  User,
  Clock,
  ArrowLeft,
  Package,
  AlertCircle,
  Info,
  Navigation,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { DeliveryTimelineEvent } from "../types";

const formatDateTime = (iso: string | null) => {
  if (!iso) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
};

const fallbackCenter = {
  lat: 9.03,
  lng: 38.74,
};

const statusIcons = {
  DELIVERED: <CheckCircle className="w-5 h-5 text-green-500" />,
  CANCELLED: <XCircle className="w-5 h-5 text-red-500" />,
  default: <ClockIcon className="w-5 h-5 text-yellow-500" />,
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
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
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

  const StatusIcon =
    statusIcons[delivery.deliveryStatus as keyof typeof statusIcons] ||
    statusIcons.default;

  const location = useLocation();

 const handleGoBack = () => {
  if (window.history.state && window.history.state.idx > 0) {
    navigate(-1);
  } else {
    navigate('/', { replace: true }); // Reset history
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Delivery Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Tracking ID:{" "}
                <span className="font-medium text-gray-700">{delivery.id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/tracking/${delivery.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              View Route
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    delivery.deliveryStatus === "DELIVERED"
                      ? "bg-green-50 text-green-600"
                      : delivery.deliveryStatus === "CANCELLED"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {StatusIcon}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </h3>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      delivery.deliveryStatus === "DELIVERED"
                        ? "text-green-700"
                        : delivery.deliveryStatus === "CANCELLED"
                        ? "text-red-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {delivery.deliveryStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="bg-white rounded-xl shadow-sm p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Donation Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Food Type</p>
                    <p className="text-sm">{delivery.donation.foodType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm">{delivery.donation.quantity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Available From</p>
                    <p className="text-sm">
                      {formatDateTime(delivery.donation.availableFrom)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available To</p>
                    <p className="text-sm">
                      {formatDateTime(delivery.donation.availableTo)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm">
                    {formatDateTime(delivery.donation.expiryDate)}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                        <User className="w-4 h-4" /> Donor
                      </h4>
                      <p className="text-sm">
                        {delivery.donation.donor?.user?.firstName || "N/A"}{" "}
                        {delivery.donation.donor?.user?.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {delivery.donation.donor?.user?.phoneNumber || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {delivery.donation.donor?.address || "No address"}
                      </p>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                        <User className="w-4 h-4" /> Recipient
                      </h4>
                      <p className="text-sm">
                        {delivery.donation.recipient?.user?.firstName || "N/A"}{" "}
                        {delivery.donation.recipient?.user?.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {delivery.donation.recipient?.user?.phoneNumber ||
                          "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {delivery.donation.recipient?.address || "No address"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Info className="w-4 h-4" /> Additional Notes
                  </h4>
                  <p className="text-sm text-gray-700">
                    {delivery.donation.notes?.trim() ||
                      "No additional notes provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Driver Info */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Driver Information
                </h2>
              </div>

              {delivery.logisticsStaff?.user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm">
                      {delivery.logisticsStaff.user.firstName}{" "}
                      {delivery.logisticsStaff.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {delivery.logisticsStaff.user.phoneNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No driver assigned yet
                  </p>
                </div>
              )}
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Delivery Timeline
                </h2>
              </div>

              {delivery.timeline?.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <ul className="space-y-4">
                    {delivery.timeline.map((event: DeliveryTimelineEvent) => (
                      <li key={event.id} className="relative pl-8">
                        <div className="absolute left-[19px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-4 border-indigo-100"></div>

                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between">
                            <p className="text-gray-800 lowercase">
                              {event.status.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>

                          {event.note && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {event.note}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No timeline events yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Map and Locations */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Route Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden h-48 bg-gray-100">
                  {delivery?.pickupLocation && delivery?.dropoffLocation && (
                    <LoadScript
                      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                    >
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={pickupCoords}
                        zoom={10}
                      >
                        <Marker position={pickupCoords} label="P" />
                        <Marker position={dropoffCoords} label="D" />
                      </GoogleMap>
                    </LoadScript>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Pickup Location
                      </p>
                      <p className="text-sm">
                        {delivery.pickupLocation?.label || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        D
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Dropoff Location
                      </p>
                      <p className="text-sm">
                        {delivery.dropoffLocation?.label || "Unknown"}
                      </p>
                    </div>
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
