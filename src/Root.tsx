import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import type { Language } from './constants/translations';
import { LanguageContext, localePrefix, localizedPath, splitLocale } from './lib/locale';

const LANG_STORAGE_KEY = 'wakfu-lang';

// The language lives in the URL (/fr/…), and the app runs under that prefix.
// Switching language moves to the same page in the other language; the router
// is remounted for the new prefix.
export function Root() {
  const [language, setLanguage] = useState<Language>(() => splitLocale(window.location.pathname).language);

  // back/forward across a language switch
  useEffect(() => {
    const onPop = () => setLanguage(splitLocale(window.location.pathname).language);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const changeLanguage = (next: Language) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // storage unavailable: the choice just isn't remembered
    }
    if (next === language) return;
    const { path } = splitLocale(window.location.pathname);
    window.history.pushState(null, '', localizedPath(next, path) + window.location.search + window.location.hash);
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={language}>
      <BrowserRouter key={language} basename={localePrefix(language) || '/'}>
        <App language={language} onLanguageChange={changeLanguage} />
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}
