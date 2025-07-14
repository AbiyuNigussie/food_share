import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const MainNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white shadow-md border-b border-gray-100 backdrop-blur-sm py-2" 
            : "bg-white/90 backdrop-blur-md py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <a 
                href="/" 
                className="flex items-center text-2xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                  FoodShare
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <div className="flex space-x-8">
                <a 
                  href="/about" 
                  className="text-gray-600 hover:text-purple-700 font-medium transition-colors relative group"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
                </a>
                <div className="relative group">
                  <a 
                    href="/faq" 
                    className="flex items-center text-gray-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    FAQ
                    <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                  </a>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <a 
                      href="/faq/donor" 
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      For Donors
                    </a>
                    <a 
                      href="/faq/recipient" 
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      For Recipients
                    </a>
                    <a 
                      href="/faq/logistics" 
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      For Logistics
                    </a>
                  </div>
                </div>
                <a 
                  href="/contact" 
                  className="text-gray-600 hover:text-purple-700 font-medium transition-colors relative group"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
                </a>
              </div>
              
              <div className="flex items-center space-x-4 ml-8">
                <a 
                  href="/login" 
                  className="px-4 py-2 font-semibold text-purple-700 hover:text-purple-800 transition-colors"
                >
                  Log in
                </a>
                <a 
                  href="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-purple-700 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                About
              </a>
              <div>
                <a
                  href="/faq:rol"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  FAQ
                </a>
                <div className="pl-4 space-y-1 mt-1">
                  <a
                    href="/faq/donor"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    For Donors
                  </a>
                  <a
                    href="/faq/recipient"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    For Recipients
                  </a>
                  <a
                    href="/faq/logistics"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    For Logistics
                  </a>
                </div>
              </div>
              <a
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                Contact
              </a>
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="/login"
                  className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-purple-700 hover:bg-purple-50"
                >
                  Log in
                </a>
                <a
                  href="/register"
                  className="block w-full text-center mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium shadow"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Content padding to avoid overlap */}
      <div className="pt-16 md:pt-20">{children}</div>
    </>
  );
};

export default MainNavLayout;