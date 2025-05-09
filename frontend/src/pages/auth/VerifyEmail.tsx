import React, { useState, useEffect } from "react";
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
      await authService.verifyEmail(token);
      setMessage("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        console.error(err);
        setError("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
        {error && <div className="text-red-500 font-medium">{error}</div>}
        {message && <div className="text-green-600 font-medium">{message}</div>}
        <p className="text-sm text-gray-500">
          This may take a few seconds. Please wait.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
