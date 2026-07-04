import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';
import { Navbar } from './components/Navbar';

// Every page except the landing one is lazy-loaded to keep the initial bundle small.
const SublimationsPage = lazy(() => import('./pages/SublimationsPage').then(m => ({ default: m.SublimationsPage })));
const ItemsCraftGuidePage = lazy(() => import('./pages/ItemsCraftGuidePage').then(m => ({ default: m.ItemsCraftGuidePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage').then(m => ({ default: m.ChangelogPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const TreasuresPage = lazy(() => import('./pages/TreasuresPage'));
const BeginnersGuideProfessions = lazy(() => import('./pages/guides/BeginnersGuideProfessions').then(m => ({ default: m.BeginnersGuideProfessions })));
const CompleteSublimationsGuide = lazy(() => import('./pages/guides/CompleteSublimationsGuide').then(m => ({ default: m.CompleteSublimationsGuide })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const CombatCalcPage = lazy(() => import('./pages/CombatCalcPage').then(m => ({ default: m.CombatCalcPage })));
import { LanguageSelector } from './components/LanguageSelector';
import { useClickOutside } from './hooks/useClickOutside';
import { TRANSLATIONS, type Language } from './constants/translations';

const LANG_STORAGE_KEY = 'wakfu-lang';

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && saved in TRANSLATIONS) return saved as Language;
  } catch {
    // localStorage unavailable (private mode) — fall back to default
  }
  return 'en';
}

function AppContent() {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
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
          navCombatCalcLabel={t.navCombatCalc} // ← NUOVO
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
          <Route path="/" element={<CalculatorPage language={lang} />} />
          <Route path="/sublimations" element={<SublimationsPage language={lang} />} />
          <Route path="/items-craft-guide" element={<ItemsCraftGuidePage language={lang} />} />
          <Route path="/treasures" element={<TreasuresPage language={lang} />} />
          <Route path="/combat-calc" element={<CombatCalcPage language={lang} />} /> {/* ← NUOVO */}
          <Route path="/guides" element={<GuidesPage language={lang} />} />
          <Route path="/guides/beginners-guide-professions" element={<BeginnersGuideProfessions language={lang} />} />
          <Route path="/guides/complete-sublimations-guide" element={<CompleteSublimationsGuide language={lang} />} />
          <Route path="/about" element={<AboutPage language={lang} />} />
          <Route path="/changelog" element={<ChangelogPage language={lang} />} />
          <Route path="/privacy" element={<PrivacyPolicyPage language={lang} />} />
          <Route path="/terms" element={<TermsOfServicePage language={lang} />} />
          <Route path="/cookies" element={<CookiePolicyPage language={lang} />} />
          <Route path="/disclaimer" element={<DisclaimerPage language={lang} />} />
          <Route path="/contact" element={<ContactPage language={lang} />} />
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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
