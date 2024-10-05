import React, { useState } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [stream, setStream] = useState(null);

  const startRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(newStream);  // Save the stream to stop it later
      const recorder = new MediaRecorder(newStream);
      setMediaRecorder(recorder);
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      recorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required to record audio.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setIsRecording(false);
      setAudioChunks([]);
      setMediaRecorder(null);
      setIsUploading(true);
      
      const hash = await uploadAudioToPinata(audioBlob);
      setIpfsHash(hash);
      setIsUploading(false);

      // Stop the media stream to turn off the microphone
      stream.getTracks().forEach(track => track.stop());
    };
  };

  const uploadAudioToPinata = async (audioBlob) => {
    try {
      console.log('Uploading to Pinata...', audioBlob);
      const formData = new FormData();
      formData.append('file', audioBlob, `audio-${new Date().toISOString()}.wav`);
  
      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
  
      const result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });
      
      const ipfsHash = result.data.IpfsHash;
      console.log('IPFS Hash:', ipfsHash);
      return ipfsHash;
    } catch (error) {
      console.error('Pinata upload error:', error.response || error.message || error);
      return null;
    }
  };

  return (
    <div className="audio-recorder-container">
      <h2>Audio Recorder</h2>
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'stop-recording' : 'start-recording'}
        disabled={isUploading}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {isUploading && <p>Uploading audio to Pinata...</p>}
      
      {audioUrl && (
        <div className="audio-preview">
          <h3>Recorded Audio</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {ipfsHash && (
        <div className="ipfs-hash">
          <h3>IPFS Hash</h3>
          <p>{ipfsHash}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
