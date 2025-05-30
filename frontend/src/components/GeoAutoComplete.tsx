import React, { useState, useEffect, useRef } from "react";
import { geocodeService } from "../services/geocodeService";

type Place = {
  label: string;
  lat: number;
  lon: number;
};

const GeoAutoComplete: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const fetchSuggestions = async () => {
      try {
        const res = await geocodeService.getAutoComplete(inputValue);
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
  }, [inputValue]);

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
    setInputValue(place.label);
    setShowDropdown(false);
    console.log("Selected place:", place);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <label
        htmlFor="location"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Location
      </label>
      <div className="relative">
        <input
          id="location"
          type="text"
          value={inputValue}
          placeholder="Search for a location"
          autoComplete="off"
          onChange={(e) => {
            setInputValue(e.target.value);
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
