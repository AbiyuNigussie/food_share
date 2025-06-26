import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  HomeIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  BarChart2Icon,
  SettingsIcon,
} from "lucide-react";

import { SideBar, NavItem } from "../SideBar";
import { StatCard } from "../StatCard";
import { Header } from "../Header";
import { useAuth } from "../../contexts/AuthContext";
import { deliveryService } from "../../services/deliveryService";
import { useNavigate } from "react-router";

interface Delivery {
  id: string;
  status:
    | "ASSIGNED"
    | "PICKUP_SCHEDULED"
    | "PICKED_UP"
    | "DROPOFF_SCHEDULED"
    | "DROPPED_OFF"
    | "DELIVERED"
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED";
  time: string;
  distance: string;
  pickup: { name: string; address: string };
  dropoff: { name: string; address: string };
  badge?: { text: string; color: string };
  actions: { label: string; variant: "primary" | "outline" }[];
}

const stats = [
  { label: "Total Deliveries Today", value: 45 },
  { label: "Average Delivery Time (min)", value: 28 },
  { label: "Total Distance (mi)", value: 142 },
];

const statusColors: Record<string, string> = {
  ASSIGNED: "bg-blue-400",
  PICKUP_SCHEDULED: "bg-yellow-400",
  PICKED_UP: "bg-orange-400",
  DROPOFF_SCHEDULED: "bg-teal-400",
  DROPPED_OFF: "bg-green-400",
  DELIVERED: "bg-purple-600",
  PENDING: "bg-gray-400",
  IN_PROGRESS: "bg-yellow-400",
  COMPLETED: "bg-purple-600",
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "#" },
  {
    label: "Deliveries",
    icon: <TruckIcon className="w-5 h-5" />,
    href: "deliveries",
  },
  { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, href: "/dashboard/settings" },
];

export const Logistics: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"pickup" | "dropoff" | null>(null);
  const [modalDelivery, setModalDelivery] = useState<Delivery | null>(null);
  const [modalDatetime, setModalDatetime] = useState("");

  const openScheduleModal = (
    delivery: Delivery,
    type: "pickup" | "dropoff"
  ) => {
    setModalDelivery(delivery);
    setModalType(type);
    setModalDatetime("");
    setModalOpen(true);
  };

  // Fetch deliveries from backend
  const fetchDeliveries = async () => {
    try {
      const res = await deliveryService.getLogisticDeliveries(
        user?.token || ""
      );
      const mapped = (res.data.data || [])
        .filter((d: any) => d.deliveryStatus !== "PENDING")
        .map((d: any) => ({
          id: d.id,
          status: d.deliveryStatus,
          time: d.scheduledPickup
            ? `Pickup: ${new Date(d.scheduledPickup).toLocaleString()}`
            : "No pickup scheduled",
          distance: d.pickupLocation && d.dropoffLocation ? "" : "N/A",
          pickup: {
            name: d.pickupLocation?.label || "Unknown",
            address: d.pickupLocation?.label || "",
          },
          dropoff: {
            name: d.dropoffLocation?.label || "Unknown",
            address: d.dropoffLocation?.label || "",
          },
          badge: getBadgeForStatus(d.deliveryStatus),
          actions: getActionsForStatus(d.deliveryStatus),
        }));
      setDeliveries(mapped);
    } catch (err) {
      setDeliveries([]);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line
  }, [user]);

  const handleModalSubmit = async () => {
    if (!modalDelivery || !modalDatetime) return;
    setLoadingId(modalDelivery.id);
    try {
      if (modalType === "pickup") {
        await deliveryService.schedulePickup(
          user?.token || "",
          modalDelivery.id,
          modalDatetime
        );
      } else if (modalType === "dropoff") {
        await deliveryService.scheduleDropoff(
          user?.token || "",
          modalDelivery.id,
          modalDatetime
        );
      }
      setModalOpen(false);
      await fetchDeliveries();
    } catch (err) {
      alert("Failed to schedule");
    } finally {
      setLoadingId(null);
    }
  };
  // Button action handlers
  const handleAction = async (delivery: Delivery, actionLabel: string) => {
    setLoadingId(delivery.id);
    try {
      switch (actionLabel) {
        case "Schedule Pickup": {
          openScheduleModal(delivery, "pickup");
          setLoadingId(null);
          return;
        }
        case "Complete Pickup": {
          await deliveryService.completePickup(user?.token || "", delivery.id);
          break;
        }
        case "Schedule Dropoff": {
          openScheduleModal(delivery, "dropoff");
          setLoadingId(null);
          return;
        }
        case "Complete Dropoff": {
          await deliveryService.completeDropoff(user?.token || "", delivery.id);
          break;
        }
        case "Complete Delivery": {
          await deliveryService.completeDelivery(
            user?.token || "",
            delivery.id
          );
          break;
        }
        case "View Details": {
          window.location.href = `/deliveries/${delivery.id}`;
          break;
        }
        default:
          break;
      }
      await fetchDeliveries();
    } catch (err) {
      alert("Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  function getActionsForStatus(status: string) {
    switch (status) {
      case "ASSIGNED":
        return [{ label: "Schedule Pickup", variant: "primary" }];
      case "PICKUP_SCHEDULED":
        return [{ label: "Complete Pickup", variant: "primary" }];
      case "PICKED_UP":
        return [{ label: "Schedule Dropoff", variant: "primary" }];
      case "DROPOFF_SCHEDULED":
        return [{ label: "Complete Dropoff", variant: "primary" }];
      case "DROPPED_OFF":
        return [{ label: "Complete Delivery", variant: "primary" }];
      case "DELIVERED":
      case "COMPLETED":
        return [{ label: "View Details", variant: "outline" }];
      default:
        return [{ label: "View Details", variant: "outline" }];
    }
  }

  function getBadgeForStatus(status: string) {
    switch (status) {
      case "ASSIGNED":
        return { text: "Assigned", color: "bg-blue-100 text-blue-700" };
      case "PICKUP_SCHEDULED":
        return {
          text: "Pickup Scheduled",
          color: "bg-yellow-100 text-yellow-700",
        };
      case "PICKED_UP":
        return { text: "Picked Up", color: "bg-orange-100 text-orange-700" };
      case "DROPOFF_SCHEDULED":
        return {
          text: "Dropoff Scheduled",
          color: "bg-teal-100 text-teal-700",
        };
      case "DROPPED_OFF":
        return { text: "Dropped Off", color: "bg-green-100 text-green-700" };
      case "DELIVERED":
      case "COMPLETED":
        return { text: "Delivered", color: "bg-purple-100 text-purple-700" };
      default:
        return undefined;
    }
  }

  const Button: React.FC<{
    variant: "primary" | "outline";
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }> = ({ variant, children, onClick, disabled }) => {
    const base = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
    const styles =
      variant === "primary"
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "border border-gray-300 text-gray-700 hover:bg-gray-50";
    return (
      <button
        className={`${base} ${styles} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Logistics Portal"
        logoIcon={<TruckIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email || "" }}
      />
      <main
        className={clsx(
          "p-8 min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Logistics Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
          <div className="space-y-6">
            {deliveries.map((d, idx) => (
              <div
                key={d.id || idx}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusColors[d.status] || "bg-gray-400"
                      }`}
                    />
                    <span className="text-gray-700 font-medium">
                      {d.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {d.badge && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${d.badge.color}`}
                    >
                      {d.badge.text}
                    </span>
                  )}
                </div>

                <div className="text-gray-500 text-sm mb-4">
                  {d.time} {d.distance && <>• {d.distance}</>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Pickup</p>
                    <p className="font-medium text-gray-900">{d.pickup.name}</p>
                    <p className="text-gray-500 text-sm">{d.pickup.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Dropoff</p>
                    <p className="font-medium text-gray-900">
                      {d.dropoff.name}
                    </p>
                    <p className="text-gray-500 text-sm">{d.dropoff.address}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {d.actions.map((action, aidx) => (
                    <>
                      <Button
                        key={aidx}
                        variant={action.variant}
                        onClick={() => handleAction(d, action.label)}
                        disabled={loadingId === d.id}
                      >
                        {loadingId === d.id ? "Processing..." : action.label}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/dashboard/deliveries/delivery-details/${d.id}`
                          )
                        }
                      >
                        View Details
                      </Button>
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {modalType === "pickup" ? "Schedule Pickup" : "Schedule Dropoff"}
            </h2>
            <label className="block mb-2">
              {modalType === "pickup" ? "Pickup Time" : "Dropoff Time"}
            </label>
            <input
              type="datetime-local"
              value={modalDatetime}
              onChange={(e) => setModalDatetime(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 rounded bg-purple-600 text-white"
                disabled={!modalDatetime}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
