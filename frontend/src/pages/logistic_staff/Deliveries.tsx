import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import PaginationControls from "../../components/PaginationControl";
import { Header } from "../../components/Header";
import { NavItem, SideBar } from "../../components/SideBar";
import {
  BarChart2Icon,
  GiftIcon,
  HomeIcon,
  MapPinIcon,
  SettingsIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { deliveryService } from "../../services/deliveryService";
import { useNavigate } from "react-router";
import { Location } from "../../types";

type DeliveryStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED";

interface Delivery {
  id: string;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  updatedAt: string;
}

const statusColors: Record<DeliveryStatus, string> = {
  PENDING: "lowercase bg-gray-100 text-gray-600",
  IN_PROGRESS: "lowercase bg-yellow-100 text-yellow-800",
  DELIVERED: "lowercase bg-purple-100 text-purple-800",
};

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<DeliveryStatus | "All">("PENDING");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 5;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/dashboard",
    },
    { label: "Deliveries", icon: <TruckIcon className="w-5 h-5" />, href: "#" },
    { label: "Routes", icon: <MapPinIcon className="w-5 h-5" />, href: "#" },
    { label: "Drivers", icon: <UserIcon className="w-5 h-5" />, href: "#" },
    {
      label: "Reports",
      icon: <BarChart2Icon className="w-5 h-5" />,
      href: "#",
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "#",
    },
  ];

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const token = user?.token || "";
        const statusFilter =
          filter === "All" ? undefined : filter.toLowerCase().replace(" ", "_");
        const response = await deliveryService.getLogisticDeliveries(token, {
          page,
          rowsPerPage,
          status: statusFilter,
        });

        setDeliveries(response.data?.data || []);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Failed to fetch deliveries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [page, rowsPerPage, filter]);

  const paginated = deliveries;

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        title="DonorX"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{ name: "Jane Doe", email: "jane@donorx.org" }}
      />
      <main
        className={clsx(
          "p-8 bg-gray-50 min-h-screen transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="Deliveries" />
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Deliveries List</h2>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border rounded-md bg-white"
          >
            {["All", "Pending", "In Progress", "Completed"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Time", "Pickup", "Dropoff", "Status", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading deliveries...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No deliveries found
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="text-sm text-gray-500">
                        {row.pickupLocation.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="text-sm text-gray-500">
                        {row.pickupLocation.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          statusColors[row.deliveryStatus]
                        )}
                      >
                        {row.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="text-purple-600 hover:underline text-sm"
                        onClick={() => navigate(`delivery-details/${row.id}`)}
                      >
                        View
                      </button>
                      {row.deliveryStatus === "PENDING" && (
                        <button className="text-green-600 hover:underline text-sm">
                          Start
                        </button>
                      )}
                      {row.deliveryStatus === "IN_PROGRESS" && (
                        <button className="text-blue-600 hover:underline text-sm">
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>
    </>
  );
};
