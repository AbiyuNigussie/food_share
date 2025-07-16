import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  MapIcon,
  SatelliteIcon,
  TrafficCone,
  HomeIcon,
} from "lucide-react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  TrafficLayer,
} from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router";
import { deliveryService } from "../services/deliveryService";
import { useAuth } from "../contexts/AuthContext";
import LocationCard from "../components/tracking/LocationCard";
import Tab from "../components/tracking/Tab";
import InfoCard from "../components/tracking/InfoCard";
import DriverInfo from "../components/tracking/DriverInfo";
import SectionTitle from "../components/tracking/SectionTitle";
import TimelineAccordion from "../components/TimelineAccordion";

export const LiveTrackingPage: React.FC = () => {
  const [tab, setTab] = useState<"default" | "satellite" | "traffic">(
    "default"
  );
  const [delivery, setDelivery] = useState<any>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const pickup = useMemo(() => {
    if (!delivery) return null;
    return {
      lat: delivery.pickupLocation.latitude,
      lng: delivery.pickupLocation.longitude,
    };
  }, [delivery]);

  const dropoff = useMemo(() => {
    if (!delivery) return null;
    return {
      lat: delivery.dropoffLocation.latitude,
      lng: delivery.dropoffLocation.longitude,
    };
  }, [delivery]);

  const mapOptions = useMemo(
    () => ({
      center: pickup,
      mapTypeId: tab === "satellite" ? "satellite" : "roadmap",
      disableDefaultUI: true, // Enable Google Maps built-in UI
    }),
    [pickup, tab]
  );

  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        if (!user?.token || !id) return;
        const response = await deliveryService.getDeliveryById(user.token, id);
        setDelivery(response.data);
      } catch (error) {
        console.error("Failed to fetch delivery:", error);
      }
    };

    if (user && id) {
      fetchDelivery();
    }
  }, [user, id]);

  useEffect(() => {
    if (!mapApiLoaded) return;

    const directionsService = new google.maps.DirectionsService();
    if (pickup && dropoff) {
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);

            // ✅ Extract and set distance
            const leg = result.routes[0].legs[0];
            if (leg?.distance?.text) {
              setDistance(leg.distance.text);
            }
            if (leg?.duration?.text) {
              setDuration(leg.duration.text);
            }

            if (mapRef) {
              const bounds = new google.maps.LatLngBounds();
              result.routes[0].legs.forEach((leg) => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
              });
              mapRef.fitBounds(bounds);
            }
          } else {
            console.error("Directions request failed", result);
          }
        }
      );
    }
  }, [mapApiLoaded, pickup, dropoff, mapRef]);

  const onLoadMap = (mapInstance: google.maps.Map) => {
    setMapRef(mapInstance);
    setMapApiLoaded(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-96 p-6 space-y-6 overflow-y-auto">
        <button
          onClick={() =>
            navigate(`/dashboard/deliveries/delivery-details/${delivery.id}`)
          }
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Live Tracking</span>
        </button>
        {delivery && (
          <p className="text-xs text-gray-500">
            Tracking ID: <span className="font-medium">{delivery.id}</span>
          </p>
        )}

        <div className="flex space-x-2">
          <Tab
            icon={MapIcon}
            label="Default"
            active={tab === "default"}
            onClick={() => setTab("default")}
          />
          <Tab
            icon={SatelliteIcon}
            label="Satellite"
            active={tab === "satellite"}
            onClick={() => setTab("satellite")}
          />
          <Tab
            icon={TrafficCone}
            label="Traffic"
            active={tab === "traffic"}
            onClick={() => setTab("traffic")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard title="Time" value={duration || "Calculating..."} />

          <InfoCard title="Distance" value={distance || "Calculating..."} />
        </div>
        {delivery ? (
          delivery.logisticsStaff ? (
            <DriverInfo
              name={
                delivery.logisticsStaff.user.firstName +
                " " +
                delivery.logisticsStaff.user.lastName
              }
              vehicle="AA12343"
              onContact={() => alert("Contacting driver…")}
            />
          ) : (
            <DriverInfo
              name="Not Assigned Yet"
              vehicle="N/A"
              onContact={() => alert("Contacting driver…")}
            />
          )
        ) : null}

        <div className="space-y-2">
          <SectionTitle>Route Details</SectionTitle>
          {delivery?.pickupLocation && (
            <LocationCard
              icon={<MapIcon className="w-5 h-5 text-purple-600" />}
              title={delivery.pickupLocation.label}
              address="123 Farm Road, Rural County"
            />
          )}
          {delivery?.dropoffLocation && (
            <LocationCard
              icon={<HomeIcon className="w-5 h-5 text-purple-600" />}
              title={delivery.dropoffLocation.label}
              address="456 Main Street, Urban City"
            />
          )}
        </div>

        <div className="space-y-2 mb-6">
          <SectionTitle>Timeline</SectionTitle>
          <TimelineAccordion events={delivery?.timeline ?? []} />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
          onLoad={() => setMapApiLoaded(true)}
        >
          {pickup && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={mapOptions}
              center={pickup}
              onLoad={onLoadMap}
            >
              {directions && <DirectionsRenderer directions={directions} />}
              {tab === "traffic" && <TrafficLayer />}
            </GoogleMap>
          )}
        </LoadScript>
      </div>
    </div>
  );
};
