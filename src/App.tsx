import { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES, NotFoundPage } from './routes';
import type { Language } from './constants/translations';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { ALL_NAV, isActive } from './lib/navigation';
import { recordVisit } from './lib/recent';

interface AppProps {
  /** page language, from the URL prefix (see lib/locale) */
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function App({ language: lang, onLanguageChange }: AppProps) {
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

  const shell = { path: pathname, language: lang, onLanguageChange };

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
