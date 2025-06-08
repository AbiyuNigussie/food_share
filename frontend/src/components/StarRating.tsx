import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRate: (rate: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  return (
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={() => onRate(star)}
          className={`cursor-pointer text-2xl ${
            rating >= star ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
