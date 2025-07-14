import React, { useState } from "react";
import MainNavLayout from "../layouts/MainNavLayout";
import { submitContactMessage } from "../services/contactService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    subject: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phoneNumber: form.phone,
        subject: form.subject || "Contact Form",
        message: form.message,
      });
      toast.success("Thank you! Your message has been sent.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail className="text-2xl text-purple-600" />,
      title: "Email Us",
      content: "support@foodshare.org",
      link: "mailto:support@foodshare.org",
    },
    {
      icon: <FiPhone className="text-2xl text-purple-600" />,
      title: "Call Us",
      content: "+251 911 234 567",
      link: "tel:+251911234567",
    },
    {
      icon: <FiMapPin className="text-2xl text-purple-600" />,
      title: "Visit Us",
      content: "Bole Road, Addis Ababa, Ethiopia",
      link: "https://maps.app.goo.gl/",
    },
  ];

  return (
    <MainNavLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-16 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-purple-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-purple-500 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Have questions or feedback? Our team is ready to assist you with any inquiries about our platform.
          </motion.p>
        </div>

        {/* Contact Container */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 h-full"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Contact Information</h2>
              
              <div className="space-y-8 mb-12">
                {contactInfo.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link} 
                    className="flex items-start group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="mr-4 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mt-1 group-hover:text-purple-600 transition">
                        {item.content}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiClock className="text-purple-600 mr-2" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[
                    { name: "Twitter", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                    { name: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                    { name: "LinkedIn", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href="#"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      aria-label={social.name}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-purple-100"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Your Name"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="you@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="+251 ___ ___ ___"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="How can we help?"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Tell us about your inquiry..."
                    disabled={loading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
          
          {/* Map Section */}
          <motion.div 
            className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Headquarters</h3>
                <p className="text-gray-600 mb-6">
                  Visit our main office in Addis Ababa to discuss partnership opportunities, 
                  platform demonstrations, or any other inquiries.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMapPin className="text-purple-600 mr-3 text-xl" />
                    <span className="text-gray-700">Tafo Block 219, Addis Ababa, Ethiopia</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="text-purple-600 mr-3 text-xl" />
                    <span className="text-gray-700">+251 911 234 567</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="text-purple-600 mr-3 text-xl" />
                    <span className="text-gray-700">info@foodshare.org</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                {/* Map Image */}
                <div className="w-full h-full overflow-hidden">
                  <img 
                    src="/assets/images/map.png" 
                    alt="FoodShare Headquarters Location" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainNavLayout>
  );
};

export default ContactPage;