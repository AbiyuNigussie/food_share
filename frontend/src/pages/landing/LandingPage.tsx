import React from "react";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      <section
        className="relative py-20 px-6 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(27, 0, 27, 0.5), rgba(46, 2, 46, 0.5)), url('/assets/images/hero.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-xl mx-auto pt-56 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 transition-opacity duration-1000">
            SUSTAINABLE FOOD OPTIMIZATION
          </h1>
          <p className="text-lg text-white mb-6 animate-slide-up">
            Optimizing food resources for sustainability
          </p>
          <a
           href="/register"
           className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition inline-block"
           >
            Get Started
          </a>
        </div>
      </section>

      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-whiteS-600 mb-6">About the Project</h2>
        <p className="text-md text-gray-700">
          Our mission is to bridge the gap between surplus food and hunger. Through advanced data analytics and logistical coordination, we enable food producers and donors to redirect excess to those who need it most — sustainably and efficiently.
        </p>
      </section>
      {/* Why It Matters */}
      <section className="bg-[#FAFAF9] py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white-600 mb-10">Why It Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-lg font-semibold text-white-600 mb-2">Food Waste Crisis</h3>
              <p className="text-gray-600">Over 1.3 billion tons of food is wasted each year while millions remain hungry.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-lg font-semibold text-white-600 mb-2">Environmental Impact</h3>
              <p className="text-gray-600">Reducing food waste means reducing methane emissions and preserving resources.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-lg font-semibold text-white-600 mb-2">Equity & Access</h3>
              <p className="text-gray-600">Optimized food distribution ensures fair access to nutritious food for all communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white-600 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-bold text-white-600 mb-2">Donors</h3>
            <p className="mb-4 text-gray-600">Easily list surplus food items with a few clicks.</p>
           <a href="/faq/donor" className="inline-flex items-center text-purple-600 font-medium    hover:underline">
           Learn More <ArrowRight className="ml-1 w-4 h-4" />
          </a>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-bold text-white-600 mb-2">Recipients</h3>
            <p className="mb-4 text-gray-600">Browse available donations and request what’s needed.</p>
            <a href="/faq/recipient" className="inline-flex items-center text-purple-600 font-medium hover:underline">
            Learn More <ArrowRight className="ml-1 w-4 h-4" />
           </a>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-bold text-white-600 mb-2">Logistics</h3>
            <p className="mb-4 text-gray-600">Coordinate fast, eco-conscious deliveries to recipients.</p>
            <a href="/faq/logistics" className="inline-flex items-center text-purple-600 font-medium hover:underline">
            Learn More <ArrowRight className="ml-1 w-4 h-4" />
           </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#F5F5F5] py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white-600 mb-6">Get Involved</h2>
        <p className="text-md text-gray-700 max-w-3xl mx-auto mb-6">
          Whether you're an individual, an organization, or a logistics partner — your contribution can make a difference. Join us in building a more sustainable future.
        </p>
        <a
          href="/register"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition inline-block"
          > 
          Become a Partner
          </a>
      </section>

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
    </div>
  );
};

export default LandingPage;
