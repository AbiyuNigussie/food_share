"use client";

import MainNavLayout from "../layouts/MainNavLayout";

const developers = [
	{
		name: "Yonatan Girmachew",
		role: "Frontend Developer",
		image: "/assets/images/dev1.jpg",
		linkedin: "#",
		github: "#",
	},
	{
		name: "Dagim Sisay",
		role: "Backend Developer",
		image: "/assets/images/dev2.jpg",
		linkedin: "#",
		github: "#",
	},
	{
		name: "Mohammed Elamin",
		role: "UI/UX Designer",
		image: "/assets/images/dev3.jpg",
		linkedin: "#",
		github: "#",
	},
	{
		name: "Lealem Mekuria",
		role: "Project Manager",
		image: "/assets/images/dev4.jpg",
		linkedin: "#",
		github: "#",
	},
	{
		name: "Abiyu Nigussie",
		role: "Full Stack Developer",
		image: "/assets/images/dev5.jpg",
		linkedin: "#",
		github: "#",
	},
];

export default function AboutPage() {
	return (
		<MainNavLayout>
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-200 via-white to-indigo-100 rounded-3xl shadow-xl border border-purple-200">
				

				{/* Add padding top to offset fixed navbar */}
				<div className="pt-2">
					{/* Hero Section */}
					<section className="relative bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-20 px-4 text-center overflow-hidden">
						<div className="absolute left-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float-slow" />
						<div className="absolute right-0 bottom-0 w-52 h-52 bg-white/10 rounded-full blur-2xl animate-float-slower" />
						<div className="max-w-3xl mx-auto relative z-10">
							<h1 className="text-5xl font-extrabold mb-4 tracking-tight animate-slide-down">
								About Us
							</h1>
							<p className="text-xl opacity-90 animate-fade-in">
								Share food, reduce waste, help lives. One act can make a big
								difference.
							</p>
						</div>
					</section>

					{/* Mission & Impact */}
					<section className="flex-grow px-4 py-20 bg-transparent text-gray-800">
						<div className="max-w-5xl mx-auto text-center">
							<div className="grid md:grid-cols-2 gap-16 items-center mb-20">
								<div className="text-left animate-fade-in">
									<h2 className="text-3xl font-bold mb-4 text-purple-700">
										Our Mission
									</h2>
									<p className="text-lg mb-6">
										FoodShare is committed to building a sustainable ecosystem where
										food surplus from homes, restaurants, and events is redistributed
										to people facing food insecurity. By using technology, we create
										real-time connections between donors and nearby recipients,
										ensuring food is delivered safely and promptly before it is
										wasted.
									</p>
									<a
										href="/"
										className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full font-semibold shadow hover:bg-purple-700 transition"
									>
										Back to Home
									</a>
								</div>
								<div className="flex justify-center">
									<img
										src="/assets/images/our mission.png"
										alt="Mission Illustration"
										className="w-80 h-80 object-contain animate-fade-in-slow"
									/>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-16 items-center mb-20">
								<div className="flex justify-center order-2 md:order-1">
									<img
										src="/assets/images/impact.png"
										alt="Impact Illustration"
										className="w-80 h-80 object-contain animate-fade-in-slow"
									/>
								</div>
								<div className="text-left order-1 md:order-2 animate-fade-in">
									<h2 className="text-3xl font-bold mb-4 text-indigo-700">
										Our Impact
									</h2>
									<p className="text-lg mb-6">
										Since our launch, we've redistributed hundreds of meals that would
										have otherwise gone to waste. Our platform not only reduces
										environmental impact but also provides immediate help to vulnerable
										communities.
									</p>
									<a
										href="/#about"
										className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition"
									>
										Learn More
									</a>
								</div>
							</div>

							{/* Developers Section */}

							<h2 className="text-3xl font-bold mb-2 text-purple-700 text-center animate-fade-in">
								Meet the Developers
							</h2>
							<p className="text-gray-600 mb-10 text-center max-w-xl mx-auto">
								Our passionate team is dedicated to building a more sustainable and
								equitable food system.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
								{developers.map((dev, index) => (
									<div
										key={index}
										className="bg-white rounded-2xl shadow-lg p-8 max-w-xs w-full flex flex-col items-center mx-auto hover:scale-105 transition-transform duration-300 animate-fade-in"
										style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
									>
										<img
											src={dev.image}
											alt={dev.name}
											className="w-36 h-36 mb-4 rounded-full object-cover border-4 border-purple-200"
										/>
										<h3 className="text-2xl font-semibold mb-2">{dev.name}</h3>
										<p className="text-base text-gray-600 mb-3">{dev.role}</p>
										<div className="flex gap-4">
											<a
												href={dev.linkedin}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="LinkedIn"
											>
												<svg
													width="22"
													height="22"
													fill="currentColor"
													className="text-purple-600 hover:text-purple-800 transition"
												>
													<path d="M19 0h-16c-1.7 0-3 1.3-3 3v16c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3v-16c0-1.7-1.3-3-3-3zm-11.5 19h-3v-9h3v9zm-1.5-10.3c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7c1 0 1.7.8 1.7 1.7s-.7 1.7-1.7 1.7zm13 10.3h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4v4.8h-3v-9h2.9v1.2h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3v5z" />
												</svg>
											</a>
											<a
												href={dev.github}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="GitHub"
											>
												<svg
													width="22"
													height="22"
													fill="currentColor"
													className="text-gray-700 hover:text-black transition"
												>
													<path d="M11 .3a11 11 0 00-3.5 21.5c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.7 1.7 2.1.8.1 1.6-.1 2.1-.3.1-.7.4-1.1.7-1.4-2.7-.3-5.5-1.3-5.5-5.7 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.4-2.8 5.4-5.5 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11 11 0 0011 .3" />
												</svg>
											</a>
										</div>
									</div>
								))}
							</div>

							{/* Call to Action */}
							<div className="mt-12 animate-fade-in">
								<h2 className="text-3xl font-bold mb-4 text-indigo-700">
									Join Us
								</h2>
								<p className="text-lg mb-6">
									Want to be part of the change? Whether you're a developer, donor,
									delivery partner, or simply a kind heart, there's a place for you in
									our movement.
								</p>
								<a
									href="/register"
									className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300"
								>
									Get Started
								</a>
							</div>
						</div>
					</section>
				</div>

				{/* Footer */}
				<footer className="bg-purple-950 text-white py-12 px-6">
					<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
						<div>
							<h3 className="text-lg font-semibold mb-2">
								Sustainable Food Optimization
							</h3>
							<p>
								Fighting food waste through innovation and collaboration.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Navigation</h4>
							<ul className="space-y-1">
								<li>
									<a
										href="/register"
										className="hover:underline"
									>
										Donors
									</a>
								</li>
								<li>
									<a
										href="/register"
										className="hover:underline"
									>
										Recipients
									</a>
								</li>
								<li>
									<a
										href="/register"
										className="hover:underline"
									>
										Logistics
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Connect</h4>
							<ul className="space-y-1">
								<li>
									<a
										href="#"
										className="hover:underline"
									>
										GitHub
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:underline"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="text-center mt-8 text-sm">
						&copy; {new Date().getFullYear()} Sustainable Food Optimization. All rights
						reserved.
					</div>
				</footer>

				{/* Animations */}
				<style>{`
        .animate-fade-in { animation: fadeIn 1s ease both; }
        .animate-fade-in-slow { animation: fadeIn 2s ease both; }
        .animate-slide-down { animation: slideDown 1.2s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-float-slow { animation: float 6s ease-in-out infinite alternate; }
        .animate-float-slower { animation: float 10s ease-in-out infinite alternate; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 50% { transform: translateY(-10px); } }
      `}</style>
			</div>
		</MainNavLayout>
	);
}
