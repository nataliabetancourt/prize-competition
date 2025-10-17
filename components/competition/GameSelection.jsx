'use client';

import React, { useState } from 'react';

const GameSelection = ({ games, onSelect, translations, employeeName }) => {
  const [selectedGame, setSelectedGame] = useState('');

  const handleNext = () => {
    if (selectedGame) {
      onSelect(selectedGame);
    }
  };

  return (
    <div className="bg-purple-800/50 backdrop-blur-md rounded-3xl p-10 text-white">
      {/* Employee name in top right */}
      <div className="text-right mb-6">
        <p className="text-lg opacity-80">{employeeName}</p>
      </div>
      
      <h2 className="text-3xl font-bold mb-8 text-center">
        {translations.selectGame || 'Please select the game you are at:'}
      </h2>
      
      <div className="space-y-4">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full bg-purple-700/50 text-white border border-white/30 rounded-full px-6 py-4 text-lg appearance-none cursor-pointer focus:outline-none focus:border-white"
        >
          <option value="">{translations.selectGamePlaceholder || 'Select the game...'}</option>
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleNext}
          disabled={!selectedGame}
          className="w-full bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {translations.next || 'NEXT'} →
        </button>
      </div>
    </div>
  );
};

export default GameSelection;