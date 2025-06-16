import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const [passportFile, setPassportFile] = useState(null);
  const [selfieDataUrl, setSelfieDataUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [ IsLoading, setIsLoading ] = useState(false)
  // Handle passport photo upload
  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassportFile(file);
    }
  };

  // Capture selfie from webcam
  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelfieDataUrl(imageSrc);
    setIsCapturing(false);
  };

  // Submit form data to backend
  const handleSubmit = async () => {
    if (!passportFile || !selfieDataUrl) {
      alert('Please upload passport and capture a selfie first.');
      return;
    }

    try {
      // Convert selfie data URL to Blob
      const selfieBlob = await (await fetch(selfieDataUrl)).blob();

      // Build FormData
      const formData = new FormData();
      formData.append('passport', passportFile);
      formData.append('selfie', selfieBlob, 'selfie.jpg');

      // Send to backend
      const response = await axios.post('https://kyc-urrb.onrender.com/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // alert('KYC submitted successfully!');
      console.log(response.data);
      if(response.data.verified) {
        alert('KYC verified successfully')
      } else {
        alert('KYC not verified')
      }
    } catch (error) {
      console.log('Submission error:', error);
      alert('Failed to submit KYC data.');
    }
  };

  return (
    <div className="App">
      <h1>KYC Verification</h1>

      <section>
        <h2>1. Upload Passport Photo</h2>
        <input type="file" accept="image/*" onChange={handlePassportUpload} />
        {passportFile && (
          <img
            src={URL.createObjectURL(passportFile)}
            alt="Passport"
            className="preview"
          />
        )}
      </section>

      <section>
        <h2>2. Capture a Selfie</h2>
        {!isCapturing && (
          <button 
          onClick={() => {
            setSelfieDataUrl(null)
            setIsCapturing(true)
          }}
          >
            Open Front Camera
          </button>
        )}

        {isCapturing && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              className="webcam"
            />
            <button onClick={captureSelfie}>Capture Selfie</button>
          </>
        )}

        {selfieDataUrl && (
          <>
            <h4>Selfie Preview</h4>
            <img src={selfieDataUrl} alt="Selfie" className="preview" />
          </>
        )}
      </section>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Submit to Backend
      </button>
    </div>
  );
}

export default App;
