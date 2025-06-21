import React, { useState } from "react";
import MainNavLayout from "../layouts/MainNavLayout";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <MainNavLayout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-400 via-white to-indigo-400">
        {/* Animated floating blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl animate-blob3" />

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/40 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-purple-800 mb-4 text-center drop-shadow-lg">Contact Me</h1>
          <p className="text-lg text-gray-700 mb-10 text-center font-medium">
            Let's connect! Fill out the form and I'll get back to you soon.
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border-none rounded-xl px-5 py-3 bg-white/70 focus:ring-2 focus:ring-purple-400 text-lg shadow transition"
                placeholder="How can I help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              Send Message
            </button>
            {sent && (
              <div className="text-green-700 text-center font-semibold animate-fade-in">
                Thank you! Your message has been sent.
              </div>
            )}
          </form>
        </div>
        {/* Animations */}
        <style>{`
          .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none;} }
          .animate-bg-gradient { animation: bgMove 12s ease-in-out infinite alternate; }
          @keyframes bgMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
          .animate-blob1 { animation: blob1 14s ease-in-out infinite alternate; }
          .animate-blob2 { animation: blob2 18s ease-in-out infinite alternate; }
          .animate-blob3 { animation: blob3 16s ease-in-out infinite alternate; }
          @keyframes blob1 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-30px) scale(1.1); } }
          @keyframes blob2 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(-40px) scale(1.05); } }
          @keyframes blob3 { 0% { transform: translate(-50%, -50%) scale(1); } 100% { transform: translate(-60%, -60%) scale(1.15); } }
        `}</style>
      </div>
    </MainNavLayout>
  );
};

export default ContactPage;