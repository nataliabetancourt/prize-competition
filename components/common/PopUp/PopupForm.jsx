// PopupForm.jsx
import React, { useState, useEffect } from "react";

const PopupForm = ({ isOpen, onClose, openFromButton }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    consent: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.consent) {
      errors.consent = "You must agree to the terms";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await fetch("https://formspree.io/f/manebekp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            consentGiven: formData.consent ? "Yes" : "No",
            source: openFromButton ? "Button Click" : "Timed Popup",
          }),
        });

        if (response.ok) {
          setSubmitSuccess(true);
          // Reset form after successful submission
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            consent: false,
          });

          // Auto close after 3 seconds on success
          setTimeout(() => {
            onClose();
            setSubmitSuccess(false);
          }, 3000);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({ submit: "Failed to submit form. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a21] text-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition"
          aria-label="Close"
        >
          &times;
        </button>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="mb-4">
              Your 10% discount has been sent to your email.
            </p>
            <p>Please check your inbox for details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-xl font-bold text-center mb-6">
              To get 10% off your first visit, let us know where to send it!
            </h2>

            {/* Full Name Field */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block mb-2">
                Full Name*
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ej. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-gray-100 text-gray-800 ${
                  formErrors.fullName ? "border-2 border-red-500" : ""
                }`}
              />
              {formErrors.fullName && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ej. johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-gray-100 text-gray-800 ${
                  formErrors.email ? "border-2 border-red-500" : ""
                }`}
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2">
                Phone number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Ej. 111-222-3333"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-gray-100 text-gray-800 ${
                  formErrors.phone ? "border-2 border-red-500" : ""
                }`}
              />
              {formErrors.phone && (
                <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                />
                <span className="text-sm">
                  By clicking 'Submit,' you agree to our TOC, Privacy Policy,
                  and consent to receive marketing communications and
                  newsletters.
                </span>
              </label>
              {formErrors.consent && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.consent}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold rounded transition duration-200"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>

            {formErrors.submit && (
              <p className="text-red-400 text-sm mt-2 text-center">
                {formErrors.submit}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PopupForm;
