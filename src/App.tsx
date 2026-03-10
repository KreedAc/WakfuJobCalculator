import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';
import { SublimationsPage } from './pages/SublimationsPage';
import { ItemsCraftGuidePage } from './pages/ItemsCraftGuidePage';
import { AboutPage } from './pages/AboutPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { ContactPage } from './pages/ContactPage';
import { GuidesPage } from './pages/GuidesPage';
import TreasuresPage from './pages/TreasuresPage';
import { BeginnersGuideProfessions } from './pages/guides/BeginnersGuideProfessions';
import { CompleteSublimationsGuide } from './pages/guides/CompleteSublimationsGuide';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { Navbar } from './components/Navbar';
import { LanguageSelector } from './components/LanguageSelector';
import { useClickOutside } from './hooks/useClickOutside';
import { TRANSLATIONS, type Language } from './constants/translations';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let supabase: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch {
  supabase = null;
}

const BG_URL = '424478.jpg';

function AppContent() {
  const [lang, setLang] = useState<Language>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const t = TRANSLATIONS[lang];

  useClickOutside([
    { id: 'lang', onClose: () => setMenuOpen(false) }
  ]);

  useEffect(() => {
    const trackVisit = async () => {
      if (!supabase) return;
      const sessionKey = 'visit_tracked';
      const hasTracked = sessionStorage.getItem(sessionKey);

      if (hasTracked) {
        return;
      }

      try {
        await supabase.from('visitors').insert({
          user_agent: navigator.userAgent,
          page: location.pathname
        });

        sessionStorage.setItem(sessionKey, 'true');
        console.log('Page visit tracked');
      } catch (error) {
        console.log('Tracking skipped');
      }
    };
    trackVisit();
  }, [location.pathname]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center p-6 overflow-hidden font-sans">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800" />

        {/* Animated liquid blobs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl liquid-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl liquid-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full blur-3xl liquid-blob" style={{ animationDelay: '10s' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-400/30 to-rose-500/30 rounded-full blur-3xl liquid-blob" style={{ animationDelay: '15s' }} />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />
      </div>


      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
        <Navbar
          currentPath={location.pathname}
          navCalcLabel={t.navCalc}
          navSubliLabel={t.navSubli}
          navItemsCraftLabel={t.navItemsCraft}
          navTreasuresLabel={t.navTreasures}
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
        <Routes>
          <Route path="/" element={<CalculatorPage language={lang} />} />
          <Route path="/sublimations" element={<SublimationsPage language={lang} />} />
          <Route path="/items-craft-guide" element={<ItemsCraftGuidePage language={lang} />} />
          <Route path="/treasures" element={<TreasuresPage language={lang} />} />
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

        <footer className="mt-16 text-white/50 text-xs text-center pb-8 font-medium space-y-4">
          <div className="glass-soft rounded-2xl p-6 max-w-2xl mx-auto mb-6">
            <p className="text-white/80 mb-2">WAKFU is an MMORPG published by Ankama.</p>
            <p className="text-white/80">Wakfu Job Calculator is an unofficial website with no connection to Ankama.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/guides" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              Guides
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              {t.about}
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/changelog" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              {t.changelog}
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/contact" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              Contact
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/privacy" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              Privacy Policy
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/terms" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              Terms of Service
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/cookies" className="text-white/70 hover:text-white transition-colors duration-200 underline">
              Cookie Policy
            </Link>
            <span className="opacity-50">•</span>
            <Link to="/disclaimer" className="text-white/70 hover:text-white transition-colors duration-200 underline">
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