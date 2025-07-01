import React, { useState } from "react";
import MainNavLayout from "../layouts/MainNavLayout";
import { submitContactMessage } from "../services/contactService";
import { toast } from "react-toastify";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phoneNumber: "",
        subject: "Contact Form",
        message: form.message,
      });
      toast.success("Thank you! Your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainNavLayout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-400 via-white to-indigo-400">
        {/* Animated floating blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl animate-[blob1_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-[blob2_18s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl animate-[blob3_16s_ease-in-out_infinite_alternate]" />

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/40 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-purple-800 mb-4 text-center drop-shadow-lg">
            Contact Me
          </h1>
          <p className="text-lg text-gray-700 mb-10 text-center font-medium">
            Let's connect! Fill out the form and I'll get back to you soon.
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                  placeholder="Your Name"
                  disabled={loading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                  placeholder="you@email.com"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                placeholder="How can I help you?"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
        {/* Tailwind Animations */}
        <style>{`
          @keyframes blob1 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-30px) scale(1.1); } }
          @keyframes blob2 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(-40px) scale(1.05); } }
          @keyframes blob3 { 0% { transform: translate(-50%, -50%) scale(1); } 100% { transform: translate(-60%, -60%) scale(1.15); } }
          .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none;} }
        `}</style>
      </div>
    </MainNavLayout>
  );
};

export default ContactPage;
