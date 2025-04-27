import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleVerify = async () => {
    if (!token) {
      setError("Verification token missing.");
      return;
    }
    try {
      const res = await authService.verifyEmail(token);
      const data = await res.json();
      if (res.ok) {
        setMessage("Email verified successfully! You can now login.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  React.useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}
    </div>
  );
};

export default VerifyEmail;
