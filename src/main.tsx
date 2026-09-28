import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

if (window.location.hostname === 'wakfujobcalculator.bolt.host') {
  window.location.href = 'https://wakfujobcalculator.com' + window.location.pathname + window.location.search + window.location.hash;
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Offline support + installable app (production only: the dev server must stay uncached).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const root = document.getElementById('root')!;
// Pages are prerendered at build time: hydrate the existing HTML when present.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
