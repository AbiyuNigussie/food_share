import React, { useState } from "react";
import { authService } from "../../services/authService";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.resetPassword(email);
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset email sent. Please check your inbox.");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Send Reset Email
      </button>
    </form>
  );
};

export default ResetPassword;
