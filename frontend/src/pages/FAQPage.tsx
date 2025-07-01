import React, { useState } from "react";
import { Info, Users, Truck, HelpCircle, Search, HandHeart, PackageCheck } from "lucide-react";
import MainNavLayout from "../layouts/MainNavLayout";

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
	const [searchTerm, setSearchTerm] = useState("");

	const toggleQuestion = (id: string) => {
		setOpenQuestion((prev) => (prev === id ? null : id));
	};

	const filteredSections = faqSections.map((section) => ({
		...section,
		items: section.items.filter((item) =>
			item.question.toLowerCase().includes(searchTerm.toLowerCase())
		),
	}));

	return (
		<MainNavLayout>
			<section className="max-w-4xl mx-auto px-4 py-12">
				<h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
					Frequently Asked Questions
				</h1>
				<div className="flex justify-center px-4 py-8">
					<div className="flex items-center border rounded-md px-4 py-2 w-full max-w-4xl shadow-sm">
						<Search className="w-4 h-4 text-gray-400 mr-2" />
						<input
							type="text"
							placeholder="Search questions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full outline-none text-sm"
						/>
					</div>
				</div>

				<main className="px-4 pb-16 mx-auto w-full max-w-5xl">
					{filteredSections.map(
						(section, sectionIdx) =>
							section.items.length > 0 && (
								<div key={sectionIdx} className="mb-12">
									<div className="flex items-center text-purple-800 font-semibold text-xl mb-5">
										{section.icon}
										{section.title}
									</div>
									<div className="space-y-4">
										{section.items.map((item, itemIdx) => {
											const id = `${sectionIdx}-${itemIdx}`;
											const isOpen = openQuestion === id;

											return (
												<div
													key={id}
													className={`border rounded-lg shadow-sm transition-all duration-300 ${
														isOpen
															? "border-purple-300 shadow-md"
															: "border-gray-200"
													}`}
												>
													<button
														onClick={() => toggleQuestion(id)}
														className="w-full text-left px-6 py-5 flex justify-between items-center font-medium text-gray-800 hover:text-purple-800"
													>
														{item.question}
														<span className="text-purple-700 text-xl font-bold">
															{isOpen ? "−" : "+"}
														</span>
													</button>
													{isOpen && (
														<div className="px-7 pb-5 text-sm text-gray-700">
															<ul className="list-disc list-inside space-y-1">
																{item.answer.map((ans, ansIdx) => (
																	<li key={ansIdx}>{ans}</li>
																))}
															</ul>
														</div>
													)}
												</div>
											);
										})}
									</div>
								</div>
							)
					)}
				</main>
			</section>
		</MainNavLayout>
	);
};

export default FAQPage;
