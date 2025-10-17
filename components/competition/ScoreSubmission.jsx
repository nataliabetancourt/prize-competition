'use client';

import React, { useState, useRef } from 'react';

const ScoreSubmission = ({ onSubmit, translations, employeeName, gameName, loading, error }) => {
  const [score, setScore] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score && imageFile) {
      onSubmit(score, imageFile);
    }
  };

  return (
    <div className="bg-purple-800/50 backdrop-blur-md rounded-3xl p-10 text-white">
      {/* Employee name in top right */}
      <div className="text-right mb-6">
        <p className="text-lg opacity-80">{employeeName}</p>
      </div>
      
      <h2 className="text-3xl font-bold mb-8 text-center">
        {translations.provideInfo || 'Provide the following information:'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors"
          >
            {imageFile 
              ? translations.changeImage || 'CHANGE IMAGE' 
              : translations.uploadGameScore || 'UPLOAD IMAGE OF GAME SCORE'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            required
          />
          
          {imagePreview && (
            <div className="mt-4 rounded-lg overflow-hidden max-h-48">
              <img 
                src={imagePreview} 
                alt="Score preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Score input */}
        <div>
          <label className="block text-lg mb-2">
            {translations.writeScore || 'Please write the score here:'}
          </label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder={translations.scorePlaceholder || 'Ex. 250'}
            className="w-full bg-purple-700/50 text-white border border-white/30 rounded-full px-6 py-4 text-lg placeholder-white/50 focus:outline-none focus:border-white"
            required
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !score || !imageFile}
          className="w-full bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading 
            ? translations.submitting || 'SUBMITTING...' 
            : translations.submit || 'SUBMIT'}
        </button>
        
        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ScoreSubmission;