// src/pages/DonorDonationsPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  GiftIcon,
  TruckIcon,
  HomeIcon,
  BarChart2Icon,
  UserIcon,
  SettingsIcon,
} from "lucide-react";
import PaginationControls from "../components/PaginationControl";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";

const donorNavItems = [
  { label: "Dashboard",    icon: <HomeIcon className="w-5 h-5" />,           href: "/dashboard" },
  { label: "My Donations", icon: <GiftIcon className="w-5 h-5" />,          href: "/dashboard/Donor-Donations" },
  { label: "Insights",     icon: <BarChart2Icon className="w-5 h-5" />,     href: "/dashboard/donor-insights" },
  { label: "Settings",     icon: <SettingsIcon className="w-5 h-5" />,       href: "/dashboard/settings" },
];

export const DonorDonationsPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // === Matched ===
  const [matched, setMatched] = useState<any[]>([]);
  const [matchedPage, setMatchedPage] = useState(1);
  const [matchedTotal, setMatchedTotal] = useState(0);

  // === Claimed ===
  const [claimed, setClaimed] = useState<any[]>([]);
  const [claimedPage, setClaimedPage] = useState(1);
  const [claimedTotal, setClaimedTotal] = useState(0);

  const rows = 6;
  const [activeTab, setActiveTab] = useState<"matched" | "claimed">("matched");

  useEffect(() => {
    authService
      .getDonorMatchedDonations(token, matchedPage, rows)
      .then(res => {
        setMatched(res.data.data);
        setMatchedTotal(res.data.total);
      })
      .catch(console.error);
  }, [token, matchedPage]);

  useEffect(() => {
    authService
      .getDonorClaimedDonations(token, claimedPage, rows)
      .then(res => {
        setClaimed(res.data.data);
        setClaimedTotal(res.data.total);
      })
      .catch(console.error);
  }, [token, claimedPage]);

  const matchedFrom = (matchedPage - 1) * rows + 1;
  const matchedTo = Math.min(matchedPage * rows, matchedTotal);
  const claimedFrom = (claimedPage - 1) * rows + 1;
  const claimedTo = Math.min(claimedPage * rows, claimedTotal);

  const renderCardsContainer = <T extends { id: string }>(
    items: T[],
    content: (item: T) => React.ReactNode
  ) => (
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="h-1 bg-purple-500" />
      <div className="p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map(it => (
            <div
              key={it.id}
              className="relative flex flex-col bg-white border-l-4 border-purple-500 rounded-lg shadow hover:shadow-lg transition p-8"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {activeTab === "matched" ? "Matched" : "Claimed"}
                </span>
              </div>
              <div className="space-y-1 mb-4">{content(it)}</div>
                            {/* View Details button */}
              {"delivery" in it && (it as any).delivery?.id && (
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/deliveries/delivery-details/${
                        (it as any).delivery.id
                      }`
                    )
                  }
                  className="mt-auto w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  View Details
                </button>
              )}
              <div className="mt-auto text-xs text-gray-400 text-right">
                {activeTab === "matched" ? (
                  <>Matched on{" "}
                    {new Date((it as any).createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </>
                ) : (
                  <>Claimed on{" "}
                    {new Date((it as any).createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen(o => !o)}
        title="Donor Portal"
        navItems={donorNavItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <div
        className={
          "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-6 transition-all duration-200 " +
          (sidebarOpen ? "ml-64" : "ml-16")
        }
      >
        <Header title="MY DONATIONS" />
        <div className="max-w-7xl mx-auto space-y-8">


          <div className="flex space-x-12 mb-8">
            {(["matched", "claimed"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 pb-2 font-semibold ${
                  activeTab === tab
                    ? "text-purple-800 border-b-2 border-purple-600"
                    : "text-gray-900 hover:text-purple-600"
                }`}
              >
                {tab === "matched" ? <GiftIcon /> : <TruckIcon />}
                <span className="uppercase">{tab}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end mb-4">
            <span className="text-sm text-gray-900">
              {activeTab === "matched"
                ? `Showing ${matchedFrom}–${matchedTo} of ${matchedTotal}`
                : `Showing ${claimedFrom}–${claimedTo} of ${claimedTotal}`}
            </span>
          </div>

          {activeTab === "matched" ? (
            matched.length ? (
              renderCardsContainer(matched, d => (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {(d as any).foodType}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Qty:</strong> {(d as any).quantity}
                  </p>
                  <p className="text-gray-700">
                    <strong>Recipient:</strong>{" "}
                    {(d as any).recipient?.user
                      ? `${(d as any).recipient.user.firstName} ${
                          (d as any).recipient.user.lastName
                        }`
                      : "TBD"}
                  </p>
                {(d as any).delivery && (
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-700">
                        <strong>Delivery Status:</strong>{" "}
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            (d as any).delivery.deliveryStatus === "DELIVERED"
                              ? "bg-green-200 text-green-800"
                              : (d as any).delivery.deliveryStatus === "IN_TRANSIT"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {(d as any).delivery.deliveryStatus.replace(/_/g, " ")}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        {d.recipient?.organization && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({d.recipient.organization})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </>
              ))
            ) : (
              <div className="text-center text-purple-500 py-12">
                No matched donations yet.
              </div>
            )
          ) : claimed.length ? (
            renderCardsContainer(claimed, d => (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {(d as any).foodType}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Qty:</strong> {(d as any).quantity}
                  </p>
                  <p className="text-gray-700">
                    <strong>Recipient:</strong>{" "}
                    {(d as any).recipient?.user
                      ? `${(d as any).recipient.user.firstName} ${
                          (d as any).recipient.user.lastName
                        }`
                      : "TBD"}
                  </p>
                  {(d as any).delivery && (
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-700">
                        <strong>Delivery Status:</strong>{" "}
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            (d as any).delivery.deliveryStatus === "DELIVERED"
                              ? "bg-green-200 text-green-800"
                              : (d as any).delivery.deliveryStatus === "IN_TRANSIT"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {(d as any).delivery.deliveryStatus.replace(/_/g, " ")}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        {d.recipient?.organization && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({d.recipient.organization})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </>
            ))
          ) : (
            <div className="text-center text-purple-500 py-12">
              No claimed donations yet.
            </div>
          )}

          <div className="mt-8">
            <PaginationControls
              page={activeTab === "matched" ? matchedPage : claimedPage}
              rowsPerPage={rows}
              total={activeTab === "matched" ? matchedTotal : claimedTotal}
              onPageChange={p =>
                activeTab === "matched"
                  ? setMatchedPage(p)
                  : setClaimedPage(p)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
