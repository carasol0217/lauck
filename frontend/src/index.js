import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // If you have custom styles
import App from './App'; // Import the main App component

const root = ReactDOM.createRoot(document.getElementById('root')); // Reference to the root element in index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
