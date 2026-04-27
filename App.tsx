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
import { CombatCalcPage } from './pages/CombatCalcPage';
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
      if (hasTracked) return;
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
    <div
      className="relative min-h-screen flex flex-col items-center p-6 overflow-hidden font-sans"
      style={{ color: 'var(--text-primary)' }}
    >
      {/* ── CREAM BACKGROUND ── */}
      <div className="absolute inset-0 -z-10" style={{ background: 'var(--cream-bg)' }}>
        {/* Game background image — desaturated & lightened for cream palette */}
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${BG_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px) saturate(0.4) brightness(1.8) sepia(0.3)',
          }}
        />
        {/* Warm cream overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 120% 80% at 20% -10%, oklch(90% 0.04 80 / 0.5) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 80% 60% at 85% 110%, oklch(88% 0.05 150 / 0.2) 0%, transparent 55%), ' +
              'oklch(94% 0.028 78 / 0.55)',
          }}
        />
      </div>

      {/* Soft vignette */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 180px oklch(55% 0.04 72 / 0.12)' }}
      />

      {/* ── TOP BAR ── */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
        <Navbar
          currentPath={location.pathname}
          navCalcLabel={t.navCalc}
          navSubliLabel={t.navSubli}
          navItemsCraftLabel={t.navItemsCraft}
          navTreasuresLabel={t.navTreasures}
          navCombatCalcLabel={t.navCombatCalc}
        />
        <LanguageSelector
          language={lang}
          onLanguageChange={handleLanguageChange}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen(v => !v)}
          label={t.langLabel}
        />
      </div>

      {/* ── PAGES ── */}
      <div className="w-full flex flex-col items-center z-10 pt-20">
        <Routes>
          <Route path="/"                                        element={<CalculatorPage language={lang} />} />
          <Route path="/sublimations"                            element={<SublimationsPage language={lang} />} />
          <Route path="/items-craft-guide"                       element={<ItemsCraftGuidePage language={lang} />} />
          <Route path="/treasures"                               element={<TreasuresPage language={lang} />} />
          <Route path="/combat-calc"                             element={<CombatCalcPage language={lang} />} />
          <Route path="/guides"                                  element={<GuidesPage language={lang} />} />
          <Route path="/guides/beginners-guide-professions"      element={<BeginnersGuideProfessions language={lang} />} />
          <Route path="/guides/complete-sublimations-guide"      element={<CompleteSublimationsGuide language={lang} />} />
          <Route path="/about"                                   element={<AboutPage language={lang} />} />
          <Route path="/changelog"                               element={<ChangelogPage language={lang} />} />
          <Route path="/privacy"                                 element={<PrivacyPolicyPage language={lang} />} />
          <Route path="/terms"                                   element={<TermsOfServicePage language={lang} />} />
          <Route path="/cookies"                                 element={<CookiePolicyPage language={lang} />} />
          <Route path="/disclaimer"                              element={<DisclaimerPage language={lang} />} />
          <Route path="/contact"                                 element={<ContactPage language={lang} />} />
        </Routes>

        {/* ── FOOTER ── */}
        <footer
          className="mt-16 text-xs text-center pb-8 font-medium space-y-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="glass rounded-xl p-4 max-w-2xl mx-auto mb-6">
            <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
              WAKFU is an MMORPG published by Ankama.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Wakfu Job Calculator is an unofficial website with no connection to Ankama.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { to: '/guides',    label: 'Guides'         },
              { to: '/about',     label: t.about          },
              { to: '/changelog', label: t.changelog      },
              { to: '/contact',   label: 'Contact'        },
            ].map(({ to, label }, i, arr) => (
              <span key={to} style={{ display: 'contents' }}>
                <Link
                  to={to}
                  className="transition-colors duration-200 underline"
                  style={{ color: 'oklch(50% 0.10 78 / 0.8)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'oklch(45% 0.12 78)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'oklch(50% 0.10 78 / 0.8)')}
                >
                  {label}
                </Link>
                {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>•</span>}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { to: '/privacy',    label: 'Privacy Policy'  },
              { to: '/terms',      label: 'Terms of Service' },
              { to: '/cookies',    label: 'Cookie Policy'   },
              { to: '/disclaimer', label: 'Disclaimer'      },
            ].map(({ to, label }, i, arr) => (
              <span key={to} style={{ display: 'contents' }}>
                <Link
                  to={to}
                  className="transition-colors duration-200 underline"
                  style={{ color: 'oklch(50% 0.10 78 / 0.8)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'oklch(45% 0.12 78)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'oklch(50% 0.10 78 / 0.8)')}
                >
                  {label}
                </Link>
                {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>•</span>}
              </span>
            ))}
          </div>

          <p style={{ opacity: 0.6 }}>
            {new Date().getFullYear()} {t.createdBy} KreedAc and LadyKreedAc
          </p>
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
