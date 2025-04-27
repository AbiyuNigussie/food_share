import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECIPIENT"); // Default role
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password, role);
      const data = await res.json();
      if (res.ok) {
        login({ id: data.user.id, email: data.user.email, token: data.token });
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="RECIPIENT">Recipient</option>
          <option value="DONOR">Donor</option>
          <option value="LOGISTIC_PROVIDER">Logistics Provider</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
