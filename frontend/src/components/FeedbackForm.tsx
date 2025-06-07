import React, { useState } from "react";
import FeedbackTabs from "./FeedbackTabs";
import StarRating from "./StarRating";

const FeedbackForm = () => {
  const [type, setType] = useState<"Platform" | "Donation" | "Other">("Platform");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = { type, rating, message };
    console.log("Feedback Submitted:", feedbackData);
   
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Submit Your Feedback</h2>

      <label className="text-sm font-medium block mb-2">Feedback Type</label>
      <FeedbackTabs selectedType={type} onSelect={setType} />

      <label className="text-sm font-medium block mb-2">Rating</label>
      <StarRating rating={rating} onRate={setRating} />

      <label className="text-sm font-medium block mb-2">Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-medium"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
