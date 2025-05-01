import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECIPIENT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password, role);
      const data = await res.json();
      if (res.ok) {
        login({
          id: data.user.id,
          email: data.user.email,
          token: data.token,
          role: data.user.role,
        });
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>
        <p className="text-sm text-gray-600 text-center">
          Sign in to continue to FoodShare
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="RECIPIENT">Recipient</option>
            <option value="DONOR">Donor</option>
            <option value="LOGISTIC_PROVIDER">Logistics Provider</option>
          </select>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
          >
            Sign In
          </button>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
