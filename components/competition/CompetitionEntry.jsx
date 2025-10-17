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
import bgImg from "./assets/bg.webp"

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
      
      console.log('Raw scanned data:', scannedData);
      
      // Parse QR data
      let qrData;
      try {
        qrData = JSON.parse(scannedData);
        console.log('Parsed QR data:', qrData);
      } catch (parseError) {
        console.error('QR parse error:', parseError);
        setError('Invalid QR code format. Please use a valid employee QR code.');
        setLoading(false);
        return;
      }
      
      // Check if Firebase is initialized
      if (!db) {
        console.error('Firebase not initialized');
        setError('Database connection error. Please refresh the page.');
        setLoading(false);
        return;
      }
      
      // Verify the QR data has required fields
      if (!qrData.uuid || !qrData.name) {
        console.error('Missing required fields in QR data');
        setError('Invalid QR code data. Please use a valid employee QR code.');
        setLoading(false);
        return;
      }
      
      // Verify employee exists in Firebase
      try {
        console.log('Looking for employee with UUID:', qrData.uuid);
        const employeeRef = doc(db, 'employees', qrData.uuid);
        const employeeSnap = await getDoc(employeeRef);
        
        if (employeeSnap.exists()) {
          console.log('Employee found:', employeeSnap.data());
          const employee = {
            ...employeeSnap.data(),
            uuid: qrData.uuid
          };
          setEmployeeData(employee);
          setStep('welcome');
        } else {
          console.error('Employee not found in database');
          setError(translations.employeeNotFound || 'Employee not found in system. Please contact an administrator.');
        }
      } catch (dbError) {
        console.error('Database query error:', dbError);
        setError('Database error: ' + dbError.message);
      }
    } catch (err) {
      console.error('Unexpected QR scan error:', err);
      setError('An unexpected error occurred. Please try again.');
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