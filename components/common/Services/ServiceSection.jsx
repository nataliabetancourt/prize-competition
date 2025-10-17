"use client";

import React from "react";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import tireImg from "./assets/tires-img.png";
import alignmentImg from "./assets/alignments-img.png";
import brakeImg from "./assets/brake-img.png";
import oilImg from "./assets/oil-img.png";
// Import additional images for the extra services:
import acImg from "./assets/ac-img.png";
import mechanicalImg from "./assets/mechanical-img.png";
import stateImg from "./assets/state-inspection-img.png";
import towingImg from "./assets/towing-img.png";

const ServiceSection = ({ translations, limit = 4 }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en';

  const allServices = [
    {
      title: translations?.servicesList?.tireAndWheel || "Tire and Wheel Services",
      imageSrc: tireImg,
      link: `/${locale}/tire-and-wheel-services`,
    },
    {
      title: translations?.servicesList?.alignments || "Alignments",
      imageSrc: alignmentImg,
      link: `/${locale}/alignments`,
    },
    {
      title: translations?.servicesList?.brakeRepair || "Brake Repair",
      imageSrc: brakeImg,
      link: `/${locale}/brake-repair`,
    },
    {
      title: translations?.servicesList?.lubeOilsFilters || "Lube, Oils and Filters",
      imageSrc: oilImg,
      link: `/${locale}/lube-oils-and-filters`,
    },
    {
      title: translations?.servicesList?.acService || "AC Service",
      imageSrc: acImg,
      link: `/${locale}/ac-service`,
    },
    {
      title: translations?.servicesList?.mechanicalRepairs || "Mechanical Repairs",
      imageSrc: mechanicalImg,
      link: `/${locale}/mechanical-repairs`,
    },
    {
      title: translations?.servicesList?.stateInspection || "Texas State Inspection",
      imageSrc: stateImg,
      link: `/${locale}/state-inspection`,
    },
    {
      title: translations?.servicesList?.towing || "Towing",
      imageSrc: towingImg,
      link: `/${locale}/towing`,
    },
  ];

  // Use the limit prop to determine how many services to display.
  const services = allServices.slice(0, limit);

  const handleViewAllClick = () => {
    router.push(`/${locale}/services`);
  };

  return (
    <section className="px-4 pt-32 pb-24 md:px-9 lg:px-20 bg-white">
      <div className="container mx-auto ">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-4"
          >
            <div className="w-8 h-1 bg-violet-600 mr-3"></div>
            <p className="text-gray-700 uppercase font-medium tracking-wide">
              {translations?.sectionTag || "OUR SERVICES"}
            </p>
          </motion.div>

          <div className="md:flex md:items-start md:justify-between align-center">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-6 md:mb-0 md:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {translations?.title || "Our Automotive Services"}
            </motion.h2>

            <motion.p
              className="text-gray-600 md:w-1/2 lg:text-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {translations?.description || "We provide comprehensive auto repair and maintenance services to keep your vehicle running smoothly."}
            </motion.p>
          </div>
        </div>

        <ServiceCard services={services} />

        {/* Only display the "VIEW ALL SERVICES" button if we're showing the limited view */}
        {limit === 4 && (
          <div className="flex flex-col md:flex-row items-center justify-center">
            <motion.h3
              className="text-xl text-center mx-4 md:text-2xl font-bold text-gray-800 mb-6 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {translations?.moreQuestion || "Looking for something specific?"}
            </motion.h3>

            <motion.button
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium mx-4 py-3 px-6 rounded-lg w-full md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewAllClick}
            >
              {translations?.viewAllButton || "VIEW ALL SERVICES"}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceSection;