// Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { authService } from "../../services/authService";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  // Recipient org details
  const [legalName, setLegalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [contactPersonTitle, setContactPersonTitle] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  // Document uploads
  const [businessRegistrationDoc, setBusinessRegistrationDoc] =
    useState<File | null>(null);
  const [taxIdDoc, setTaxIdDoc] = useState<File | null>(null);
  const [proofOfAddressDoc, setProofOfAddressDoc] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("RECIPIENT");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (role === "RECIPIENT" && organization.trim() === "") {
      toast.error("Organization is required for recipients.");
      return;
    }

    // Validate recipient org fields
    if (role === "RECIPIENT") {
      if (!legalName || !registrationNumber || !country || !organizationType) {
        toast.error("Please fill all required organization details.");
        return;
      }
      if (!businessRegistrationDoc || !taxIdDoc || !proofOfAddressDoc) {
        toast.error("Please upload all required documents.");
        return;
      }
    }

    try {
      setLoading(true);
      let result;
      if (role === "RECIPIENT") {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("organization", organization);
        formData.append("legalName", legalName);
        formData.append("registrationNumber", registrationNumber);
        formData.append("country", country);
        formData.append("website", website);
        formData.append("contactPersonTitle", contactPersonTitle);
        formData.append("organizationType", organizationType);
        if (businessRegistrationDoc) {
          formData.append("businessRegistrationDoc", businessRegistrationDoc);
        }
        if (taxIdDoc) {
          formData.append("taxIdDoc", taxIdDoc);
        }
        if (proofOfAddressDoc) {
          formData.append("proofOfAddressDoc", proofOfAddressDoc);
        }
        result = await authService.register(formData, true);
      } else {
        result = await authService.register({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          role,
          organization,
        });
      }

      toast.success("Registration successful! Please verify your email.");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 relative overflow-hidden px-2 py-8">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float-slow -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-float-slower -z-10" />

      <div
        className={`w-full ${
          role === "RECIPIENT" ? "max-w-4xl" : "max-w-md"
        } mx-auto bg-white/95 rounded-3xl shadow-2xl px-10 py-12 space-y-10 border border-purple-100 animate-fade-in-up transition-all duration-300`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-full shadow-lg mb-3 animate-bounce-in">
            <svg width="40" height="40" fill="none" viewBox="0 0 48 48">
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
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2 tracking-tight animate-slide-down">
            Create an account
          </h1>
          <p className="text-base text-gray-600 text-center animate-fade-in">
            Sign up to continue to{" "}
            <span className="font-semibold text-purple-600">FoodShare</span>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-fade-in-slow"
        >
          {role === "RECIPIENT" ? (
            <div className="space-y-8 bg-purple-50/70 rounded-2xl px-8 py-7 border border-purple-200 mt-2">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Organization Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Contact Person First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Contact Person First Name"
                    className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Contact Person Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Contact Person Last Name"
                    className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Contact Person Email
                  </label>
                  <input
                    type="email"
                    placeholder="Contact Person Email"
                    className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Organization"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Legal Name"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Registration Number"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Country of Registration"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Official Website URL"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition md:col-span-2"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Contact Person Title"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition md:col-span-2"
                  value={contactPersonTitle}
                  onChange={(e) => setContactPersonTitle(e.target.value)}
                />
                <select
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition md:col-span-2"
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  required
                >
                  <option value="">Select Organization Type</option>
                  <option value="non-profit">Non-profit</option>
                  <option value="for-profit">For-profit</option>
                  <option value="government">Government</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 bg-white/80 rounded-xl p-6 border border-purple-100">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Business Registration Certificate
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setBusinessRegistrationDoc(e.target.files?.[0] || null)
                    }
                    required
                    className="block w-full text-base text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Tax ID / Charity Status Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setTaxIdDoc(e.target.files?.[0] || null)}
                    required
                    className="block w-full text-base text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Proof of Address
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setProofOfAddressDoc(e.target.files?.[0] || null)
                    }
                    required
                    className="block w-full text-base text-gray-600"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            >
              <option value="RECIPIENT">Recipient</option>
              <option value="DONOR">Donor</option>
              <option value="LOGISTIC_PROVIDER">Logistics Provider</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

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
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:underline cursor-pointer font-semibold"
            >
              Sign in
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

export default Register;
