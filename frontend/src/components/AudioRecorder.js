import React, { useState, useRef } from 'react';

const AudioRecorder = ({ principal }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    // Request permission to access the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new MediaRecorder instance
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    // Collect audio data as it's recorded
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    // When the recording stops, create a Blob from the recorded audio
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);  // Store the Blob for playback and saving
      audioChunks.current = []; // Reset chunks for the next recording
    };

    // Start recording
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = 'recorded_audio.wav';
      downloadLink.click();
    }
  };

  // Example function to send audio to blockchain
  const sendToBlockchain = async () => {
    if (audioBlob && principal) {
      // Convert the Blob to an ArrayBuffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      // Placeholder for sending audio to the blockchain
      console.log("Sending audio to blockchain for principal:", principal);
      // Use the audioCanister.sendAudio(principal, Array.from(byteArray)) method to send the audio
      console.log('Audio data:', byteArray);
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
          <button onClick={saveAudio}>Save Audio</button>
          <button onClick={sendToBlockchain}>Send to Blockchain</button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
