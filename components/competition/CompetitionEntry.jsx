'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/competition/QRScanner';
import GameSelection from '@/components/competition/GameSelection';
import ScoreSubmission from '@/components/competition/ScoreSubmission';
import SuccessScreen from '@/components/competition/SuccessScreen';
import { db, storage } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import bgImg from "./assets/bg.png"

const CompetitionEntry = ({ translations, locale }) => {
  const router = useRouter();
  const [step, setStep] = useState('scan'); // scan, welcome, game, score, success
  const [employeeData, setEmployeeData] = useState(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const games = [
    'Pac-Man',
    'Donkey Kong',
    'Street Fighter',
    'Mortal Kombat',
    'Space Invaders',
    'Galaga',
    'Mario Bros',
    'Sonic',
    'Tetris',
    'Other'
  ];

  // Handle QR code scan
  const handleQRScan = async (scannedData) => {
    try {
      setLoading(true);
      setError('');
      
      // Parse QR data
      const qrData = JSON.parse(scannedData);
      
      // Verify employee exists in Firebase
      const employeeRef = doc(db, 'employees', qrData.uuid);
      const employeeSnap = await getDoc(employeeRef);
      
      if (employeeSnap.exists()) {
        const employee = {
          ...employeeSnap.data(),
          uuid: qrData.uuid
        };
        setEmployeeData(employee);
        setStep('welcome');
      } else {
        setError(translations.employeeNotFound || 'Employee not found in system');
      }
    } catch (err) {
      console.error('QR scan error:', err);
      setError(translations.invalidQR || 'Invalid QR code');
    } finally {
      setLoading(false);
    }
  };

  // Handle score submission
  const handleScoreSubmit = async (score, imageFile) => {
    try {
      setLoading(true);
      setError('');
      
      // Upload image to Firebase Storage
      const fileName = `scores/${employeeData.uuid}/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const photoURL = await getDownloadURL(snapshot.ref);
      
      // Save score to Firestore
      const scoreData = {
        employeeId: employeeData.uuid,
        employeeName: employeeData.name,
        game: selectedGame,
        score: parseInt(score),
        photoURL,
        submittedAt: serverTimestamp(),
        eventDate: new Date().toISOString().split('T')[0]
      };
      
      await addDoc(collection(db, 'scores'), scoreData);
      
      setStep('success');
      
      // Reset after 5 seconds
      setTimeout(() => {
        resetFlow();
      }, 5000);
      
    } catch (err) {
      console.error('Score submission error:', err);
      setError(translations.submitError || 'Error submitting score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('scan');
    setEmployeeData(null);
    setSelectedGame('');
    setError('');
  };

  const handleBack = () => {
    if (step === 'welcome') {
      resetFlow();
    } else if (step === 'game') {
      setStep('welcome');
    } else if (step === 'score') {
      setStep('game');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-400 flex items-center justify-center relative">
      {/* Background image/pattern */}
      <div className="absolute inset-0 mix-blend-multiply ">
          <Image
            src={bgImg}
            alt="Background"
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
          />

      </div>
      
      
      {/* Back button */}
      {step !== 'scan' && step !== 'success' && (
        <button
          onClick={handleBack}
          className="absolute top-20 sm:top-24 left-4 sm:left-8 text-white border border-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-white hover:text-purple-900 transition-colors text-sm sm:text-base"
        >
          ← {translations.back || 'BACK'}
        </button>
      )}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        {step === 'scan' && (
          <QRScanner 
            onScan={handleQRScan}
            translations={translations}
            error={error}
            loading={loading}
          />
        )}
        
        {step === 'welcome' && employeeData && (
          <div className="bg-purple-800/50 backdrop-blur-md rounded-3xl p-10 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              {translations.hello || 'Hello'} {employeeData.name}
            </h1>
            <p className="text-xl mb-8">
              {translations.readyToUpload || 'Are you ready to upload your amazing scores?'}
            </p>
            <button
              onClick={() => setStep('game')}
              className="bg-white text-purple-900 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {translations.letsGo || "LET'S GO"} →
            </button>
            <p className="text-green-400 mt-6 text-sm italic">
              *{translations.checkName || 'Please make sure that the correct name is shown above'}
            </p>
          </div>
        )}
        
        {step === 'game' && (
          <GameSelection
            games={games}
            onSelect={(game) => {
              setSelectedGame(game);
              setStep('score');
            }}
            translations={translations}
            employeeName={employeeData?.name}
          />
        )}
        
        {step === 'score' && (
          <ScoreSubmission
            onSubmit={handleScoreSubmit}
            translations={translations}
            employeeName={employeeData?.name}
            gameName={selectedGame}
            loading={loading}
            error={error}
          />
        )}
        
        {step === 'success' && (
          <SuccessScreen translations={translations} />
        )}
      </div>
    </div>
  );
};

export default CompetitionEntry;