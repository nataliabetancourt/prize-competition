'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, translations, error, loading }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
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
      // iOS Safari specific handling
      if (isIOS) {
        // On iOS, we need to handle permissions differently
        const result = await navigator.permissions.query({ name: 'camera' }).catch(() => null);
        if (result?.state === 'denied') {
          setPermissionError(true);
          setHasPermission(false);
          return false;
        }
      }

      // Try to get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
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

  // Load available cameras
  const loadCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setAvailableCameras(devices);
        
        // iOS camera selection
        if (isIOS && devices.length > 1) {
          // On iOS, usually index 0 is front, index 1 is back
          setCurrentCameraIndex(1);
          setSelectedCamera(devices[1].id);
        } else {
          // For other devices, try to find back camera
          let backCameraIndex = devices.findIndex(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          
          if (backCameraIndex === -1 && devices.length > 1) {
            backCameraIndex = 1;
          }
          
          if (backCameraIndex === -1) {
            backCameraIndex = 0;
          }
          
          setCurrentCameraIndex(backCameraIndex);
          setSelectedCamera(devices[backCameraIndex].id);
        }
      }
    } catch (err) {
      console.error("Error loading cameras:", err);
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
      
      // Load cameras if not already loaded
      if (availableCameras.length === 0) {
        await loadCameras();
      }
      
      const devices = availableCameras.length > 0 ? availableCameras : await Html5Qrcode.getCameras();
      
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
      
      // iOS-optimized config
      const config = {
        fps: isIOS ? 5 : 10, // Lower FPS on iOS for better performance
        qrbox: { 
          width: isIOS ? 250 : 280, 
          height: isIOS ? 250 : 280 
        },
        aspectRatio: 1.0,
        // iOS specific settings
        videoConstraints: {
          facingMode: 'environment',
          width: { ideal: isIOS ? 1280 : 1920 },
          height: { ideal: isIOS ? 720 : 1080 }
        }
      };
      
      // Use selected camera
      const cameraId = selectedCamera || (devices[currentCameraIndex] ? devices[currentCameraIndex].id : devices[0].id);
      
      let scanProcessing = false;
      
      await html5QrCode.start(
        cameraId,
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
      setAvailableCameras(devices);
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

  const switchCamera = async () => {
    if (availableCameras.length <= 1) return;
    
    // Stop current scanner
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.log('Error stopping scanner for camera switch');
      }
    }
    
    // Switch to next camera
    const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    setCurrentCameraIndex(nextIndex);
    setSelectedCamera(availableCameras[nextIndex].id);
    
    // Restart scanner with new camera
    setTimeout(() => {
      startScanner();
    }, 200);
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
            capture={isIOS ? "environment" : undefined}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {isScanning && (
        <div className="mt-8">
          <div id="qr-reader" className="mx-auto max-w-sm rounded-lg overflow-hidden"></div>
          
          {/* Camera switch button - only show if multiple cameras available */}
          {availableCameras.length > 1 && (
            <div className="mt-4 space-y-2">
              <button
                onClick={switchCamera}
                className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              >
                {translations.switchCamera || 'Switch Camera'} ({currentCameraIndex + 1}/{availableCameras.length})
              </button>
              <p className="text-xs opacity-80">
                {availableCameras[currentCameraIndex]?.label || `Camera ${currentCameraIndex + 1}`}
              </p>
            </div>
          )}
          
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