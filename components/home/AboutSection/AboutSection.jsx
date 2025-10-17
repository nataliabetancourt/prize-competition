"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import tireBg from "./assets/tires-background.png";

export default function AboutSection({ translations }) {
  // Animation variants - similar to your LandingSection
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative px-4 py-20 lg:px-20 w-full overflow-hidden bg-black text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={tireBg}
            alt="Tire background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <motion.div
        className="container mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-start"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Left column */}
        <div className="md:w-1/2 lg:w-5/12 z-30 md:pr-8 mb-8 md:mb-0">
          <motion.div className="flex items-center mb-4" variants={fadeInUp}>
            <div className="w-8 h-1 bg-purple-700 mr-4"></div>
            <h2 className="text-sm md:text-base font-medium uppercase tracking-wider">
              {translations.sectionTag}
            </h2>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 leading-tight"
            variants={fadeInLeft}
          >
            {translations.title}
          </motion.h1>
        </div>

        {/* Right column */}
        <div className="bg-black bg-blend-multiply opacity-75 px-8 py-6 rounded-lg md:w-1/2 lg:w-7/12 z-30">
          <motion.p
            className="text-md md:text-md mb-6 leading-relaxed"
            variants={fadeInUp}
          >
            {translations.paragraph1}
          </motion.p>

          <motion.p
            className="text-md md:text-md leading-relaxed"
            variants={fadeInUp}
          >
            {translations.paragraph2}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}