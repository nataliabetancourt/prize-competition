'use client';

import React from 'react';

const SuccessScreen = ({ translations }) => {
  return (
    <div className="bg-purple-800/50 backdrop-blur-md rounded-3xl p-10 text-center text-white">
      <h1 className="text-3xl font-bold mb-8">
        {translations.successTitle || "You've submitted your results successfully"}
      </h1>
      
      <div className="mb-8">
        <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <p className="text-lg opacity-80">
        {translations.successMessage || 'Good luck!'}
      </p>
    </div>
  );
};

export default SuccessScreen;