import React from "react";

type FeedbackType = "Platform" | "Donation" | "Other";

interface FeedbackTabsProps {
  selectedType: FeedbackType;
  onSelect: (type: FeedbackType) => void;
}

const tabList: FeedbackType[] = ["Platform", "Donation", "Other"];

const FeedbackTabs: React.FC<FeedbackTabsProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {tabList.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-2 rounded-md font-medium text-sm w-full ${
            selectedType === type
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default FeedbackTabs;
