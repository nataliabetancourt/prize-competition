"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; 
import { FaGlobe } from "react-icons/fa";
import logo from "./assets/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track which mobile dropdowns are open
  const [mobileTiresOpen, setMobileTiresOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const pathname = usePathname(); // Get current path

  // Detect current locale - simple approach
  const isSpanish = pathname.startsWith('/es');
  const currentLocale = isSpanish ? 'es' : 'en';

  // Handle language switching with direct browser navigation
  const switchLanguage = (newLocale) => {
    if (newLocale === currentLocale) return;
    
    // Get the current path
    let newPath;
    
    // Handle URLs with existing locale
    if (pathname.startsWith('/en/') || pathname.startsWith('/es/')) {
      // Simply replace the locale segment
      newPath = pathname.replace(`/${currentLocale}/`, `/${newLocale}/`);
    } 
    // Handle root locale paths
    else if (pathname === '/en' || pathname === '/es') {
      newPath = `/${newLocale}`;
    }
    // Handle paths with no locale yet
    else {
      // Add locale to the beginning
      newPath = `/${newLocale}${pathname}`;
    }
    
    // Use direct browser navigation for more reliable reload
    window.location.href = newPath;
  };

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Determine if current page should have transparent navbar
  const shouldBeTransparent = () => {
    // Home page
    if (pathname === '/' || pathname === '/en' || pathname === '/es') {
      return true;
    }
    
    // Location pages
    if (pathname.includes('/locations/')) {
      return true;
    }
    
    // Blog detail pages - match /blogs/something but not just /blogs
    if (pathname.includes('/blogs/') && !pathname.endsWith('/blogs')) {
      return true;
    }
    
    return false;
  };

  // Determine background style based on page and scroll state
  const navbarBackground = () => {
    if (shouldBeTransparent()) {
      if (scrolled) {
        // Transparent page but scrolled - show background
        return "bg-black/80 backdrop-blur-sm shadow-lg";
      } else {
        // Transparent page and not scrolled - transparent
        return "bg-transparent";
      }
    } else {
      // Not a transparent page - always show background
      return "bg-black/80 backdrop-blur-sm shadow-lg";
    }
  };

  // Helper function to get localized URL path
  const getLocalizedPath = (path) => {
    // Make sure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Remove leading locale if present
    let cleanPath = normalizedPath;
    if (normalizedPath.startsWith('/en/')) {
      cleanPath = normalizedPath.substring(3);
    } else if (normalizedPath.startsWith('/es/')) {
      cleanPath = normalizedPath.substring(3);
    } else if (normalizedPath === '/en' || normalizedPath === '/es') {
      cleanPath = '/';
    }
    
    // Add current locale
    return cleanPath === '/' ? `/${currentLocale}` : `/${currentLocale}${cleanPath}`;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300 ${navbarBackground()}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-12 md:h-16 relative"
          >
            <Link href={`/${currentLocale}`}>
              <Image
                src={logo}
                alt="Tire Store Service Center Logo"
                width={160}
                height={48}
                className="w-auto h-12 md:h-16"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center space-x-6 lg:space-x-10"
          >
            {/* Dashboard Link */}
            <Link 
              href={getLocalizedPath('/dashboard')}
              className="text-white font-medium hover:text-purple-300 transition-colors"
            >
              Dashboard
            </Link>
          
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="text-white font-medium flex items-center hover:text-purple-300 transition-colors"
              >
                <FaGlobe className="mr-1" />
                {currentLocale === 'en' ? 'EN' : 'ES'}
              </button>
              
              {/* Language dropdown */}
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 ${
                      currentLocale === 'en' ? 'font-medium bg-gray-100' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage('es')}
                    className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 ${
                      currentLocale === 'es' ? 'font-medium bg-gray-100' : ''
                    }`}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            {/* Mobile Dashboard Link */}
            <Link
              href={getLocalizedPath('/dashboard')}
              className="text-white font-medium mr-4 hover:text-purple-300 transition-colors"
            >
              Dashboard
            </Link>
            
            {/* Mobile Language Selector */}
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="text-white mr-4"
              aria-label="Toggle Language"
            >
              <FaGlobe className="h-5 w-5" />
            </button>
            
            {/* Mobile language dropdown */}
            {languageMenuOpen && (
              <div className="absolute top-14 right-16 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 ${
                    currentLocale === 'en' ? 'font-medium bg-gray-100' : ''
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage('es')}
                  className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 ${
                    currentLocale === 'es' ? 'font-medium bg-gray-100' : ''
                  }`}
                >
                  Español
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;