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
  const [isCompetitionClosed, setIsCompetitionClosed] = useState(false);

  // Competition closing time - Tomorrow at 7PM CST
  const CLOSING_TIME = new Date('2025-11-02T19:00:00-06:00'); // November 2, 2025 at 7PM CST
  
  // Alternative: Dynamic closing time (always tomorrow at 7PM CST)
  // const getClosingTime = () => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   tomorrow.setHours(19, 0, 0, 0); // 7PM
  //   // Convert to CST timezone
  //   return new Date(tomorrow.toLocaleString("en-US", {timeZone: "America/Chicago"}));
  // };
  // const CLOSING_TIME = getClosingTime();

  const games = [
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

  // Check if competition is closed
  useEffect(() => {
    const checkIfClosed = () => {
      const now = new Date();
      const nowCST = new Date(now.toLocaleString("en-US", {timeZone: "America/Chicago"}));
      setIsCompetitionClosed(nowCST > CLOSING_TIME);
    };

    checkIfClosed();
    // Check every minute
    const interval = setInterval(checkIfClosed, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle QR code scan
  const handleQRScan = async (scannedData) => {
    // Check if competition is closed
    if (isCompetitionClosed) {
      setError(translations.competitionClosed || 'Sorry, the competition has ended. Entries closed at 7PM CST.');
      return;
    }

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
    // Double-check if competition is closed
    if (isCompetitionClosed) {
      setError(translations.competitionClosed || 'Sorry, the competition has ended. Entries closed at 7PM CST.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Starting submission...', {
        employeeId: employeeData.uuid,
        game: selectedGame,
        score: score,
        fileName: imageFile.name
      });
      
      let photoURL = '';
      
      try {
        // Upload image to Firebase Storage
        const fileName = `scores/${employeeData.uuid}/${Date.now()}_${imageFile.name}`;
        console.log('Uploading to:', fileName);
        
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log('Upload complete:', snapshot);
        
        photoURL = await getDownloadURL(snapshot.ref);
        console.log('Got download URL:', photoURL);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image for now
        photoURL = 'error-no-image';
      }
      
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
      
      console.log('Saving score data:', scoreData);
      
      const docRef = await addDoc(collection(db, 'scores'), scoreData);
      console.log('Score saved with ID:', docRef.id);
      
      setStep('success');
      
      // Reset after 5 seconds
      setTimeout(() => {
        resetFlow();
      }, 5000);
      
    } catch (err) {
      console.error('Score submission error:', err);
      setError(`Error: ${err.message}`);
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

  // Show closed message if competition has ended
  if (isCompetitionClosed && step === 'scan') {
    return (
      <div className="min-h-screen bg-zinc-400 flex items-center justify-center relative">
        <div className="absolute inset-0 mix-blend-multiply">
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
        
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
          <div className="bg-slate-400/20 backdrop-blur-sm rounded-3xl p-10 text-center text-white">
            <h1 className="text-3xl font-bold mb-4">
              {translations.competitionEndedTitle || 'Competition Has Ended'}
            </h1>
            <p className="text-xl mb-4">
              {translations.competitionEndedMessage || 'Thank you for your entries! The score submission period ended at 7:00 PM CST.'}
            </p>
            <p className="text-lg">
              {translations.winnersAnnounced || 'Winners will be announced shortly!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          className="absolute top-20 sm:top-24 left-8 sm:left-32 text-white border border-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-white hover:text-purple-900 transition-colors text-sm sm:text-base"
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
          <div className="bg-slate-400/20 backdrop-blur-sm rounded-3xl p-10 text-center text-white">
            <h1 className="text-3xl font-bold mb-4">
              {translations.hello || 'Hello'} {employeeData.name}
            </h1>
            <p className="text-lg mb-8">
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