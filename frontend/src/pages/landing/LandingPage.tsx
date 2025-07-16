import React, { useEffect, useState } from "react";
import { ArrowRight, HeartHandshake, Leaf, Users } from "lucide-react";
import { motion, Variants, Easing } from "framer-motion";
import Lottie from "lottie-react";
import MainNavLayout from "../../layouts/MainNavLayout";
import aboutAnim from "../../assets/about.json";
import FoodPattern from "../../assets/FoodPattern.json";

function SimpleTypewriter({
  words,
  speed = 80,
  pause = 1500,
}: {
  words: string[];
  speed?: number;
  pause?: number;
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: number;
    const current = words[wordIndex % words.length];
    const delta = deleting ? speed / 2 : speed;

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    } else {
      timeout = window.setTimeout(() => {
        setText((t) =>
          deleting
            ? current.substring(0, t.length - 1)
            : current.substring(0, t.length + 1)
        );
      }, delta);
    }
    return () => window.clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return (
    <span className="whitespace-nowrap font-medium">
      {text}
      <span className="inline-block animate-blink font-light">|</span>
    </span>
  );
}

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
    <rect
      x="14"
      y="20"
      width="20"
      height="10"
      rx="2"
      stroke="#6366F1"
      strokeWidth="2"
    />
    <circle cx="18" cy="32" r="2" stroke="#6366F1" strokeWidth="2" />
    <circle cx="30" cy="32" r="2" stroke="#6366F1" strokeWidth="2" />
  </svg>
);

// --- Framer variants ---
const blobVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      repeat: Infinity,
      duration: 8,
      ease: ["easeInOut"] as Easing[],
    },
  },
};

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const features = [
  {
    title: "Food Waste Crisis",
    desc: "Over 1.3 billion tons of food is wasted each year while millions remain hungry.",
    icon: WasteIcon,
    link: "/about",
  },
  {
    title: "Environmental Impact",
    desc: "Reducing food waste means cutting methane emissions and preserving resources.",
    icon: EcoIcon,
    link: "/about",
  },
  {
    title: "Equity & Access",
    desc: "Optimized food distribution ensures fair access to nutritious food for all communities.",
    icon: EquityIcon,
    link: "/about",
  },
];

const howItWorks = [
  {
    title: "Donors",
    desc: "Easily list surplus food items with a few clicks.",
    icon: DonorIcon,
    link: "/faq/donor",
  },
  {
    title: "Recipients",
    desc: "Browse available donations and request what’s needed.",
    icon: RecipientIcon,
    link: "/faq/recipient",
  },
  {
    title: "Logistics",
    desc: "Coordinate fast, eco‑conscious deliveries to recipients.",
    icon: LogisticsIcon,
    link: "/faq/logistics",
  },
];

const stats = [
  { value: "1.3B+", label: "Tons of food wasted annually", icon: WasteIcon },
  { value: "820M", label: "People facing hunger daily", icon: Users },
  { value: "10%", label: "Global emissions from food waste", icon: Leaf },
];

const partners = [
  { name: "UN Food Programme", logo: "/assets/images/un.png" },
  { name: "Feeding America", logo: "/assets/images/wpf.png" },
  { name: "Food Recovery Network", logo: "/assets/images/clean.png" },
];

const timeline = [
  { year: "2020", event: "Platform concept developed during food crisis" },
  { year: "2021", event: "Beta launch in 3 cities with 50+ partners" },
  { year: "2022", event: "National expansion with logistics integration" },
  { year: "2023", event: "AI-powered matching system implemented" },
];
const testimonials = [
  {
    quote:
      "This platform helped us redirect 3 tons of surplus food to communities in need last quarter.",
    author: "Sarah Johnson",
    role: "Food Service Director, FreshMarket Co.",
  },
  {
    quote:
      "As a small shelter, we've been able to reliably source fresh produce through this network.",
    author: "Miguel Rodriguez",
    role: "Director, Hope Community Shelter",
  },
];

const LandingPage: React.FC = () => {
  const [impact] = useState(25000);
  return (
    <MainNavLayout>
      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero.png"
            alt="Community sharing food"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/40 to-indigo-900/80" />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Lottie
              animationData={FoodPattern}
              className="w-full h-full opacity-30"
            />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 space-y-6">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-xl leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          >
            <SimpleTypewriter
              words={[
                "Reduce Waste.",
                "Feed Communities.",
                "Transform Food Systems.",
              ]}
            />
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg md:text-xl text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
          >
            Connecting surplus food with communities in need through intelligent
            matching and sustainable logistics.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.a
              href="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition-transform duration-300 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.2, duration: 0.8 },
              }}
            >
              Join Our Network
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/about"
              className="inline-flex items-center justify-center bg-white/20 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:bg-white/30 transition-colors duration-300 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.4, duration: 0.8 },
              }}
            >
              How It Works
            </motion.a>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.8 } }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="text-white w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHY IT MATTERS */}
      <section
        className={`py-24 bg-gradient-to-br from-purple-50 to-indigo-50`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-4xl font-bold text-purple-700 mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
            >
              Solving the Food Waste Crisis
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
              custom={0.5}
            >
              Our platform addresses critical challenges in the food supply
              chain through technology and community collaboration.
            </motion.p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const IconComp = f.icon;
              return (
                <motion.div
                  key={f.title}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-purple-100"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <IconComp />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{f.desc}</p>
                  <a
                    href={f.link}
                    className="text-purple-600 font-medium inline-flex items-center hover:underline"
                  >
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Impact Visualization */}
          <motion.div
            className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariant}
            custom={3}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">
                  Our Collective Impact
                </h3>
                <p className="text-gray-600 mb-4">
                  Since our launch, we've facilitated the redistribution of:
                </p>
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {impact.toLocaleString()}+
                </div>
                <p className="text-lg text-gray-700">
                  Meals to communities in need
                </p>
              </div>
              <div className="w-full md:w-2/5">
                <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-4 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>2021 Launch</span>
                  <span>Current Impact</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-4xl font-bold text-purple-700 mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
            >
              Streamlined Food Recovery
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
              custom={0.5}
            >
              Our three-step process makes food recovery simple, efficient, and
              impactful
            </motion.p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {howItWorks.map((h, i) => {
              const IconComp = h.icon;
              return (
                <motion.div
                  key={h.title}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-purple-100"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <span className="text-purple-700 font-bold">{i + 1}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <IconComp />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">
                    {h.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{h.desc}</p>
                  <a
                    href={h.link}
                    className="text-purple-600 font-medium inline-flex items-center hover:underline"
                  >
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits Section */}
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariant}
            custom={3}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Environmental</h3>
                <p>Reduce methane emissions from landfills</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Social</h3>
                <p>Strengthen community food security</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Economic</h3>
                <p>Reduce disposal costs for businesses</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p>Build partnerships across sectors</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS & PARTNERS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
            >
              <h2 className="text-4xl font-bold text-purple-700 mb-6">
                Trusted by Food System Leaders
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of organizations already creating positive change
                through our platform
              </p>

              <div className="grid grid-cols-3 gap-6">
                {partners.map((partner, i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-lg p-4 flex items-center justify-center h-24 border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <img
                      src={partner.logo}
                      height={"199px"}
                      width={"188px"}
                      alt={partner.name}
                      className="max-h-12 max-w-full object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
              custom={1}
            >
              <h2 className="text-4xl font-bold text-purple-700 mb-6">
                Success Stories
              </h2>

              <div className="space-y-6">
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <p className="text-gray-700 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="text-purple-700 font-bold">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* OUR STORY */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariant}
            custom={2}
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">
                  Our Journey
                </h3>
                <p className="text-gray-700 mb-6">
                  Founded in 2024 during the global food crisis, our platform
                  has evolved into a comprehensive solution connecting all
                  stakeholders in the food recovery ecosystem.
                </p>

                <div className="space-y-4 mb-8">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="font-bold text-purple-700">
                            {item.year}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="/about"
                  className="inline-flex items-center text-purple-600 font-semibold hover:underline"
                >
                  Read Our Full Story <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>

              <div className="bg-gray-100 min-h-[400px] flex items-center justify-center p-4">
                <Lottie animationData={aboutAnim} className="w-full max-w-md" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        custom={3}
      >
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-2xl"
          variants={blobVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"
          variants={blobVariants}
          animate="animate"
        />

        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8">
            Join our network of food system changemakers today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform hover:scale-105 whitespace-nowrap"
            >
              I'm a Food Donor
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform hover:scale-105 whitespace-nowrap"
            >
              I'm a Recipient
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-purple-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform hover:scale-105 whitespace-nowrap"
            >
              Logistics Partner
            </a>
          </div>

          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="mb-4">Have questions about getting started?</p>
            <a
              href="/contact"
              className="inline-flex items-center text-white/90 hover:text-white underline"
            >
              Contact our team <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Sustainable Food Optimization
            </h3>
            <p className="mb-4">
              Redistributing surplus food to combat hunger and reduce waste.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a href="/features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-white transition">
                  Security
                </a>
              </li>
              <li>
                <a href="/case-studies" className="hover:text-white transition">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-white transition">
                  Guides
                </a>
              </li>
              <li>
                <a href="/webinars" className="hover:text-white transition">
                  Webinars
                </a>
              </li>
              <li>
                <a href="/faq/:rol" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/api" className="hover:text-white transition">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/partners" className="hover:text-white transition">
                  Partners
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-white transition">
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm">
          <div className="md:flex md:items-center md:justify-between">
            <p>
              &copy; {new Date().getFullYear()} Sustainable Food Optimization.
              All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="hover:text-white transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes blink { 0%,100%{ opacity: 1 } 50%{ opacity: 0 } }
        .animate-blink { animation: blink 1s step-start infinite }
        @keyframes slow-pulse { 0%,100%{ opacity: .3 } 50%{ opacity: .6 } }
        .animate-slow-pulse { animation: slow-pulse 5s ease-in-out infinite }
      `}</style>
    </MainNavLayout>
  );
};

export default LandingPage;
