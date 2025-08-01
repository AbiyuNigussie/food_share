import React from "react";
import { motion } from "framer-motion";
import "tippy.js/dist/tippy.css";

interface StatCardProps {
  label: string;
  value: number | string;
  max?: number;
  trendData?: number[];
  onClick?: () => void;
}

const Sparkline: React.FC<{
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
}> = ({ data, width = 100, height = 30, strokeWidth = 1.5 }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const path = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (max - min)) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="block">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  max,
  trendData = [],
  onClick,
}) => {
  const isNumeric = typeof value === "number" && typeof max === "number";
  const pct = isNumeric
    ? Math.min(Math.round(((value as number) / max!) * 100), 100)
    : 0;

  return (
    <motion.div
      onClick={onClick}
      className={`
          relative flex items-center justify-between
          bg-white rounded-2xl shadow-md p-6 overflow-hidden
          hover:shadow-xl transition cursor-pointer
        `}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={isNumeric ? { ["--pct" as any]: `${pct * 3.6}deg` } : {}}
    >
      {trendData.length > 0 && (
        <div className="absolute inset-0 opacity-20 text-purple-400">
          <Sparkline data={trendData} width={120} height={40} />
        </div>
      )}

      <div className="absolute top-0 right-0 w-10 h-10 bg-purple-50 rounded-full opacity-70 transform translate-x-1/4 -translate-y-1/4" />

      <div className="relative flex flex-col z-10">
        <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
          {label}
        </span>
        <span className="mt-2 text-3xl font-extrabold text-purple-800">
          {value}
        </span>
      </div>

      {/* 4. Donut progress */}
      {isNumeric && (
        <div
          className="relative w-14 h-14 rounded-full donut-animate donut-glow z-10"
          style={{
            background: `conic-gradient(#7c3aed ${pct * 3.6}deg, #e5e7eb 0deg)`,
          }}
        >
          <div className="absolute inset-2 bg-white rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
            {pct}%
          </span>
        </div>
      )}
    </motion.div>
  );
};
