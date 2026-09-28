import { useState, useEffect, startTransition, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ROUTES, NotFoundPage } from './routes';
import { LanguageSelector } from './components/LanguageSelector';
import { useClickOutside } from './hooks/useClickOutside';
import { TRANSLATIONS, type Language } from './constants/translations';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const t = TRANSLATIONS[lang];

  useClickOutside([
    { id: 'lang', onClose: () => setMenuOpen(false) }
  ]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setMenuOpen(false);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // localStorage unavailable — language just won't persist
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center p-6 overflow-hidden font-sans">
   <div className="absolute inset-0 -z-10 bg-slate-900">
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-slate-900/15 to-slate-950/20" />
  <div className="absolute inset-0 bg-white/[0.12]" />
</div>

{/* vignette meno aggressiva */}
<div
  className="absolute inset-0 -z-10 pointer-events-none"
  style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.25)" }}
/>


      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
        <Navbar
          currentPath={location.pathname}
          navCalcLabel={t.navCalc}
          navSubliLabel={t.navSubli}
          navItemsCraftLabel={t.navItemsCraft}
          navTreasuresLabel={t.navTreasures}
          navCombatCalcLabel={t.navCombatCalc}
          navBuilderLabel={t.navBuilder}
        />

        <LanguageSelector
          language={lang}
          onLanguageChange={handleLanguageChange}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen(v => !v)}
          label={t.langLabel}
        />
      </div>

      <div className="w-full flex flex-col items-center z-10 pt-20">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24 text-emerald-300/70">
              <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
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

        <footer className="mt-16 text-emerald-200/40 text-xs text-center pb-8 font-medium space-y-4">
          <div className="glass rounded-xl p-4 max-w-2xl mx-auto mb-6">
            <p className="text-emerald-200/60 mb-2">WAKFU is an MMORPG published by Ankama.</p>
            <p className="text-emerald-200/60">Wakfu Job Calculator is an unofficial website with no connection to Ankama.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/guides" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Guides
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/about" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              {t.about}
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/changelog" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              {t.changelog}
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/contact" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Contact
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/privacy" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Privacy Policy
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/terms" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Terms of Service
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/cookies" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Cookie Policy
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/disclaimer" className="text-emerald-300/60 hover:text-emerald-300 transition-colors duration-200 underline">
              Disclaimer
            </Link>
          </div>

          <p className="opacity-75">{new Date().getFullYear()} {t.createdBy} KreedAc and LadyKreedAc</p>
        </footer>
      </div>
    </div>
  );
}
