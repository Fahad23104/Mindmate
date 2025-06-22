// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ use this for React 18+
import WrappedApp from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // optional, for font or custom styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>
);
