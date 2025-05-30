import React, { useState, useEffect, useRef } from "react";
import { geocodeService } from "../services/geocodeService";

export type Place = {
  label: string;
  lat: number;
  lon: number;
};

interface GeoAutoCompleteProps {
  value: string;
  onChange: (value: string, selectedPlace?: Place) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const GeoAutoComplete: React.FC<GeoAutoCompleteProps> = ({
  value,
  onChange,
  label = "Location",
  placeholder = "Search for a location",
  className = "",
}) => {
  const [options, setOptions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const fetchSuggestions = async () => {
      try {
        const res = await geocodeService.getAutoComplete(value);
        const features = res.data.features || [];
        const places = features.map((f: any) => ({
          label: f.properties.formatted,
          lat: f.properties.lat,
          lon: f.properties.lon,
        }));
        setOptions(places);
      } catch (error) {
        console.error("Autocomplete fetch failed", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (place: Place) => {
    onChange(place.label, place);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor="geo-location"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id="geo-location"
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full text-base px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none hover:border-gray-400 transition"
        />
        {loading && (
          <div className="absolute right-4 top-3 text-gray-400 text-sm">
            Loading...
          </div>
        )}
      </div>

      {showDropdown && options.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-72 overflow-y-auto">
          {options.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place)}
              onMouseDown={(e) => e.preventDefault()}
              className="px-5 py-3 text-base text-gray-800 hover:bg-gray-100 transition-colors duration-150 ease-in-out cursor-pointer"
            >
              {place.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoAutoComplete;
