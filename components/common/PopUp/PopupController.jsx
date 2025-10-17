"use client";

import React, { useState, useEffect } from "react";
import PopupForm from "./PopupForm";

const PopupController = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openedFromButton, setOpenedFromButton] = useState(false);
  const [hasPopupShown, setHasPopupShown] = useState(false);

  // Check if user has previously closed the popup in this session
  useEffect(() => {
    const popupClosed = sessionStorage.getItem("popupClosed");
    if (!popupClosed) {
      // Show popup after 5 seconds if it hasn't been closed before
      const timer = setTimeout(() => {
        if (!hasPopupShown) {
          setOpenedFromButton(false);
          setIsPopupOpen(true);
          setHasPopupShown(true);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [hasPopupShown]);

  // Function to open popup when button is clicked
  const handleButtonClick = () => {
    setOpenedFromButton(true);
    setIsPopupOpen(true);
  };

  // Function to close popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Set session storage to remember that popup was closed
    sessionStorage.setItem("popupClosed", "true");
  };

  // Find and attach click handler to all "GET 10% OFF" buttons
  useEffect(() => {
    const discountButtons = document.querySelectorAll(
      'button, a, [role="button"]'
    );
    const matchingButtons = Array.from(discountButtons).filter((button) => {
      const buttonText = button.textContent || "";
      return (
        buttonText.includes("GET 10% OFF") ||
        buttonText.includes("10% OFF MY FIRST VISIT") ||
        buttonText.includes("10% OFF")
      );
    });

    matchingButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation if it's a link
        handleButtonClick();
      });
    });

    return () => {
      matchingButtons.forEach((button) => {
        button.removeEventListener("click", handleButtonClick);
      });
    };
  }, []);

  return (
    <>
      <PopupForm
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        openFromButton={openedFromButton}
      />

      {/* Optional debugging button - you can remove this in production */}
      {/* 
      <button 
        onClick={handleButtonClick}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded"
      >
        Open Discount Popup
      </button>
      */}
    </>
  );
};

export default PopupController;
