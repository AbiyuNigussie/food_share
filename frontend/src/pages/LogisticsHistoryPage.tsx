// src/pages/LogisticsHistoryPage.tsx
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { SideBar, NavItem } from "../components/SideBar";
import PaginationControls from "../components/PaginationControl";
import { Header } from "../components/Header";
import {
  HomeIcon,
  TruckIcon,
  SettingsIcon,
  ClockIcon,
  UserIcon,
  PackageIcon,
  MapPinIcon,
  BarChart2Icon,
} from "lucide-react";

interface HistoryRow {
  id: string;
  deliveredAt: string;
  deliveryStatus: string;
  donation: {
    quantity: number;
    donor: { user: { firstName: string; lastName: string } };
    recipient?: { user: { firstName: string; lastName: string } } | null;
  };
  pickupLocation?: { label: string } | null;
  dropoffLocation?: { label: string } | null;
}

export const LogisticsHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const navItems: NavItem[] = [
   { label: "Dashboard",  icon: <HomeIcon className="w-5 h-5" />,             href: "/dashboard" },
   { label: "Deliveries", icon: <TruckIcon className="w-5 h-5" />,            href: "/dashboard/deliveries" },
   { label: "My Deliveries", icon: <BarChart2Icon className="w-5 h-5" />,     href: "/dashboard/my-deliveries" },
   { label: "Settings",   icon: <SettingsIcon className="w-5 h-5" />,         href: "/dashboard/settings" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getMyDeliveries(
          token,
          page,
          perPage
        );
        setRows(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, page]);

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Logistics Portal"
        navItems={navItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={clsx(
          "min-h-screen  bg-gradient-to-br from-purple-200 via-white to-indigo-100  border-purple-200 p-6 transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="My Deliveries" />

        {rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No completed deliveries yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
              >
                {/* Delivered at */}
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {new Date(r.deliveredAt).toLocaleString()}
                </div>

                {/* Donor & Recipient */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-gray-800 text-sm font-medium">
                      Donor:
                    </span>
                    <span className="ml-1 text-gray-600 text-sm">
                      {r.donation.donor.user.firstName}{" "}
                      {r.donation.donor.user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-800 text-sm font-medium">
                      Recipient:
                    </span>
                    <span className="ml-1 text-gray-600 text-sm">
                      {r.donation.recipient?.user
                        ? `${r.donation.recipient.user.firstName} ${r.donation.recipient.user.lastName}`
                        : "—"}
                    </span>
                  </div>
                </div>
                
                {/* Route */}
                <div className="flex items-center mb-4">
                  <MapPinIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-800 text-sm font-medium">
                    Route:
                  </span>
                  <span className="ml-1 text-gray-600 text-sm">
                    {r.pickupLocation?.label || "Unknown"} →{" "}
                    {r.dropoffLocation?.label || "Unknown"}
                  </span>
                </div>

                {/* Status */}
                <div className="mt-auto">
                  <span
                    className={clsx(
                      "px-3 py-1 inline-block text-xs font-semibold rounded-full",
                      r.deliveryStatus === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {r.deliveryStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between py-6">
          <span className="text-sm text-gray-700">
            {rows.length
              ? `Showing ${(page - 1) * perPage + 1}–${Math.min(
                  page * perPage,
                  total
                )} of ${total}`
              : ""}
          </span>
          <PaginationControls
            page={page}
            rowsPerPage={perPage}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </main>
    </>
  );
};
