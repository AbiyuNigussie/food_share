import React from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
}) => (
  <input
    type="text"
    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);
