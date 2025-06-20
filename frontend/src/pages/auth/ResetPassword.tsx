import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await authService.updatePassword(token!, password);
      toast.success("Password reset successful. You can now log in.");
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        toast.error(err.response.data.message);
      } else {
        console.error(err);
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float-slow -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-float-slower -z-10" />

      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-10 space-y-8 border border-purple-100 animate-fade-in-up">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-full shadow-lg mb-2 animate-bounce-in">
            <svg width="36" height="36" fill="none" viewBox="0 0 48 48">
              <rect
                width="48"
                height="48"
                rx="24"
                fill="#A78BFA"
                fillOpacity="0.15"
              />
              <path
                d="M16 20v12a2 2 0 002 2h12a2 2 0 002-2V20M12 20h24M20 16v-2a2 2 0 012-2h4a2 2 0 012 2v2"
                stroke="#A78BFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-purple-700 mb-1 tracking-tight animate-slide-down">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 text-center animate-fade-in">
            Enter your new password below.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-in-slow"
        >
          <input
            type="password"
            placeholder="New password"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-fade-in { animation: fadeIn 1s ease both; }
        .animate-fade-in-slow { animation: fadeIn 2s ease both; }
        .animate-slide-down { animation: slideDown 1.2s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-bounce-in { animation: bounceIn 1.2s both; }
        .animate-float-slow { animation: float 8s ease-in-out infinite alternate; }
        .animate-float-slower { animation: float 14s ease-in-out infinite alternate; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-40px);} to { opacity: 1; transform: none; } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.8);} 60% { opacity: 1; transform: scale(1.05);} 100% { opacity: 1; transform: scale(1);} }
        @keyframes float { from { transform: translateY(0px);} to { transform: translateY(30px);} }
      `}</style>
    </div>
  );
};

export default ResetPassword;
