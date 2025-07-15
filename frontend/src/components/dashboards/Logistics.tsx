// src/pages/LogisticsDashboard.tsx
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { HomeIcon, TruckIcon, BarChart2Icon, SettingsIcon } from "lucide-react";

import { SideBar, NavItem } from "../SideBar";
import { StatCard } from "../StatCard";
import { Header } from "../Header";
import { useAuth } from "../../contexts/AuthContext";
import { deliveryService } from "../../services/deliveryService";
import { useNavigate } from "react-router";

interface Delivery {
  id: string;
  deliveryStatus:
    | "ASSIGNED"
    | "PICKUP_SCHEDULED"
    | "PICKED_UP"
    | "DROPOFF_SCHEDULED"
    | "DROPPED_OFF"
    | "DELIVERED"
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED";
  scheduledPickup?: string;
  pickupLocation?: { label: string };
  dropoffLocation?: { label: string };
  badge?: { text: string; color: string };
  actions: { label: string; variant: "primary" | "outline" }[];
}

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

export const Logistics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token || "";
  const [stat] = useState<{ month: string; volume: number }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [modalType, setModalType] = useState<"pickup" | "dropoff" | null>(null);
  const [modalDelivery, setModalDelivery] = useState<Delivery | null>(null);
  const [modalDatetime, setModalDatetime] = useState("");

  // 1) Fetch all non‑PENDING deliveries
  const fetchDeliveries = async () => {
    try {
      const res = await deliveryService.getLogisticDeliveries(token);
      const mapped = (res.data.data || [])
        .filter((d: Delivery) => d.deliveryStatus !== "PENDING")
        .map((d: any) => ({
          id: d.id,
          deliveryStatus: d.deliveryStatus,
          scheduledPickup: d.scheduledPickup,
          pickupLocation: d.pickupLocation,
          dropoffLocation: d.dropoffLocation,
          badge: getBadgeForStatus(d.deliveryStatus),
          actions: getActionsForStatus(d.deliveryStatus),
        }));
      setDeliveries(mapped);
    } catch {
      setDeliveries([]);
    }
  };

  // 2) Count how many are DELIVERED
  const fetchCompletedCount = async () => {
    try {
      const res = await deliveryService.getMyDeliveries(token, {
        status: "DELIVERED",
        page: 1,
        rowsPerPage: 1,
      });
      setCompletedCount(res.data.total);
    } catch {
      setCompletedCount(0);
    }
  };

  // 3) Count pending deliveries
  const fetchPendingCount = async () => {
    try {
      const res = await deliveryService.getLogisticDeliveries(token, {
        status: "PENDING",
        page: 1,
        rowsPerPage: 1,
      });
      setPendingCount(res.data.total);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchCompletedCount();
    fetchPendingCount();
    // eslint-disable-next-line
  }, [token]);

  // modal & actions (unchanged)
  const openScheduleModal = (
    delivery: Delivery,
    type: "pickup" | "dropoff"
  ) => {
    setModalDelivery(delivery);
    setModalType(type);
    setModalDatetime("");
    setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!modalDelivery || !modalDatetime) return;
    setLoadingId(modalDelivery.id);
    try {
      if (modalType === "pickup") {
        await deliveryService.schedulePickup(
          token,
          modalDelivery.id,
          modalDatetime
        );
      } else {
        await deliveryService.scheduleDropoff(
          token,
          modalDelivery.id,
          modalDatetime
        );
      }
      setModalOpen(false);
      await fetchDeliveries();
      await fetchCompletedCount();
    } finally {
      setLoadingId(null);
    }
  };

  const handleAction = async (d: Delivery, label: string) => {
    setLoadingId(d.id);
    try {
      switch (label) {
        case "Schedule Pickup":
          return openScheduleModal(d, "pickup");
        case "Complete Pickup":
          await deliveryService.completePickup(token, d.id);
          break;
        case "Schedule Dropoff":
          return openScheduleModal(d, "dropoff");
        case "Complete Dropoff":
          await deliveryService.completeDropoff(token, d.id);
          break;
        case "Complete Delivery":
          await deliveryService.completeDelivery(token, d.id);
          break;
        case "View Details":
          navigate(`/dashboard/deliveries/delivery-details/${d.id}`);
          return;
      }
      await fetchDeliveries();
      await fetchCompletedCount();
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
        return { text: "Delivered", color: "bg-purple-100 text-purple-700" };
      default:
        return undefined;
    }
  }

  const Button: React.FC<{
    variant: "primary" | "outline";
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }> = ({ variant, onClick, disabled, children }) => {
    const base = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
    const style =
      variant === "primary"
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "border border-gray-300 text-gray-700 hover:bg-gray-50";
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${style} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {children}
      </button>
    );
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <HomeIcon />, href: "/dashboard" },
    {
      label: "Deliveries",
      icon: <TruckIcon />,
      href: "/dashboard/deliveries",
    },
    {
      label: "My Deliveries",
      icon: <BarChart2Icon />,
      href: "/dashboard/my-deliveries",
    },
    { label: "Settings", icon: <SettingsIcon />, href: "/dashboard/settings" },
  ];

  const volumes = stat.map((s) => s.volume);
  const stats = [
    { label: "Pending Deliveries", value: pendingCount },
    {
      label: "Active Deliveries",
      value: deliveries.length,
    },
    {
      label: "Completed Deliveries",
      value: completedCount,
      max: 100,
      trendData: volumes,
    },
  ];

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Logistics Portal"
        logoIcon={<TruckIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={clsx(
          "p-8 min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="LOGISTICS DASHBOARD" />

        {/* 🔥 NEW STAT CARDS ADDED 🔥 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, max, trendData }) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              max={max}
              trendData={trendData}
            />
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
                        statusColors[d.deliveryStatus] || "bg-gray-400"
                      }`}
                    />
                    <span className="text-gray-700 font-medium">
                      {d.deliveryStatus.replace(/_/g, " ")}
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
                  {d.scheduledPickup
                    ? `Pickup: ${new Date(d.scheduledPickup).toLocaleString()}`
                    : "No pickup scheduled"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Pickup</p>
                    <p className="font-medium text-gray-900">
                      {d.pickupLocation?.label || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Dropoff</p>
                    <p className="font-medium text-gray-900">
                      {d.dropoffLocation?.label || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {d.actions.map((action, aidx) => (
                    <React.Fragment key={aidx}>
                      <Button
                        variant={action.variant}
                        onClick={() => handleAction(d, action.label)}
                        disabled={loadingId === d.id}
                      >
                        {loadingId === d.id ? "Processing..." : action.label}
                      </Button>
                      {action.label !== "View Details" && (
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
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule modal (unchanged) */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                {modalType === "pickup"
                  ? "Schedule Pickup"
                  : "Schedule Dropoff"}
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
      </main>
    </>
  );
};
