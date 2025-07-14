// src/pages/AboutPage.tsx
"use client";

import React from "react";
import MainNavLayout from "../layouts/MainNavLayout";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";
import { FaLinkedin, FaGithub, FaChartLine, FaHandHoldingHeart, FaUsers, FaCalendarAlt } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import { HandHeart, PackageCheck, Truck } from "lucide-react";

// ——————————————————
// Data
// ——————————————————
const stats = [
  { label: "Meals Rescued", value: 12500, icon: FaHandHoldingHeart },
  { label: "Active Donors", value: 850, icon: FaUsers },
  { label: "Community Partners", value: 47, icon: FaUsers },
  { label: "Volunteer Network", value: 320, icon: FaUsers },
];

const timeline = [
  { year: "Oct 2024", event: "Project Inception & Research" },
  { year: "Nov 2024", event: "System Analysis & Requirements Gathering" },
  { year: "Dec 2024", event: "System Architecture Design" },
  { year: "Jan-May 2025", event: "Development & Testing Phase" },
  { year: "June 2025", event: "Pilot Launch in Addis Ababa" },
  { year: "July 2025", event: "Full Platform Deployment" },
];

const team = [
  {
    name: "Yonatan Girmachew",
    role: "Frontend Engineering",
    image: "/assets/images/dev1.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Dagim Sisay",
    role: "Backend Development",
    image: "/assets/images/dev2.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Mohammed Elamin",
    role: "UI/UX Design",
    image: "/assets/images/dev3.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Lealem Mekuria",
    role: "Project Management",
    image: "/assets/images/dev4.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Abiyu Nigussie",
    role: "Full Stack Development",
    image: "/assets/images/dev5.jpg",
    linkedin: "#",
    github: "#",
  },
];

const values = [
  {
    title: "Sustainability",
    description: "Minimizing environmental impact through waste reduction",
    icon: <LeafIcon />
  },
  {
    title: "Equity",
    description: "Ensuring fair access to nutritious food for all communities",
    icon: <ScaleIcon />
  },
  {
    title: "Innovation",
    description: "Leveraging technology to solve systemic challenges",
    icon: <LightbulbIcon />
  },
  {
    title: "Community",
    description: "Building partnerships that strengthen local resilience",
    icon: <CommunityIcon />
  }
];

// Custom Icons
function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ——————————————————
// Component
// ——————————————————
export default function AboutPage() {
  return (
    <MainNavLayout>
      {/* Removed space-y classes to control spacing manually */}
      <div>
        {/* HERO */}
        <section className="relative h-[70vh] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80" />
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{ backgroundImage: "url('/assets/images/about.png')" }}
          />
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              Transforming Food Systems
            </motion.h1>
            <motion.div 
              className="w-24 h-1 bg-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "6rem", transition: { delay: 0.4, duration: 0.8 } }}
            />
            <motion.p 
              className="text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
            >
              FoodShare connects surplus with need through intelligent technology and community partnership
            </motion.p>
          </motion.div>
        </section>

        {/* MISSION */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  FoodShare exists to create a world where surplus food becomes a solution, 
                  not waste. We're building an ecosystem that transforms food recovery into 
                  an efficient, scalable, and community-driven process.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">Vision Statement</h3>
                  <p className="text-gray-700">
                    To become Ethiopia's leading food recovery network, eliminating hunger through 
                    technology-enabled food redistribution by 2030.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-6 shadow-md border border-purple-50 text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <stat.icon className="text-purple-600 text-2xl" />
                    </div>
                    <InView triggerOnce>
                      {({ inView, ref }) => (
                        <div ref={ref} className="text-3xl font-bold text-purple-700 mb-1">
                          {inView ? <CountUp end={stat.value} duration={2} /> : 0}+
                        </div>
                      )}
                    </InView>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                Addressing Food System Challenges
              </h2>
              <p className="text-lg text-gray-600">
                We're tackling systemic inefficiencies at the intersection of food waste and hunger
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  The Problem
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">30% of Ethiopia's agricultural output</span> is lost post-harvest
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">20% of the population</span> faces severe food insecurity
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      Manual coordination leads to <span className="font-medium">food spoilage and mismatches</span>
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      Lack of real-time data prevents <span className="font-medium">efficient resource allocation</span>
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  Our Solution
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">Digital platform</span> connecting donors with verified recipients
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">AI-powered matching</span> algorithm optimizing distribution
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">Real-time logistics coordination</span> minimizing spoilage
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="ml-3">
                      <span className="font-medium">Data analytics</span> for continuous system improvement
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                Principles that guide our mission and operations
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-b from-white to-purple-50 rounded-2xl p-8 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600">
                Milestones in our development and impact expansion
              </p>
            </div>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-purple-200 hidden md:block"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex flex-col md:flex-row ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="md:w-1/2 md:px-8 mb-4 md:mb-0">
                      <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <div className="flex items-center mb-3">
                          <FaCalendarAlt className="text-purple-600 mr-2" />
                          <span className="text-lg font-semibold text-purple-700">{item.year}</span>
                        </div>
                        <p className="text-gray-700">{item.event}</p>
                      </div>
                    </div>
                    
                    {/* Middle dot */}
                    <div className="hidden md:flex items-center justify-center md:w-0 relative">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-white z-10"></div>
                    </div>
                    
                    {/* Empty space for alternating sides */}
                    <div className="md:w-1/2 md:px-8"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-gray-600">
                The passionate individuals driving our mission forward
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {team.map((dev, idx) => (
                <Tilt key={dev.name} glareEnable glareMaxOpacity={0.1} scale={1.02} glareBorderRadius="12px">
                  <motion.div
                    className="bg-gradient-to-b from-white to-purple-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="p-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                        <img
                          src={dev.image}
                          alt={dev.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">{dev.name}</h3>
                      <p className="text-purple-600 text-center mb-4">{dev.role}</p>
                      <div className="flex justify-center space-x-4 text-gray-600">
                        <a href={dev.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer" className="hover:text-purple-700 transition">
                          <FaLinkedin className="text-xl" />
                        </a>
                        <a href={dev.github} aria-label="GitHub" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition">
                          <FaGithub className="text-xl" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20  pb-25">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Join the Food Recovery Movement
            </motion.h2>
            <motion.p
              className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Whether you're a donor, recipient, or logistics partner, your participation creates impact
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
            <a
              href="/register"
              className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-purple-50 flex items-center justify-center group"
            >
              <HandHeart className="w-5 h-5 mr-2 text-purple-600 group-hover:text-purple-800 transition-colors" />
              Become a Donor
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-indigo-50 flex items-center justify-center group"
            >
              <PackageCheck className="w-5 h-5 mr-2 text-indigo-600 group-hover:text-indigo-800 transition-colors" />
              Register as Recipient
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-white border-2 border-green-600 text-green-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-green-50 flex items-center justify-center group"
            >
              <Truck className="w-5 h-5 mr-2 text-green-600 group-hover:text-green-800 transition-colors" />
              Register as Logistics Partner
            </a>
            </motion.div>
          </div>
        </section>

        {/* FOOTER - Fixed spacing */}
        <footer className="mt-0 py-16 bg-gray-900 text-gray-400">
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
}