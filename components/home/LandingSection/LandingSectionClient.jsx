"use client";

import React, { useState, useEffect, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// Define image dimensions to help with rendering
const IMG_WIDTH = 1920;
const IMG_HEIGHT = 1080;

// Create a placeholder for smooth loading
const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${IMG_WIDTH} ${IMG_HEIGHT}'%3E%3Crect width='${IMG_WIDTH}' height='${IMG_HEIGHT}' fill='%23111827'/%3E%3C/svg%3E`;

// Statically import your images to ensure they're available
import bg1 from "./assets/bg1.webp";
import bg2 from "./assets/bg2.webp";
import bg3 from "./assets/bg3.webp";

// Setup image array properly
const backgroundImages = [bg1, bg2, bg3];


// Memoized Slideshow component to prevent unnecessary re-renders
const BackgroundSlideshow = memo(function BackgroundSlideshow({ currentIndex }) {
  return (
    <div className="absolute inset-0 z-0 opacity-0 lg:opacity-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={backgroundImages[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(50%)" }}
            loading="eager"
            placeholder="blur" 
            blurDataURL={placeholderSvg}
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});



function LandingSectionClient() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  
  useEffect(() => {


    // Image rotation timing
    const initialDelay = 5000; // 5 seconds for first image
    const switchInterval = 5000; // 5 seconds between each subsequent image
    
    // Start cycling backgrounds after showing the first image
    const imageTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }, switchInterval);
    }, initialDelay);
    
    // Clean up all timers on unmount
    return () => {
      clearTimeout(imageTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <BackgroundSlideshow currentIndex={currentImageIndex} />
    </>
  );
}

export default memo(LandingSectionClient);