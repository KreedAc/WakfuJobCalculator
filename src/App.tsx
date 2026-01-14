import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';
import { SublimationsPage } from './pages/SublimationsPage';
import { ItemsCraftGuidePage } from './pages/ItemsCraftGuidePage';
import { Navbar } from './components/Navbar';
import { LanguageSelector } from './components/LanguageSelector';
import { useClickOutside } from './hooks/useClickOutside';
import { TRANSLATIONS, type Language } from './constants/translations';

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
      try {
        console.log('Page visit tracked');
      } catch (error) {
        console.log('Tracking skipped');
      }
    };
    trackVisit();
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center p-6 overflow-hidden font-sans">
   <div className="absolute inset-0 -z-10 bg-slate-900">
  <div
    className="absolute inset-0 opacity-65 transition-opacity duration-700"
    style={{
      backgroundImage: `url(${BG_URL})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(1.5px) saturate(1.1) brightness(1.25)",
    }}
  />
  {/* overlay più chiaro */}
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/35 via-slate-900/25 to-slate-950/35" />
  {/* "veil" chiaro per aumentare contrasto testo */}
  <div className="absolute inset-0 bg-white/[0.08]" />
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
          <Route path="/sublimations" element={<SublimationsPage />} />
          <Route path="/items-craft-guide" element={<ItemsCraftGuidePage />} />
        </Routes>

        <footer className="mt-16 text-emerald-200/40 text-xs text-center pb-8 font-medium">
          <p>WAKFU is an MMORPG published by Ankama.</p>
          <p className="mt-1">"wakfujobcalculator" is an unofficial website with no connection to Ankama.</p>
          <p className="mt-4 opacity-75">{new Date().getFullYear()} {t.createdBy} KreedAc and LadyKreedAc</p>
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