import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// Find the root element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root using React 18's API

// Render the app
root.render(<App />);
