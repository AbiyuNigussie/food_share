import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../contexts/AuthContext";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.adminLogin(email, password);
      const data = res.data;

      login({
        id: data.user.id,
        email: data.user.email,
        token: data.token,
        role: data.user.role,
      });

      toast.success("Admin logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        console.error(err);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float-slow -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-float-slower -z-10" />

      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-12 space-y-8 border border-purple-100 animate-fade-in-up">
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
          <h1 className="text-3xl font-extrabold text-purple-700 mb-1 tracking-tight animate-slide-down">
            Admin Login
          </h1>
          <p className="text-sm text-gray-600 text-center animate-fade-in">
            Sign in to manage{" "}
            <span className="font-semibold text-purple-600">FoodShare</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-in-slow"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/admin/register")}
              className="text-purple-600 hover:underline cursor-pointer font-semibold"
            >
              Register
            </span>
          </p>
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

export default AdminLogin;
