import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = ({ principal }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [stream, setStream] = useState(null); 

  const startRecording = async () => {
    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);  

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      // create a Blob from the recorded audio
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);  
        audioChunks.current = []; // reset chunks for the next recording
        stopMicrophone();  // stop the microphone when recording ends
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    stopMicrophone();
  };
  

  const stopMicrophone = () => {
    if (stream) {
      
      stream.getTracks().forEach(track => track.stop());
      setStream(null);  // clear the stream to prevent further use
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const discardRecording = () => {
    // discard the current recording
    setAudioBlob(null);
    setIpfsHash('');  // clear the IPFS hash if any
    stopMicrophone(); 
  };

  const uploadAudioToPinata = async () => {
    try {
      setIsUploading(true);

      // prepare the audio file for upload
      const formData = new FormData();
      formData.append('file', audioBlob, `audio-${new Date().toISOString()}.wav`);

      // pinata API keys from environment variables
      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

      // make the request to Pinata's PinFileToIPFS API
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      // retrieve and display the IPFS hash
      const hash = response.data.IpfsHash;
      setIpfsHash(hash);
      setIsUploading(false);
      console.log('Audio uploaded to Pinata, IPFS Hash:', hash);

      return hash;
    } catch (error) {
      console.error('Pinata upload error:', error.response || error.message || error);
      setIsUploading(false);
      return null;
    }
  };

  const lauckNow = async () => {
    if (!audioBlob) {
      alert('No audio recorded. Please record audio first.');
      return;
    }

    const ipfsHash = await uploadAudioToPinata();
    if (ipfsHash && principal) {
      // placeholder for sending hash to blockchain (Motoko canister)
      console.log(`Sending IPFS hash ${ipfsHash} to blockchain for principal: ${principal}`);

      // Future blockchain integration with Motoko will go here:
      // await audioCanister.storeHash(principal, ipfsHash);
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioBlob && (
        <>
          <button onClick={playAudio}>Play Audio</button>
          <button onClick={lauckNow} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Lauck Now'}
          </button>
          <button onClick={discardRecording} disabled={isUploading}>Discard Recording</button>
        </>
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
