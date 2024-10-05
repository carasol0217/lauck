import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AudioRecorder from './components/BlockchainVerification';
import BlockchainVerification from './components/BlockchainVerification';

// import logo from './logo.svg';
// import './App.css';

function App() {
    return (
      <Router>
        <div className="app">
          <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/record">Record Audio</Link>
            <Link to="/verify">Verify on Blockchain</Link>
            <Link to="/settings">Settings</Link>
          </nav>
          <div className="content">
            <Routes>
              <Route path="/" element={<h1>Welcome to Blockchain Audio Encoder</h1>} />
              <Route path="/record" element={<AudioRecorder />} />
              <Route path="/verify" element={<BlockchainVerification />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
  
  export default App;
