// src/pages/RecipientDonationsPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { MatchedDonation, ClaimedDonation } from "../types";
import { GiftIcon, TruckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const RecipientDonationsPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";

  // === Matched Donations State & Pagination ===
  const [matched, setMatched] = useState<MatchedDonation[]>([]);
  const [matchedPage, setMatchedPage] = useState(1);
  const [matchedTotal, setMatchedTotal] = useState(0);
  const matchedRows = 6; // show 6 per page (2x3 grid)

  // === Claimed Donations State & Pagination ===
  const [claimed, setClaimed] = useState<ClaimedDonation[]>([]);
  const [claimedPage, setClaimedPage] = useState(1);
  const [claimedTotal, setClaimedTotal] = useState(0);
  const claimedRows = 6;

  // Fetch matched donations
  const fetchMatched = async () => {
    try {
      const res = await authService.getMatchedDonations(
        token,
        matchedPage,
        matchedRows
      );
      setMatched(res.data.data);
      setMatchedTotal(res.data.total);
    } catch (err) {
      console.error("Failed to load matched donations", err);
    }
  };

  // Fetch claimed donations
  const fetchClaimed = async () => {
    try {
      const res = await authService.getClaimedDonations(
        token,
        claimedPage,
        claimedRows
      );
      setClaimed(res.data.data);
      setClaimedTotal(res.data.total);
    } catch (err) {
      console.error("Failed to load claimed donations", err);
    }
  };

  // Re-fetch when page changes
  useEffect(() => {
    fetchMatched();
  }, [matchedPage]);

  useEffect(() => {
    fetchClaimed();
  }, [claimedPage]);

  // Compute “Showing X–Y of Z” ranges
  const matchedFrom = (matchedPage - 1) * matchedRows + 1;
  const matchedTo = Math.min(matchedPage * matchedRows, matchedTotal);
  const matchedPagesCount = Math.ceil(matchedTotal / matchedRows);

  const claimedFrom = (claimedPage - 1) * claimedRows + 1;
  const claimedTo = Math.min(claimedPage * claimedRows, claimedTotal);
  const claimedPagesCount = Math.ceil(claimedTotal / claimedRows);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Centered container */}
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">My Donations</h1>
        </div>

        {/* ===== Matched Donations Section ===== */}
        <section className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center space-x-2">
            <div className="w-1 h-8 bg-purple-500 rounded"></div>
            <GiftIcon className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Matched (Accepted) Donations
            </h2>
          </div>

          {matched.length === 0 ? (
            <p className="text-gray-500">No matched donations yet.</p>
          ) : (
            <>
              {/* Showing X–Y of Z */}
              <p className="text-sm text-gray-600">
                Showing {matchedFrom}–{matchedTo} of {matchedTotal}
              </p>

              {/* Grid of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matched.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <GiftIcon className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {d.foodType}
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span> {d.quantity}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Donor:</span>{" "}
                        {d.donor.user.firstName} {d.donor.user.lastName}
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 text-right">
                      <span>
                        Matched on{" "}
                        {new Date(d.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setMatchedPage((p) => Math.max(1, p - 1))}
                  disabled={matchedPage === 1}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span className="text-sm">Prev</span>
                </button>
                <span className="text-sm text-gray-700">
                  Page {matchedPage} of {matchedPagesCount}
                </span>
                <button
                  onClick={() =>
                    setMatchedPage((p) =>
                      p < matchedPagesCount ? p + 1 : p
                    )
                  }
                  disabled={matchedPage === matchedPagesCount}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </section>

        {/* ===== Claimed Donations Section ===== */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-8 bg-green-500 rounded"></div>
            <TruckIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Claimed Donations
            </h2>
          </div>

          {claimed.length === 0 ? (
            <p className="text-gray-500">No claimed donations yet.</p>
          ) : (
            <>
              {/* Showing X–Y of Z */}
              <p className="text-sm text-gray-600">
                Showing {claimedFrom}–{claimedTo} of {claimedTotal}
              </p>

              {/* Grid of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimed.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {d.foodType}
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span> {d.quantity}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Donor:</span>{" "}
                        {d.donor.user.firstName} {d.donor.user.lastName}
                      </p>

                      {d.delivery && (
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-700">
                            <span className="font-medium">Delivery Status:</span>{" "}
                            <span
                              className={`
                                inline-block px-2 py-0.5 text-xs font-semibold rounded
                                ${
                                  d.delivery.deliveryStatus === "DELIVERED"
                                    ? "bg-green-200 text-green-800"
                                    : d.delivery.deliveryStatus === "IN_TRANSIT"
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-yellow-200 text-yellow-800"
                                }
                              `}
                            >
                              {d.delivery.deliveryStatus.replace(/_/g, " ")}
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Pickup:</span>{" "}
                            {d.delivery.pickupLocation}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-gray-500 text-right">
                      <span>
                        Claimed on{" "}
                        {new Date(d.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setClaimedPage((p) => Math.max(1, p - 1))}
                  disabled={claimedPage === 1}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span className="text-sm">Prev</span>
                </button>
                <span className="text-sm text-gray-700">
                  Page {claimedPage} of {claimedPagesCount}
                </span>
                <button
                  onClick={() =>
                    setClaimedPage((p) =>
                      p < claimedPagesCount ? p + 1 : p
                    )
                  }
                  disabled={claimedPage === claimedPagesCount}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
