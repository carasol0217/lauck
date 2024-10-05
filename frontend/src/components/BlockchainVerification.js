import React, { useState, useEffect } from 'react';

const BlockchainVerification = () => {
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    setTimeout(() => {
      setStatus('Verified');
    }, 3000);
  }, []);

  return (
    <div className="verification-container">
      <h1>Blockchain Verification Status</h1>
      <p>Status: {status}</p>
    </div>
  );
};

export default BlockchainVerification;
