import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { MatchedDonation, ClaimedDonation } from "../types";
import {
  GiftIcon,
  TruckIcon,
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  ClipboardListIcon,
  BarChart2Icon,
} from "lucide-react";
import PaginationControls from "../components/PaginationControl";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";

const recipientNavItems = [
  { label: "Dashboard", icon: <HomeIcon />, href: "/dashboard" },
  {
    label: "My Claims",
    icon: <PackageIcon />,
    href: "/dashboard/my-donations",
  },
  {
    label: "Insights",
    icon: <BarChart2Icon />,
    href: "/dashboard/recipient-insights",
  },
  {
    label: "My Needs",
    icon: <ClipboardListIcon />,
    href: "/dashboard/recipient-needs",
  },
  { label: "Settings", icon: <SettingsIcon />, href: "/dashboard/settings" },
];

export const RecipientDonationsPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // pagination & state
  const [matched, setMatched] = useState<MatchedDonation[]>([]);
  const [matchedPage, setMatchedPage] = useState(1);
  const [matchedTotal, setMatchedTotal] = useState(0);
  const matchedRows = 6;

  const [claimed, setClaimed] = useState<ClaimedDonation[]>([]);
  const [claimedPage, setClaimedPage] = useState(1);
  const [claimedTotal, setClaimedTotal] = useState(0);
  const claimedRows = 6;

  const [activeTab, setActiveTab] = useState<"matched" | "claimed">("matched");

  useEffect(() => {
    authService
      .getMatchedDonations(token, matchedPage, matchedRows)
      .then((res) => {
        setMatched(res.data.data);
        setMatchedTotal(res.data.total);
      })
      .catch(console.error);
  }, [token, matchedPage]);

  useEffect(() => {
    authService
      .getClaimedDonations(token, claimedPage, claimedRows)
      .then((res) => {
        setClaimed(res.data.data);
        setClaimedTotal(res.data.total);
      })
      .catch(console.error);
  }, [token, claimedPage]);

  const matchedFrom = (matchedPage - 1) * matchedRows + 1;
  const matchedTo = Math.min(matchedPage * matchedRows, matchedTotal);
  const claimedFrom = (claimedPage - 1) * claimedRows + 1;
  const claimedTo = Math.min(claimedPage * claimedRows, claimedTotal);

  const renderCardsContainer = <T extends { id: string }>(
    items: T[],
    content: (item: T) => React.ReactNode
  ) => (
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* top accent bar */}
      <div className="h-1 bg-purple-500" />
      <div className="p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((it) => (
            <div
              key={it.id}
              className="relative flex flex-col bg-white border-l-4 border-purple-500 rounded-lg shadow hover:shadow-lg transition p-8"
            >
              {/* Ribbon badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {activeTab === "matched" ? "Matched" : "Claimed"}
                </span>
              </div>

              {/* Main content */}
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

              {/* Footer timestamp */}
              <div className="mt-auto text-xs text-gray-400 text-right">
                {activeTab === "matched" ? (
                  <>
                    Matched on{" "}
                    {new Date(
                      (it as unknown as MatchedDonation).createdAt
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </>
                ) : (
                  <>
                    Claimed on{" "}
                    {new Date(
                      (it as unknown as ClaimedDonation).createdAt
                    ).toLocaleDateString(undefined, {
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
        toggle={() => setSidebarOpen((o) => !o)}
        title="Recipient Portal"
        navItems={recipientNavItems}
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
        <Header title="MY CLAIMS" />
        <div className="max-w-7xl mx-auto space-y-8 mt-6 w-full">
          {/* Title */}

          {/* Tabs */}
          <div className="flex justify-start space-x-12 mb-12">
            {(["matched", "claimed"] as const).map((tab) => (
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

          {/* Showing count */}
          <div className="flex justify-end mb-4">
            <span className="text-sm text-gray-900">
              {activeTab === "matched"
                ? `Showing ${matchedFrom}–${matchedTo} of ${matchedTotal}`
                : `Showing ${claimedFrom}–${claimedTo} of ${claimedTotal}`}
            </span>
          </div>

          {/* Content */}
          {activeTab === "matched" ? (
            matched.length ? (
              renderCardsContainer(matched, (d) => (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {d.foodType}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Qty:</strong> {d.quantity}
                  </p>
                  <p className="text-gray-700">
                    <strong>Donor:</strong> {d.donor.user.firstName}{" "}
                    {d.donor.user.lastName}
                  </p>
                </>
              ))
            ) : (
              <div className="text-center text-purple-500 py-12">
                No matched donations yet.
              </div>
            )
          ) : claimed.length ? (
            renderCardsContainer(claimed, (d) => (
              <>
                <h3 className="text-2xl font-bold text-gray-800">
                  {d.foodType}
                </h3>
                <p className="text-gray-700">
                  <strong>Qty:</strong> {d.quantity}
                </p>
                <p className="text-gray-700">
                  <strong>Donor:</strong> {d.donor.user.firstName}{" "}
                  {d.donor.user.lastName}
                </p>
                {d.delivery && (
                  <div className="mt-3">
                    <p className="text-gray-700">
                      <strong>Delivery Status:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          d.delivery.deliveryStatus === "DELIVERED"
                            ? "bg-green-200 text-green-800"
                            : d.delivery.deliveryStatus === "IN_TRANSIT"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {d.delivery.deliveryStatus.replace(/_/g, " ")}
                      </span>
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

          {/* Pagination */}
          <div className="mt-8">
            <PaginationControls
              page={activeTab === "matched" ? matchedPage : claimedPage}
              rowsPerPage={activeTab === "matched" ? matchedRows : claimedRows}
              total={activeTab === "matched" ? matchedTotal : claimedTotal}
              onPageChange={(p) =>
                activeTab === "matched" ? setMatchedPage(p) : setClaimedPage(p)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
