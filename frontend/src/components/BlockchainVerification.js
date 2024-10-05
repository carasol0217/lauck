import React, { useState, useEffect } from 'react';

const BlockchainVerification = () => {
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Verified');
    }, 3000);

    // Cleanup timeout if component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="verification-container">
      <h1>Blockchain Verification Status</h1>
      <p>Status: {status}</p>
      {status === 'Pending' && (
        <div className="loading-spinner">
          <p>Verifying...</p>
          {/* You can replace this with an actual spinner */}
        </div>
      )}
    </div>
  );
};

export default BlockchainVerification;
