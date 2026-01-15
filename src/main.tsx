import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (window.location.hostname === 'wakfujobcalculator.bolt.host') {
  window.location.href = 'https://wakfujobcalculator.com' + window.location.pathname + window.location.search + window.location.hash;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
