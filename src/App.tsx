import React, { useState } from 'react';
import PassportUpload from './components/PassportUpload';
import CameraCapture from './components/CameraCapture';
import CompletionScreen from './components/CompletionScreen';
import axios from 'axios'
export type KYCStep = 'passport' | 'photo' | 'complete';

function App() {
  const [currentStep, setCurrentStep] = useState<KYCStep>('passport');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePassportUpload = (file: File) => {
    setPassportFile(file);
    setCurrentStep('photo');
  };

  const handlePhotoCapture = async (blob: Blob) => {
    setPhotoBlob(blob);
    
    if (passportFile) {
      await submitKYCDocuments(passportFile, blob);
    }
  };

  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  const submitKYCDocuments = async (passport: File, photo: Blob) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convert photo Blob to File
      const photoFile = blobToFile(photo, 'selfie.jpg');



   const formData = new FormData();
      formData.append('passport', passport);
      formData.append('selfie', photoFile);

      // Send to backend
      const response = await axios.post('https://kyc-urrb.onrender.com/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // alert('KYC submitted successfully!');
      console.log(response.data);
      // setIsLoading(false)
      if(response.data.verified) {
        alert('KYC verified successfully')
        setCurrentStep('complete');
      } else {
        alert('KYC not verified')
      }
  
      // const response = await apiService.submitKYCDocuments(submissionData);
      
      // if (response.success) {
      //   setSubmissionId(response.submissionId);
      //   setCurrentStep('complete');
      // } else {
      //   throw new Error(response.message || 'Submission failed');
      // }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetKYC = () => {
    setCurrentStep('passport');
    setPassportFile(null);
    setPhotoBlob(null);
    setSubmissionId(null);
    setSubmitError(null);
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'passport': return 1;
      case 'photo': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-lg text-gray-600">Complete your KYC verification in just 2 simple steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  getStepNumber() >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'passport' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  Passport Upload
                </span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${((getStepNumber() - 1) / 2) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  getStepNumber() >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'photo' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  Photo Capture
                </span>
              </div>
            </div>
          </div>

          {/* Submission Error */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <p className="text-red-800 font-medium">Submission Failed</p>
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting Documents</h3>
                  <p className="text-gray-600">Please wait while we process your KYC documents...</p>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 'passport' && (
              <PassportUpload onUpload={handlePassportUpload} />
            )}
            {currentStep === 'photo' && (
              <CameraCapture 
                onCapture={handlePhotoCapture} 
                onBack={() => setCurrentStep('passport')}
              />
            )}
            {currentStep === 'complete' && (
              <CompletionScreen 
                onReset={resetKYC} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;