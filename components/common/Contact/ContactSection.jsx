"use client"; // For Next.js 13+ app directory
import React from "react";
import { motion } from "framer-motion";

const ContactSection = ({ translations }) => {
  const locations = [
    { name: translations?.locations?.central || "CENTRAL", phone: "(817) 986-0016" },
    { name: translations?.locations?.bedford || "BEDFORD", phone: "(817) 571-2453" },
    { name: translations?.locations?.euless || "EULESS", phone: "(469) 200-3997" },
    { name: translations?.locations?.saginaw || "SAGINAW", phone: "(682) 250-5337" },
    { name: translations?.locations?.palestine || "PALESTINE", phone: "(903) 729-8594" },
    { name: translations?.locations?.coppell || "COPPELL", phone: "(817) 952-8532" },
    { name: translations?.locations?.cleburne || "CLEBURNE", phone: "(817) 405-2456" },
    { name: translations?.locations?.bridgeport || "BRIDGEPORT", phone: "(940) 343-0900" },
    { name: translations?.locations?.greenville || "GREENVILLE", phone: "(903) 455-0591" },
    { name: translations?.locations?.bowie || "BOWIE", phone: "(940) 872-6157" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-white py-24 px-4 md:px-9 lg:px-20 text-gray-900">
      <div className="container mx-auto px-4 pt-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-1 bg-violet-600 mr-3"></div>
            <h3 className="text-gray-700 font-medium tracking-wide">
              {translations?.sectionLabel || "CONTACT US"}
            </h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {translations?.title || "Call Us Anytime!"}
          </h2>
        </motion.div>

        {/* Location Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {locations.map((location, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-sm flex items-start hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {location.name}
                </h3>
                <p className="text-gray-600">{location.phone}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;