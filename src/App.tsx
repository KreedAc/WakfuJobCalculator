import { useState, useEffect, startTransition, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES, NotFoundPage } from './routes';
import { TRANSLATIONS, type Language } from './constants/translations';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { ALL_NAV, isActive } from './lib/navigation';
import { recordVisit } from './lib/recent';

const LANG_STORAGE_KEY = 'wakfu-lang';

function getSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && saved in TRANSLATIONS) return saved as Language;
  } catch {
    // localStorage unavailable (private mode or server render)
  }
  return null;
}

export default function App() {
  // Pages are prerendered in English; a saved language is applied after
  // hydration so the server HTML and the first client render always match.
  // As a transition, React finishes hydrating lazy routes before re-rendering.
  const [lang, setLang] = useState<Language>('en');
  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved && saved !== 'en') startTransition(() => setLang(saved));
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const { pathname } = useLocation();

  // new page: back to the top, and remember the tool for the Home page
  useEffect(() => {
    window.scrollTo(0, 0);
    const tool = ALL_NAV.find((n) => n.path !== '/' && isActive(n, pathname));
    if (tool) recordVisit(tool.path);
  }, [pathname]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // localStorage unavailable — language just won't persist
    }
  };

  const shell = { path: pathname, language: lang, onLanguageChange: handleLanguageChange };

  return (
    <div className="min-h-screen">
      <Sidebar {...shell} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar {...shell} />
        <main className="flex-1 w-full max-w-[1640px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-28 lg:pb-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }
          >
            <Routes>
              {ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={r.render(lang)} />
              ))}
              <Route path="*" element={<NotFoundPage language={lang} />} />
            </Routes>
          </Suspense>
          <Footer language={lang} />
        </main>
      </div>
      <MobileTabBar {...shell} />
      <CommandPalette language={lang} />
    </div>
  );
}
