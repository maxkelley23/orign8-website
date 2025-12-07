import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initGlobalErrorHandlers } from './services/monitoring';
import { initAnalytics } from './services/analytics';

// Initialize global error handlers for monitoring
initGlobalErrorHandlers();

// Initialize analytics tracking
initAnalytics();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);