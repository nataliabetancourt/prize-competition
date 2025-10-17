"use client";
// TestimonialCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import tire from "./assets/tire.png";

const testimonials = [
  {
    id: 1,
    text: "Great staff. I think that says it all. I recommend the Bridgeport!",
    author: "Julia Duh",
    date: "01/10/2025",
    bgColor: "bg-violet-600",
    textColor: "text-white",
  },
  {
    id: 2,
    text: "It's so refreshing to find honest mechanics!",
    author: "Brandon Thompson",
    date: "02/10/2025",
    bgColor: "bg-gray-300",
    textColor: "text-gray-800",
  },
  {
    id: 3,
    text: "This place is AWESOME the work is ALWAYS accurate reliable communicative...I highly recommend!!... I've had a water pump replacement and this time Brakes and Rotors EXCELLENT!",
    author: "Nikki Henderson",
    date: "01/31/2025",
    bgColor: "bg-white",
    textColor: "text-gray-800",
  },
  {
    id: 4,
    text: "I've been here several times and they're always very helpful and efficient with their work. Thank you for your help",
    author: "Salvador Juarez",
    date: "03/17/2025",
    bgColor: "bg-violet-600",
    textColor: "text-white",
  },
  {
    id: 5,
    text: "Was pleasantly surprised with my service! Very fair price, clean facility, very friendly staff and quick time. Went in for an oil change but I couldn't be happier",
    author: "Jacob Bradley",
    date: "03/10/2025",
    bgColor: "bg-gray-300",
    textColor: "text-gray-800",
  },
  {
    id: 6,
    text: "Best tire shop around, been here twice and I love them. Great prices, great service, no up charges, and my favorite no upgrades I didn't ask for an they move fast. This is how you win your customers.",
    author: "Steve Odame",
    date: "03/07/2025",
    bgColor: "bg-white",
    textColor: "text-gray-800",
  },
];

// Google Logo component
const GoogleLogo = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path
        fill="#4285F4"
        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
      />
      <path
        fill="#34A853"
        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
      />
      <path
        fill="#FBBC05"
        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
      />
      <path
        fill="#EA4335"
        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
      />
    </g>
  </svg>
);

const TestimonialCarousel = ({ translations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(null);
  const [width, setWidth] = useState(0);

  // Calculate visible testimonials based on screen width
  const getVisibleCount = () => {
    if (width < 640) return 1; // Mobile
    if (width < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const visibleTestimonials = getVisibleCount();
  const maxIndex = testimonials.length - visibleTestimonials;

  // Initialize on mount
  useEffect(() => {
    setIsMounted(true);
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!isMounted || !autoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, autoplay, isMounted]);

  // Navigation functions
  const nextSlide = () => {
    if (!isMounted) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!isMounted) return;
    setDirection("left");
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction === "right" ? 500 : -500,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction) => ({
      x: direction === "right" ? -500 : 500,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div className="w-full py-24 md:px-9 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="w-8 h-0.5 bg-violet-600"></div>
            <p className="mx-2 text-gray-700 font-medium tracking-wide">
              {translations.sectionTag}
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {translations.title}
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <GoogleLogo />
              </div>
              <span className="text-gray-800 font-medium">
                {translations.googleRating}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        {!isMounted ? (
          // Static version for SSR
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className={`${testimonial.bgColor} ${testimonial.textColor} rounded-lg shadow-lg p-6 flex flex-col min-h-[200px] md:min-h-[250px]`}
              >
                <div className="flex-grow">
                  <p className="text-lg mb-6">{testimonial.text}</p>
                </div>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm opacity-75">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Animated version for client
          <div
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 px-9 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                >
                  {testimonials
                    .slice(currentIndex, currentIndex + visibleTestimonials)
                    .map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`${testimonial.bgColor} ${testimonial.textColor} relative overflow-hidden rounded-lg shadow-lg p-6 flex flex-col min-h-[200px] md:min-h-[250px]`}
                      >
                        <div className="flex-grow">
                          <p className="text-lg mb-6">{testimonial.text}</p>
                        </div>
                        <div className="mt-auto">
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm opacity-75">
                            {testimonial.date}
                          </p>
                        </div>
                        <Image
                          src={tire}
                          alt="Tire BG"
                          width={160}
                          height={32}
                          className="absolute -bottom-11 -right-6"
                        />
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:bg-gray-100 focus:outline-none z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:bg-gray-100 focus:outline-none z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;