"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QuoteRequestForm = ({ translations }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    vehicleYear: "",
    vehicleMakeModel: "",
    name: "",
    email: "",
    phone: "",
    preferredLocation: "",
    preferredContactMethod: "",
  });

  // Get locations from translations
  const locations = [
    translations.locations.selectLocation,
    translations.locations.bedford,
    translations.locations.euless,
    translations.locations.saginaw,
    translations.locations.coppell,
    translations.locations.cleburne,
    translations.locations.bridgeport,
    translations.locations.greenville,
    translations.locations.bowie,
    translations.locations.palestine,
  ];

  // Get contact methods from translations
  const contactMethods = [
    translations.contactMethods.selectMethod,
    translations.contactMethods.text,
    translations.contactMethods.phoneCall,
    translations.contactMethods.email,
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/xkgjvgpw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form data including the preferredContactMethod field
        setFormData({
          vehicleYear: "",
          vehicleMakeModel: "",
          name: "",
          email: "",
          phone: "",
          preferredLocation: "",
          preferredContactMethod: "",
        });
      } else {
        alert("There was an error submitting the form.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting the form.");
    }
  };

  const closePopup = () => {
    setSubmitSuccess(false);
  };

  return (
    <div className="px-4 py-24 md:px-9 lg:px-20 bg-gray-50 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mb-4 text-center"
          >
            <div className="w-8 h-1 bg-violet-600 mr-3"></div>
            <p className="text-gray-700 uppercase font-medium tracking-wide">
              {translations.sectionTag}
            </p>
          </motion.div>

          <div className="flex align-center justify-center text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {translations.title}
            </motion.h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 md:px-24">
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type="text"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleChange}
                placeholder={translations.form.vehicleYear}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
              />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type="text"
                name="vehicleMakeModel"
                value={formData.vehicleMakeModel}
                onChange={handleChange}
                placeholder={translations.form.vehicleMakeModel}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
              />
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={translations.form.name}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
              />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={translations.form.email}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
              />
            </motion.div>
          </div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <div className="flex items-center">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={translations.form.phone}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                maxLength="12"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-2">
              {translations.form.phoneFormat}
            </p>
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <div className="relative">
              <select
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 appearance-none"
              >
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </motion.div>

          {/* New dropdown for Preferred Contact Method */}
          <motion.div whileFocus={{ scale: 1.02 }} className="relative mt-4">
            <div className="relative">
              <select
                name="preferredContactMethod"
                value={formData.preferredContactMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 appearance-none"
              >
                {contactMethods.map((method, index) => (
                  <option key={index} value={index === 0 ? "" : method}>
                    {method}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-all duration-300 ease-in-out"
          >
            {translations.form.submitButton}
          </motion.button>
        </form>
      </motion.div>

      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-lg text-center max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">{translations.form.successTitle}</h2>
              <p className="mb-4">{translations.form.successMessage}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closePopup}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-all duration-300 ease-in-out"
              >
                {translations.form.closeButton}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteRequestForm;