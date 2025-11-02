'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, translations, error, loading }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMounted = useRef(true);

  // Detect iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);
  }, []);

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      // Try to get camera access with back camera preference
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: 'environment' } // Force back camera
        } 
      }).catch(async () => {
        // If exact constraint fails, try with ideal
        return await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'environment' }
          } 
        });
      });
      
      // If successful, stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setPermissionError(false);
      return true;
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      setPermissionError(true);
      return false;
    }
  };

  const startScanner = async () => {
    try {
      // Prevent double initialization
      if (isScanning) return;
      
      // Check permissions first
      const hasAccess = await checkCameraPermission();
      if (!hasAccess) {
        return;
      }

      setIsScanning(true);
      setPermissionError(false);
      
      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      
      if (!devices || devices.length === 0) {
        throw new Error("No cameras found");
      }

      // Clear any existing scanner instance
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.log("Scanner cleanup");
        }
        scannerRef.current = null;
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const html5QrCode = new Html5Qrcode("qr-reader");
      
      // Find back camera
      let backCameraId = null;
      
      // Try to find back camera by label
      const backCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        backCameraId = backCamera.id;
      } else if (devices.length > 1) {
        // On most phones, back camera is the second one
        backCameraId = devices[1].id;
      } else {
        // Only one camera available, use it
        backCameraId = devices[0].id;
      }
      
      // Mobile-optimized config
      const config = {
        fps: isIOS ? 5 : 10,
        qrbox: { 
          width: 250, 
          height: 250 
        },
        aspectRatio: 1.0,
        // Force environment facing mode
        videoConstraints: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      let scanProcessing = false;
      
      await html5QrCode.start(
        backCameraId,
        config,
        (decodedText, decodedResult) => {
          // Prevent multiple scans
          if (scanProcessing) return;
          scanProcessing = true;
          
          // Stop scanning immediately
          html5QrCode.stop().then(() => {
            setIsScanning(false);
            if (isMounted.current) {
              onScan(decodedText);
            }
          }).catch(() => {
            setIsScanning(false);
            if (isMounted.current) {
              onScan(decodedText);
            }
          });
        },
        (errorMessage) => {
          // Silently ignore scan errors
        }
      );
      
      scannerRef.current = html5QrCode;
    } catch (err) {
      console.error("Error starting scanner:", err);
      setIsScanning(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(true);
        setHasPermission(false);
      } else {
        alert(translations.cameraError || "Unable to access camera. Please check permissions and try again.");
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.log('Scanner cleanup on stop');
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create a temporary div for the file scanner
        const tempDiv = document.createElement('div');
        tempDiv.id = 'qr-reader-file-temp';
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        const html5QrCode = new Html5Qrcode('qr-reader-file-temp');
        const decodedText = await html5QrCode.scanFile(file, true);
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        onScan(decodedText);
      } catch (err) {
        console.error("Failed to scan file", err);
        alert(translations.scanError || "Could not read QR code from image");
      }
    }
    
    // Reset file input
    e.target.value = '';
  };

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      stopScanner();
    };
  }, []);

  // iOS permission instructions
  const getIOSInstructions = () => {
    if (isIOS) {
      return (
        <div className="text-sm opacity-90 mt-2">
          <p>On iOS: Settings → Safari → Camera → Allow</p>
          <p>Then reload this page</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-400/20 backdrop-blur-sm rounded-3xl p-6 sm:p-10 text-center text-white">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">
        {translations.welcomeTitle || 'Welcome to the TSSC Annual Dinner Party'}
      </h1>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8 px-4">
        {translations.scanInstructions || 'To begin participating in the prize competition of the night, scan your QR code and follow the steps!'}
      </p>
      
      {/* Permission error message */}
      {permissionError && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-red-400">
          <p className="text-white font-medium mb-2">
            {translations.cameraPermissionDenied || 'Camera permission required'}
          </p>
          <p className="text-sm opacity-90">
            {translations.enableCameraInstructions || 'Please enable camera access to scan QR codes.'}
          </p>
          {getIOSInstructions()}
          <button
            onClick={() => {
              setPermissionError(false);
              startScanner();
            }}
            className="mt-3 px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
          >
            {translations.tryAgain || 'Try Again'}
          </button>
        </div>
      )}
      
      {!isScanning && (
        <div className="space-y-4">
          <button
            onClick={startScanner}
            disabled={loading}
            className="w-full bg-white text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations.scanWithCamera || 'SCAN QR CODE WITH CAMERA'}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations.uploadImage || 'UPLOAD IMAGE OF QR CODE'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {isScanning && (
        <div className="mt-8">
          <div id="qr-reader" className="mx-auto max-w-sm rounded-lg overflow-hidden"></div>
          
          <button
            onClick={stopScanner}
            className="mt-4 text-white underline"
          >
            {translations.cancel || 'Cancel'}
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-red-400 mt-4 px-4">{error}</p>
      )}
      
      {loading && (
        <p className="text-white mt-4">{translations.verifying || 'Verifying...'}</p>
      )}
    </div>
  );
};

export default QRScanner;