import React from "react";

const MainNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
      <nav className="w-full bg-white/90 backdrop-blur border-b border-purple-100 shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg tracking-tight animate-slide-down mb-0">
            <a className="bg-gradient-to-r from-purple-600 via-indigo-400 to-purple-500 bg-clip-text text-transparent" href="/">
              FoodShare
            </a>
          </h1>
          <div className="hidden md:flex gap-8 items-center">
            <a href="/about" className="text-gray-700 hover:text-purple-700 font-medium transition">About</a>
            
            <a href="/faq/:rol" className="text-gray-700 hover:text-purple-700 font-medium transition">FAQ</a>
            <a href="/contact" className="text-gray-700 hover:text-purple-700 font-medium transition">Contact</a>
            <a href="/register" className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-purple-700 transition">Register</a>
            <a href="/login" className="text-purple-700 font-semibold hover:underline transition">Login</a>
          </div>
          {/* Mobile menu button (optional) */}
          <button className="md:hidden p-2 rounded hover:bg-purple-50 transition" aria-label="Open menu">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>
    <div className="pt-16">{children}</div>
  </>
);

export default MainNavLayout;