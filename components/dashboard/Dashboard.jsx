'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Dashboard = ({ translations, locale }) => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedImage, setSelectedImage] = useState(null);

  const games = [
    'all',
    'Game #1: Space Invaders',
    'Game #2: Hatchet Hero',
    'Game #3: Mario & Sonic Olympic Games',
    'Game #4: Rampage',
    'Game #5: UFC',
    'Game #6: Super Shot (Basketball)',
    'Game #7: Super Bikes 3',
    'Game #8: No Cross',
    'Game #9: Elevator Action Invasion',
    'Game #10: Fourth Place',
    'Game #11: Top Gun Maverick',
    'Game #12: Pac Man Battle Royal',
    'Game #13: Mario Kart',
    'Game #14: Guitar Hero',
    'Game #15: Cyberpunk Turf Wars',
    'Game #16: Big Buck Wild',
    'Game #17: Darts',
    'Game #18: Galaga Assault',
    'Game #19: Godzilla Kaiju Wars VR'
  ];

  useEffect(() => {
    fetchScores();
  }, []);

  useEffect(() => {
    filterAndSortScores();
  }, [scores, selectedGame, sortField, sortOrder]);

  const fetchScores = async () => {
    try {
      const scoresRef = collection(db, 'scores');
      const q = query(scoresRef, orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const scoresData = [];
      snapshot.forEach((doc) => {
        scoresData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setScores(scoresData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setLoading(false);
    }
  };

  const filterAndSortScores = () => {
    let filtered = [...scores];
    
    // Filter by game
    if (selectedGame !== 'all') {
      filtered = filtered.filter(score => score.game === selectedGame);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle score as number
      if (sortField === 'score') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }
      
      // Handle name and game as strings
      if (sortField === 'employeeName' || sortField === 'game') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredScores(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">{translations.loading || 'Loading scores...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {translations.title || 'Competition Dashboard'}
        </h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <label htmlFor="game-filter" className="block text-sm font-medium text-gray-700 mb-2">
                {translations.filterByGame || 'Filter by Game:'}
              </label>
              <select
                id="game-filter"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                {games.map(game => (
                  <option key={game} value={game}>
                    {game === 'all' ? translations.allGames || 'All Games' : game}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {translations.totalScores || 'Total Scores'}: {filteredScores.length}
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('employeeName')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      {translations.name || 'Name'}
                      <span className="text-gray-400">{getSortIcon('employeeName')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('game')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      {translations.game || 'Game'}
                      <span className="text-gray-400">{getSortIcon('game')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('score')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      {translations.score || 'Score'}
                      <span className="text-gray-400">{getSortIcon('score')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.image || 'Image'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredScores.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {translations.noScores || 'No scores found'}
                    </td>
                  </tr>
                ) : (
                  filteredScores.map((score) => (
                    <tr key={score.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {score.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score.game}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {score.score.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {score.photoURL && score.photoURL !== 'no-image' && score.photoURL !== 'upload-error' ? (
                          <button
                            onClick={() => openImage(score.photoURL)}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                          >
                            {translations.viewImage || 'View'}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            {translations.noImage || 'No image'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImage}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Score proof" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;