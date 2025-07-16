import React, { useState } from "react";
import { Info, Users, Truck, HelpCircle, Search, HandHeart, PackageCheck, ChevronDown } from "lucide-react";
import MainNavLayout from "../layouts/MainNavLayout";
import { motion } from "framer-motion";

const faqSections = [
	{
		title: "General Information",
		icon: <Info className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "What is Sustainable Food Optimization?",
				answer: [
					"It's a platform designed to reduce food waste and hunger by connecting surplus food sources with those in need.",
					"It streamlines food donation, tracking, and distribution through technology and community collaboration.",
				],
			},
			{
				question: "What are the main goals of this system?",
				answer: [
					"Reduce food waste, support food-insecure communities, and promote environmental sustainability.",
					"Encourage responsible consumption and redistribution of resources.",
				],
			},
			{
				question: "What types of food can be donated?",
				answer: [
					"Packaged, fresh, and surplus food that meets safety standards.",
					"Hot meals from certified donors and perishable goods with appropriate storage.",
				],
			},
			{
				question: "Is this platform free to use?",
				answer: [
					"Yes, it’s completely free for donors, recipients, and volunteers.",
					"We believe in accessibility for everyone involved in the food supply chain.",
				],
			},
			{
				question: "Who manages this initiative?",
				answer: [
					"It’s operated by a network of NGOs, food rescue groups, developers, and community volunteers.",
				],
			},
		],
	},
	{
		title: "User Accounts",
		icon: <Users className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "How do I register?",
				answer: [
					"Click the 'Sign Up' button and choose your role: donor, recipient, or volunteer.",
					"Complete your profile and confirm your email address to activate the account.",
				],
			},
			{
				question: "Can one user have multiple roles?",
				answer: [
					"Yes, users can switch roles or register as multiple roles for flexibility.",
					"E.g., a restaurant can be a donor and also volunteer for logistics.",
				],
			},
			{
				question: "Do I need documents to register?",
				answer: [
					"Recipients may need basic verification to ensure legitimate need.",
					"Donors and volunteers are encouraged to add IDs for safety and trust-building.",
				],
			},
			{
				question: "How is user activity monitored?",
				answer: [
					"Activity logs and ratings help track interactions and promote transparency.",
				],
			},
			{
				question: "Can I deactivate my account?",
				answer: [
					"Yes, go to settings > account > deactivate to temporarily disable or permanently delete your profile.",
				],
			},
		],
	},
	{
		title: "Donors",
		icon: <HandHeart className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "Who can become a donor?",
				answer: [
					"Any organization or individual with surplus food: restaurants, supermarkets, caterers, farms, etc.",
					"Donors must agree to safety and handling standards before contributing.",
				],
			},
			{
				question: "How do I schedule a donation?",
				answer: [
					"Log in to your dashboard and click 'New Donation'. Provide food details, quantity, pickup window, and storage conditions.",
					"You’ll receive confirmation once a recipient or logistics partner accepts.",
				],
			},
			{
				question: "Can I track where my food goes?",
				answer: [
					"Yes. The platform provides real-time tracking and post-delivery reports showing who received your donation.",
				],
			},
			{
				question: "Are donations tax-deductible?",
				answer: [
					"Depending on your location and local laws, food donations may qualify for tax benefits. Documentation is available in your dashboard.",
				],
			},
			{
				question: "What if my food is perishable?",
				answer: [
					"Perishable items must be clearly marked with expiration dates and stored according to guidelines. Priority pickups are arranged for such items.",
				],
			},
		],
	},
	{
		title: "Recipients",
		icon: <PackageCheck className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "Who can receive food donations?",
				answer: [
					"Non-profits, shelters, food pantries, community kitchens, and verified individuals in need.",
					"Basic verification is required to ensure fair distribution.",
				],
			},
			{
				question: "How do I request food?",
				answer: [
					"Sign in and go to the 'Request Food' section. You can browse available donations or create a custom request.",
					"You’ll be matched with donors or deliveries based on your location and needs.",
				],
			},
			{
				question: "Is there a limit on how much I can request?",
				answer: [
					"Limits may apply based on inventory, need level, and frequency of previous requests.",
					"The system ensures fair access for all verified recipients.",
				],
			},
			{
				question: "Can I schedule recurring donations?",
				answer: [
					"Yes, organizations can set up weekly or monthly needs and receive automatic matches when food is available.",
				],
			},
			{
				question: "What happens after I receive a donation?",
				answer: [
					"You’re asked to confirm receipt, rate the experience, and provide feedback if necessary. This helps improve reliability and transparency.",
				],
			},
		],
	},
	{
		title: "Delivery & Logistics",
		icon: <Truck className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "How are pickup and drop-off points managed?",
				answer: [
					"Pickup and drop-off are scheduled during registration of the donation or request.",
					"The system optimizes routes for efficiency and minimal waste of time/fuel.",
				],
			},
			{
				question: "Can volunteers assist with deliveries?",
				answer: [
					"Yes, volunteers can opt in to receive delivery tasks within their proximity.",
					"They’re guided via map navigation and delivery instructions.",
				],
			},
			{
				question: "Are logistics partners verified?",
				answer: ["Yes, all logistics teams are vetted and trained in food handling practices."],
			},
			{
				question: "What if a delivery is missed?",
				answer: [
					"The system automatically reschedules the next available time or reroutes to another nearby recipient.",
				],
			},
			{
				question: "Is delivery tracking available?",
				answer: [
					"Yes. Both donor and recipient can track live delivery status from their dashboards.",
				],
			},
		],
	},
	{
		title: "Support",
		icon: <HelpCircle className="w-4 h-4 mr-2" />,
		items: [
			{
				question: "How do I reach technical support?",
				answer: [
					"Use the contact page or email us at yonatangirmachew3@gmail.com.",
				],
			},
			{
				question: "Can I volunteer for the support team?",
				answer: [
					"Yes! Contact us through the 'Join Us' form and we'll onboard you as a support agent or field volunteer.",
				],
			},
			{
				question: "What languages are supported?",
				answer: [
					"Currently available in English. More languages coming soon based on user demand.",
				],
			},
		],
	},
];

const FAQPage: React.FC = () => {
	const [openQuestion, setOpenQuestion] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<string>("General Information");
	const [searchTerm, setSearchTerm] = useState("");

	const toggleQuestion = (id: string) => {
		setOpenQuestion((prev) => (prev === id ? null : id));
	};

	const filteredSections = faqSections.map((section) => ({
		...section,
		items: section.items.filter((item) =>
			item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.answer.some(ans => ans.toLowerCase().includes(searchTerm.toLowerCase()))
		),
	}));

	// Filter categories with questions
	const hasQuestions = filteredSections.some(section => section.items.length > 0);

	return (
		<MainNavLayout>
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
				{/* Hero Section */}
				<section className="relative py-20  bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-white">
					<div className="max-w-7xl mx-auto px-4 text-center">
					<div 
						className="absolute inset-0 bg-cover bg-center opacity-45"
						style={{ backgroundImage: "url('/assets/images/faq.png')" }}
					/>
						<motion.h1 
							className="text-4xl md:text-5xl font-bold mb-6"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							Frequently Asked Questions
						</motion.h1>
						<motion.div 
							className="w-24 h-1 bg-white mx-auto rounded-full mb-8"
							initial={{ width: 0 }}
							animate={{ width: "6rem" }}
							transition={{ delay: 0.3, duration: 0.8 }}
						/>
						<motion.p 
							className="text-xl max-w-3xl mx-auto"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
						>
							Find answers to common questions about our platform, donations, and how to get involved.
						</motion.p>
					</div>
				</section>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-4 py-16">
					{/* Search and Category Navigation */}
					<div className="mb-16">
						<div className="bg-white rounded-xl shadow-lg p-2 mb-8 max-w-3xl mx-auto">
							<div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
								<Search className="w-5 h-5 text-gray-400 mr-3" />
								<input
									type="text"
									placeholder="Search questions or keywords..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
								/>
							</div>
						</div>

						{/* Category Tabs */}
						<div className="flex flex-wrap justify-center gap-3 mb-12">
							{faqSections.map((section, idx) => (
								<button
									key={idx}
									onClick={() => setActiveCategory(section.title)}
									className={`px-5 py-3 rounded-full font-medium flex items-center transition-all ${
										activeCategory === section.title
											? "bg-purple-600 text-white shadow-md"
											: "bg-white text-gray-700 hover:bg-gray-100"
									}`}
								>
									<span className="mr-2">{section.icon}</span>
									{section.title}
								</button>
							))}
						</div>
					</div>

					{/* FAQ Content */}
					<div className="max-w-4xl mx-auto">
						{hasQuestions ? (
							filteredSections
								.filter(section => 
									section.items.length > 0 && 
									(activeCategory === section.title || searchTerm)
								)
								.map((section, sectionIdx) => (
									<motion.div 
										key={sectionIdx}
										className="mb-16"
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
									>
										<div className="flex items-center text-purple-700 font-bold text-xl mb-8 pb-2 border-b border-purple-200">
											{section.icon}
											{section.title}
										</div>
										<div className="space-y-5">
											{section.items.map((item, itemIdx) => {
												const id = `${sectionIdx}-${itemIdx}`;
												const isOpen = openQuestion === id;

												return (
													<div
														key={id}
														className={`bg-white rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${
															isOpen ? "shadow-md" : "hover:shadow-md"
														}`}
													>
														<button
															onClick={() => toggleQuestion(id)}
															className="w-full text-left px-6 py-5 flex justify-between items-center font-medium text-gray-800 hover:text-purple-800"
														>
															<span className="text-lg">{item.question}</span>
															<ChevronDown className={`text-purple-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
														</button>
														{isOpen && (
															<motion.div 
																className="px-6 pb-6 text-gray-600"
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																transition={{ duration: 0.3 }}
															>
																<ul className="list-disc list-inside space-y-2 pl-4">
																	{item.answer.map((ans, ansIdx) => (
																		<li key={ansIdx} className="leading-relaxed">{ans}</li>
																	))}
																</ul>
															</motion.div>
														)}
													</div>
												);
											})}
										</div>
									</motion.div>
								))
						) : (
							<div className="text-center py-16">
								<div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
									<div className="text-5xl text-gray-300 mb-4">❓</div>
									<h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
									<p className="text-gray-600 mb-6">
										We couldn't find any questions matching "{searchTerm}". Try different keywords.
									</p>
									<button 
										onClick={() => setSearchTerm("")}
										className="px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
									>
										Clear Search
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* CTA Section */}
				<div className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
					<div className="max-w-4xl mx-auto text-center px-4">
						<h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
						<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
							Our support team is ready to help you with any additional questions.
						</p>
						<a
							href="/contact"
							className="inline-block px-8 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
						>
							Contact Support
						</a>
					</div>
				</div>

				{/* Footer */}
				<footer className="py-16 bg-gray-900 text-gray-400">
					<div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-lg font-semibold text-white mb-4">Sustainable Food Optimization</h3>
							<p className="mb-4">Redistributing surplus food to combat hunger and reduce waste.</p>
							<div className="flex space-x-4">
								<a href="#" className="text-gray-400 hover:text-white">
									<span className="sr-only">Twitter</span>
									<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
									</svg>
								</a>
								<a href="#" className="text-gray-400 hover:text-white">
									<span className="sr-only">LinkedIn</span>
									<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
									</svg>
								</a>
							</div>
						</div>
						
						<div>
							<h4 className="font-semibold text-white mb-4">Platform</h4>
							<ul className="space-y-2">
								<li><a href="/features" className="hover:text-white transition">Features</a></li>
								<li><a href="/how-it-works" className="hover:text-white transition">How It Works</a></li>
								<li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
								<li><a href="/security" className="hover:text-white transition">Security</a></li>
								<li><a href="/case-studies" className="hover:text-white transition">Case Studies</a></li>
							</ul>
						</div>
						
						<div>
							<h4 className="font-semibold text-white mb-4">Resources</h4>
							<ul className="space-y-2">
								<li><a href="/blog" className="hover:text-white transition">Blog</a></li>
								<li><a href="/guides" className="hover:text-white transition">Guides</a></li>
								<li><a href="/webinars" className="hover:text-white transition">Webinars</a></li>
								<li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
								<li><a href="/api" className="hover:text-white transition">API Documentation</a></li>
							</ul>
						</div>
						
						<div>
							<h4 className="font-semibold text-white mb-4">Company</h4>
							<ul className="space-y-2">
								<li><a href="/about" className="hover:text-white transition">About Us</a></li>
								<li><a href="/careers" className="hover:text-white transition">Careers</a></li>
								<li><a href="/contact" className="hover:text-white transition">Contact</a></li>
								<li><a href="/partners" className="hover:text-white transition">Partners</a></li>
								<li><a href="/press" className="hover:text-white transition">Press</a></li>
							</ul>
						</div>
					</div>
					
					<div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm">
						<div className="md:flex md:items-center md:justify-between">
							<p>&copy; {new Date().getFullYear()} Sustainable Food Optimization. All rights reserved.</p>
							<div className="mt-4 md:mt-0">
								<ul className="flex space-x-6">
									<li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
									<li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
									<li><a href="/cookies" className="hover:text-white transition">Cookie Policy</a></li>
								</ul>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</MainNavLayout>
	);
};

export default FAQPage;