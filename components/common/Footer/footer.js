"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.footer
      className="bg-zinc-800 text-white py-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright Text */}
          <p className="text-sm text-gray-300 mb-4 md:mb-0">
            © Copyright 2021 TIRESTORE SERVICE CENTER by eMETHOD Inc.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
