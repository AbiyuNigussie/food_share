import React from "react";
import { ArrowRight } from "lucide-react";
import MainNavLayout from "../../layouts/MainNavLayout";

// Inline SVG icons for features and steps
const WasteIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#A78BFA" fillOpacity="0.15" />
    <path
      d="M16 20v12a2 2 0 002 2h12a2 2 0 002-2V20M12 20h24M20 16v-2a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke="#A78BFA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const EcoIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#34D399" fillOpacity="0.15" />
    <path
      d="M24 36c6.627 0 12-5.373 12-12V12S24 12 24 24c0 0-12 0-12 12"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const EquityIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#6366F1" fillOpacity="0.15" />
    <circle cx="24" cy="18" r="4" stroke="#6366F1" strokeWidth="2" />
    <path
      d="M16 34v-2a6 6 0 0112 0v2"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const DonorIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#A78BFA" fillOpacity="0.15" />
    <path
      d="M24 34c6.627 0 12-5.373 12-12V12S24 12 24 24c0 0-12 0-12 12"
      stroke="#A78BFA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="18" r="4" stroke="#A78BFA" strokeWidth="2" />
  </svg>
);
const RecipientIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#34D399" fillOpacity="0.15" />
    <circle cx="24" cy="18" r="4" stroke="#34D399" strokeWidth="2" />
    <path
      d="M16 34v-2a6 6 0 0112 0v2"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const LogisticsIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="24" fill="#6366F1" fillOpacity="0.15" />
    <rect x="14" y="20" width="20" height="10" rx="2" stroke="#6366F1" strokeWidth="2" />
    <circle cx="18" cy="32" r="2" stroke="#6366F1" strokeWidth="2" />
    <circle cx="30" cy="32" r="2" stroke="#6366F1" strokeWidth="2" />
  </svg>
);

const features = [
  {
    title: "Food Waste Crisis",
    desc: "Over 1.3 billion tons of food is wasted each year while millions remain hungry.",
    icon: <WasteIcon />,
  },
  {
    title: "Environmental Impact",
    desc: "Reducing food waste means reducing methane emissions and preserving resources.",
    icon: <EcoIcon />,
  },
  {
    title: "Equity & Access",
    desc: "Optimized food distribution ensures fair access to nutritious food for all communities.",
    icon: <EquityIcon />,
  },
];

const howItWorks = [
  {
    title: "Donors",
    desc: "Easily list surplus food items with a few clicks.",
    link: "/faq/donor",
    icon: <DonorIcon />,
  },
  {
    title: "Recipients",
    desc: "Browse available donations and request what’s needed.",
    link: "/faq/recipient",
    icon: <RecipientIcon />,
  },
  {
    title: "Logistics",
    desc: "Coordinate fast, eco-conscious deliveries to recipients.",
    link: "/faq/logistics",
    icon: <LogisticsIcon />,
  },
];

const LandingPage = () => {
  return (
    <MainNavLayout>
      <div className="font-sans text-gray-800 bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(120deg,rgba(99,102,100,0.03),rgba(168,139,250,0.03)), url('/assets/images/hero.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-indigo-900/40 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6 tracking-tight animate-slide-down">
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-100 bg-clip-text text-transparent">
                FoodShare
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              Optimizing food resources for a brighter, greener future.
            </p>
            <a
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-bounce-in"
            >
              Get Started <ArrowRight className="ml-1 w-5 h-5" />
            </a>
          </div>
          {/* Animated shapes */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute left-10 top-10 w-24 h-24 bg-purple-300/30 rounded-full blur-2xl animate-float-slow" />
            <div className="absolute right-10 bottom-10 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl animate-float-slower" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-700 mb-6 animate-fade-in">
            About the Project
          </h2>
          <p className="text-lg text-gray-700 animate-fade-in-slow">
            Our mission is to bridge the gap between surplus food and hunger. Through
            advanced data analytics and logistical coordination, we enable food
            producers and donors to redirect excess to those who need it most —
            sustainably and efficiently.
          </p>
          <a
            href="/about"
            className="inline-block mt-6 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold shadow hover:bg-purple-700 transition"
          >
            Meet the Team
          </a>
        </section>

        {/* Why It Matters */}
        <section className="bg-gradient-to-br from-purple-100 via-white to-indigo-100 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-12 animate-fade-in">
              Why It Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col items-center animate-fade-in"
                  style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold text-purple-700 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-indigo-700 mb-14 animate-fade-in">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition duration-300 flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {step.title}
                </h3>
                <p className="mb-4 text-gray-600">{step.desc}</p>
                <a
                  href={step.link}
                  className="inline-flex items-center text-purple-600 font-medium hover:underline group"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
              What People Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 italic">
                  "This platform helped us redirect surplus food to families in need.
                  It's a game changer!"
                </p>
                <div className="mt-4 font-semibold text-purple-700">
                  — Sarah, Food Bank Manager
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 italic">
                  "Easy to use and impactful. We reduced our waste and helped our
                  community."
                </p>
                <div className="mt-4 font-semibold text-purple-700">
                  — Mike, Bakery Owner
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 italic">
                  "I received fresh food for my family when we needed it most. Thank
                  you!"
                </p>
                <div className="mt-4 font-semibold text-purple-700">
                  — Amina, Recipient
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-500 py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute left-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute right-0 bottom-0 w-52 h-52 bg-white/10 rounded-full blur-2xl animate-float-slower" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Get Involved
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in-slow">
            Whether you're an individual, an organization, or a logistics partner —
            your contribution can make a difference. Join us in building a more
            sustainable future.
          </p>
          <a
            href="/register"
            className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-purple-100 hover:scale-105 transition-all duration-300 inline-block animate-bounce-in"
          >
            Become a Partner
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sustainable Food Optimization</h3>
            <p>Fighting food waste through innovation and collaboration.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Navigation</h4>
            <ul className="space-y-1">
              <li><a href="/register" className="hover:underline">Donors</a></li>
              <li><a href="/register" className="hover:underline">Recipients</a></li>
              <li><a href="/register" className="hover:underline">Logistics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Connect</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">GitHub</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          &copy; {new Date().getFullYear()} Sustainable Food Optimization. All rights reserved.
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease both; }
        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-fade-in-slow { animation: fadeIn 2s ease both; }
        .animate-slide-down { animation: slideDown 1.2s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-bounce-in { animation: bounceIn 1.2s both; }
        .animate-float-slow { animation: float 6s ease-in-out infinite alternate; }
        .animate-float-slower { animation: float 10s ease-in-out infinite alternate; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        @keyframes fadeInSlow { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-40px);} to { opacity: 1; transform: none; } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.8);} 60% { opacity: 1; transform: scale(1.05);} 100% { opacity: 1; transform: scale(1);} }
        @keyframes float { from { transform: translateY(0px);} to { transform: translateY(30px);} }
      `}</style>
    </MainNavLayout>
  );
};

export default LandingPage;
