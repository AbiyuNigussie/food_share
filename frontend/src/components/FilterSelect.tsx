import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-48" ref={containerRef}>
      <button
        type="button"
        className="w-full flex justify-between items-center bg-[#D9D9D9] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="text-gray-700">{value}</span>
        <ChevronDown className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt}
              className={`px-4 py-2 cursor-pointer ${
                opt === value ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
              }`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
