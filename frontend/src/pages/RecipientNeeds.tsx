// src/pages/RecipientNeeds.tsx

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ClipboardListIcon,
  FileTextIcon,
  InfoIcon,
  MapPinIcon,
  TruckIcon,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { RecipientNeed } from "../types";
import GeoAutoComplete, { Place } from "../components/GeoAutoComplete";
import { EditNeedModal } from "../components/EditNeedModal";

export const RecipientNeeds: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token || "";

  // Form state
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [inputValue, setInputValue] = useState(""); // new state

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Needs list + pagination
  const [needs, setNeeds] = useState<RecipientNeed[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editNeed, setEditNeed] = useState<RecipientNeed | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch needs on mount or page change
  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const res = await authService.getNeeds(token, page, rowsPerPage);
      // res.data = { data: RecipientNeed[], total, page, rowsPerPage }
      setNeeds(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load needs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, [page]);

  // Validate the form
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!foodType) errs.foodType = "Required";
    if (!quantity) errs.quantity = "Required";
    if (!selectedPlace)
      errs.dropoffLocation = "Please pick a drop‐off location";
    if (!contactPhone) errs.contactPhone = "Required";
    return errs;
  };

  // Handle Add New Need
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (!selectedPlace) return;

    try {
      await authService.createNeed(
        {
          foodType,
          quantity,
          dropoffLocation: {
            label: selectedPlace.label,
            latitude: selectedPlace.lat,
            longitude: selectedPlace.lon,
          },
          contactPhone,
          notes,
        },
        token
      );
      toast.success("Need added");
      // reset form
      setFoodType("");
      setQuantity("");
      setSelectedPlace(null);
      setContactPhone("");
      setNotes("");
      setErrors({});
      fetchNeeds();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add need");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await authService.deleteNeed(id, token);
      toast.success("Need deleted");
      fetchNeeds();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete need");
    }
  };

  // Simple search filter (client‐side)
  const filtered = useMemo(() => {
    if (!query) return needs;
    return needs.filter((n) => {
      const addr = n.dropoffLocation.label.toLowerCase();
      return (
        n.foodType.toLowerCase().includes(query.toLowerCase()) ||
        addr.includes(query.toLowerCase())
      );
    });
  }, [needs, query]);

  const pages = Math.ceil(total / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-stretch">
      <EditNeedModal
        need={editNeed}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={fetchNeeds}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-8 py-6 bg-white shadow">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 focus:outline-none"
          >
            <ChevronLeftIcon className="w-5 h-5 text-purple-600" />
          </button>
          <ClipboardListIcon className="w-8 h-8 text-purple-600 ml-6" />
          <h1 className="ml-4 text-2xl font-bold text-gray-900">My Needs</h1>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left: Add New Need Form */}
            <div className="p-8 overflow-auto">
              <form
                onSubmit={handleAdd}
                className="bg-white rounded-2xl shadow-lg p-8 space-y-6 min-h-full flex flex-col"
              >
                <h2 className="text-lg font-semibold text-gray-900">Add New Need</h2>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <ClipboardListIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Food Type *
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select type…</option>
                    <option>Fresh Produce</option>
                    <option>Canned Goods</option>
                    <option>Dairy</option>
                    <option>Baked Goods</option>
                    <option>Meat & Poultry</option>
                  </select>
                  {errors.foodType && (
                    <p className="mt-1 text-sm text-red-600">{errors.foodType}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FileTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Quantity *
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 20 lbs"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Drop‐Off Address *
                  </label>
                  <GeoAutoComplete
                    value={inputValue}
                    onChange={(val, place) => {
                      setInputValue(val); // Always update the input value being typed

                      if (place) {
                        setSelectedPlace(place);
                      } else {
                        setSelectedPlace(null);
                      }
                    }}
                    placeholder="Search for drop-off location…"
                    className="w-full"
                  />

                  {errors.dropoffLocation && (
                    <p className="mt-1 text-sm text-red-600">{errors.dropoffLocation}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FileTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 0912 345 678"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <InfoIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions…"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 flex-1"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    <TruckIcon className="w-5 h-5 mr-2" />
                    Add Need
                  </button>
                </div>
              </form>
            </div>

            {/* Right: List of existing needs + pagination */}
            <div className="p-8 overflow-auto flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search needs…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-sm text-gray-600 ml-4">
                  {filtered.length} of {needs.length} needs
                </span>
              </div>

              {loading ? (
                <p className="text-center">Loading needs…</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filtered.length > 0 ? (
                    filtered.map((n) => (
                      <div
                        key={n.id}
                        className="bg-white rounded-xl shadow p-4 flex justify-between items-start hover:shadow-lg transition"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {n.foodType}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {n.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Drop‐Off: {n.dropoffLocation.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {n.contactPhone}
                          </p>
                          {n.notes && (
                            <p className="mt-1 text-sm text-gray-500 italic">
                              “{n.notes}”
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditNeed(n);
                              setEditModalOpen(true);
                            }}
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-50 transition"
                            aria-label="Edit need"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="p-1 rounded-full text-red-600 hover:bg-red-50 transition"
                            aria-label="Delete need"
                          >
                            <Trash2Icon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No needs found.</p>
                  )}
                </div>
              )}

              {/* Pagination Footer */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-gray-700">
                  Showing {(page - 1) * rowsPerPage + 1}– 
                  {Math.min(page * rowsPerPage, total)} of {total}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, pages))}
                    disabled={page === pages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
