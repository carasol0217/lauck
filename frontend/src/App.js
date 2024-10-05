import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import AudioRecorder from './components/AudioRecorder';
import BlockchainVerification from './components/BlockchainVerification';

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    // Initialize the AuthClient
    async function initAuthClient() {
      const client = await AuthClient.create();
      setAuthClient(client);

      // Check if the user is already authenticated
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      }
    }

    initAuthClient();
  }, []);

  const login = async () => {
    await authClient.login({
      identityProvider: 'https://identity.ic0.app',
      onSuccess: () => {
        setIsAuthenticated(true);
        setPrincipal(authClient.getIdentity().getPrincipal().toText());
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
  };

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
            <Route
              path="/"
              element={
                <>
                  <h1>Internet Identity Authentication</h1>
                  {isAuthenticated ? (
                    <>
                      <p>Logged in as {principal}</p>
                      <button onClick={logout}>Logout</button>
                    </>
                  ) : (
                    <button onClick={login}>Login with Internet Identity</button>
                  )}
                </>
              }
            />
            <Route path="/record" element={<AudioRecorder />} />
            <Route path="/verify" element={<BlockchainVerification />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
