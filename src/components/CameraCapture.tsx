import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, Check, ArrowLeft, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onBack: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onBack }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setStream(null);
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setCameraReady(false);
      
      // Stop any existing stream first
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      });
      
      mediaStreamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
        
        // Ensure video plays
        videoRef.current.play().catch(console.error);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please ensure your device has a camera.');
        } else {
          setError('Unable to access camera. Please check your permissions and try again.');
        }
      } else {
        setError('Unable to access camera. Please try again.');
      }
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip the image horizontally to match what user sees
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
    }
    
    setTimeout(() => setIsCapturing(false), 300);
  }, [stopCamera, cameraReady]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleSubmit = useCallback(async () => {
    if (!capturedImage || !canvasRef.current) return;

    setIsSubmitting(true);
    
    // Convert canvas to blob
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        setTimeout(() => {
          onCapture(blob);
        }, 1000);
      }
    }, 'image/jpeg', 0.8);
  }, [capturedImage, onCapture]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Take Your Photo</h2>
                <p className="text-green-100 mt-1">Position your face in the center</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Camera/Photo Display */}
              <div className="relative">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      {!cameraReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-white text-sm">Starting camera...</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Face Guide Overlay */}
                {!capturedImage && cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-64 border-2 border-white border-dashed rounded-full opacity-70">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                          Position your face here
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Photo Guidelines:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Look directly at the camera</li>
                  <li>• Ensure good lighting on your face</li>
                  <li>• Remove glasses if possible</li>
                  <li>• Keep a neutral expression</li>
                  <li>• Make sure your entire face is visible</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {!capturedImage ? (
                  <button
                    onClick={capturePhoto}
                    disabled={!stream || isCapturing || !cameraReady}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isCapturing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Capturing...</span>
                      </div>
                    ) : !cameraReady ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Camera className="w-5 h-5" />
                        <span>Take Photo</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={retakePhoto}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <RotateCcw className="w-5 h-5" />
                        <span>Retake</span>
                      </div>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Check className="w-5 h-5" />
                          <span>Continue</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;