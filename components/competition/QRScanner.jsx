'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, translations, error, loading }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load available cameras
  const loadCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setAvailableCameras(devices);
        
        // Try to select back camera by default
        // Back cameras usually contain "back" or "rear" in their label
        // or are listed as "environment" facing mode
        let backCameraIndex = devices.findIndex(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        
        // If no back camera found by label and there are multiple cameras,
        // typically the back camera is the second one (index 1)
        if (backCameraIndex === -1 && devices.length > 1) {
          backCameraIndex = 1;
        }
        
        // If still no back camera, just use the first available
        if (backCameraIndex === -1) {
          backCameraIndex = 0;
        }
        
        setCurrentCameraIndex(backCameraIndex);
        setSelectedCamera(devices[backCameraIndex].id);
      }
    } catch (err) {
      console.error("Error loading cameras:", err);
    }
  };

  const startScanner = async () => {
    try {
      setIsScanning(true);
      
      // Load cameras if not already loaded
      if (availableCameras.length === 0) {
        await loadCameras();
      }
      
      const devices = availableCameras.length > 0 ? availableCameras : await Html5Qrcode.getCameras();
      
      if (devices && devices.length) {
        const html5QrCode = new Html5Qrcode("qr-reader");
        
        // Configure for mobile with larger scanning area
        const config = {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0,
          // Additional config for better mobile performance
          disableFlip: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        };
        
        // Use selected camera or the pre-selected back camera
        const cameraId = selectedCamera || devices[currentCameraIndex].id;
        
        await html5QrCode.start(
          cameraId,
          config,
          (decodedText, decodedResult) => {
            // Stop scanning immediately after successful read
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              onScan(decodedText);
            }).catch(() => {
              // Scanner might already be stopped
              setIsScanning(false);
              onScan(decodedText);
            });
          },
          (errorMessage) => {
            // Ignore QR code not found errors
            if (!errorMessage.includes("No QR code found") && !errorMessage.includes("NotFoundException")) {
              console.log(errorMessage);
            }
          }
        );
        
        scannerRef.current = html5QrCode;
        setHasPermission(true);
        setAvailableCameras(devices);
      }
    } catch (err) {
      console.error("Error starting scanner:", err);
      setIsScanning(false);
      alert(translations.cameraError || "Unable to access camera. Please check permissions.");
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
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        // Ignore errors when scanner is already stopped
        console.log('Scanner already stopped');
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
  };

  useEffect(() => {
    // Load available cameras on mount
    loadCameras();
    
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="bg-slate-400/20 backdrop-blur-sm rounded-3xl p-6 sm:p-10 text-center text-white">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">
        {translations.welcomeTitle || 'Welcome to the TSSC Annual Dinner Party'}
      </h1>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8 px-4">
        {translations.scanInstructions || 'To begin participating in the prize competition of the night, scan your QR code and follow the steps!'}
      </p>
      
      {!isScanning && (
        <div className="space-y-4">
          <button
            onClick={startScanner}
            disabled={loading}
            className="w-full bg-white text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {translations.scanWithCamera || 'SCAN QR CODE WITH CAMERA'}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors disabled:opacity-50"
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
          <div id="qr-reader" className="mx-auto max-w-sm"></div>
          
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