import React, { useState } from "react";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      const data = await res.json();
      if (res.ok) {
        toast.success("Reset link sent to your email.");
      } else {
        toast.error(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
