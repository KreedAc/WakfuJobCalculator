import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Root } from './Root';
import { ROUTES } from './routes';
import { splitLocale } from './lib/locale';
import { loadData } from './lib/pageData';
import './index.css';

if (window.location.hostname === 'wakfujobcalculator.bolt.host') {
  window.location.href = 'https://wakfujobcalculator.com' + window.location.pathname + window.location.search + window.location.hash;
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <Root />
    </HelmetProvider>
  </StrictMode>
);

// Offline support + installable app (production only: the dev server must stay uncached).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

async function start() {
  const root = document.getElementById('root')!;
  // Pages are prerendered at build time: hydrate the existing HTML when present,
  // once the data it was rendered with is loaded (see lib/pageData).
  if (root.hasChildNodes()) {
    const { language, path } = splitLocale(window.location.pathname);
    const files = ROUTES.find((r) => r.path === path)?.data?.(language) ?? [];
    await Promise.all(files.map((f) => loadData(f).catch(() => undefined)));
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

start();
