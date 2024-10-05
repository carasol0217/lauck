import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const AudioRecorder = () => (
  <div className="recorder-container">
    <h1>Record Your Audio</h1>
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>Status: {status}</p>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
          <audio src={mediaBlobUrl} controls />
        </div>
      )}
    />
  </div>
);

export default AudioRecorder;
