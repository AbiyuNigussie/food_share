// src/pages/RegisterComplete.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

const RegisterComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeRegistration = async () => {
      const data = sessionStorage.getItem("recipientRegistrationData");

      if (!data) {
        toast.error("No registration data found.");
        navigate("/register");
        return;
      }

      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        organization,
      } = JSON.parse(data);

      try {
        await authService.register(
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          role,
          organization
        );

        sessionStorage.removeItem("recipientRegistrationData");
        toast.success("Registration complete! Please verify email.");
        navigate("/login");
      } catch (error: any) {
        toast.error("Registration failed. Please contact support.");
        console.error(error);
      }
    };

    completeRegistration();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-700">Finalizing registration...</p>
    </div>
  );
};

export default RegisterComplete;
