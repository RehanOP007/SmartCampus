import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


import React from 'react';
import ReactDOM from 'react-dom/client';
import TestNotifications from './component3/TestNotifications';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestNotifications />
  </React.StrictMode>
);