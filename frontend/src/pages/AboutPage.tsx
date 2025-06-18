"use client";

const developers = [
  {
    name: "Developer 1",
    role: "Frontend Developer",
    image: "/assets/images/dev1.jpg",
  },
  {
    name: "Developer 2",
    role: "Backend Developer",
    image: "/assets/images/dev2.jpg",
  },
  {
    name: "Developer 3",
    role: "UI/UX Designer",
    image: "/assets/images/dev3.jpg",
  },
  {
    name: "Developer 4",
    role: "Project Manager",
    image: "/assets/images/dev4.jpg",
  },
  {
    name: "Developer 5",
    role: "Full Stack Developer",
    image: "/assets/images/dev1.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-purple-900 text-white py-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-lg">
            Share food, reduce waste, help lives. One act can make a big difference.
          </p>
        </div>
      </section>

      {/* Mission & Impact */}
      <section className="flex-grow px-4 py-12 bg-gray-50 text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
          <p className="text-lg mb-8">
            FoodShare is committed to building a sustainable ecosystem where food surplus from homes, restaurants, and events is redistributed
            to people facing food insecurity. By using technology, we create real-time connections between donors and nearby recipients,
            ensuring food is delivered safely and promptly before it is wasted.
          </p>

          <h2 className="text-3xl font-semibold mb-6">Our Impact</h2>
          <p className="text-lg mb-8">
            Since our launch, we've redistributed hundreds of meals that would have otherwise gone to waste.
            Our platform not only reduces environmental impact but also provides immediate help to vulnerable communities.
          </p>

          {/* Developers Section */}
          <h2 className="text-3xl font-semibold mb-8 text-white-800">Meet the Developers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            {developers.map((dev, index) => (
              <div key={index} className="text-center">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 mx-auto mb-3 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold">{dev.name}</h3>
                <p className="text-sm text-gray-600">{dev.role}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-4">Join Us</h2>
            <p className="text-lg mb-6">
              Want to be part of the change? Whether you're a developer, donor, delivery partner, or simply a kind heart, there's a place for you in our movement.
            </p>
            <a
              href="/register"
              className="inline-block px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Footer - same as landing page */}
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
}
