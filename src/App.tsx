import React, { useState, useEffect } from 'react';
import { BookOpen, Hammer, Scroll } from 'lucide-react';
import { SublimationPage } from './pages/Sublimation/SublimationPage';

const supabase = {
  from: (table) => ({
    insert: async (data) => {
      console.log(`[Mock Supabase] Insert into ${table}:`, data);
      return { error: null };
    }
  })
};

export default function App() {
  // 🔥 Soft navigation
  const [activePage, setActivePage] = useState<'calculator' | 'sublimation'>('calculator');

  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const BG_URL = '424478.jpg';

  const flags = { en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸' };

  // ===========================
  // 🔥 Translation system FULL
  // ===========================
  const i18n = {
    en: {
      title: 'Wakfu Crafting XP Calculator',
      subtitle: 'Select your profession, choose a level range, and enter the EXP per crafted item.',
      selectProfession: 'Select Profession',
      selectRange: 'Select Level Range',
      recipe: 'Recipe',
      expPerItem: 'EXP per Crafted Item',
      expPlaceholder: 'e.g. 150',
      calculate: 'Calculate Required Crafts',
      resultsFor: 'Results for',
      firstResource: 'Collect the first resource quantity:',
      secondResource: 'Collect the second resource quantity:',
      craftsNeeded: 'Crafts Needed',
      xpDiff: 'XP Difference',
      alert: 'Please fill all fields and select a profession and level range.',
      recipeName: 'Recipe Name',
      createdBy: 'Created by',
      langLabel: 'Language',
      navCalculator: 'XP Calculator',
      navSublimation: 'Sublimation'
    },
    fr: {
      title: 'Calculateur d\'XP d\'Artisanat Wakfu',
      subtitle: 'Choisissez votre métier, une tranche de niveaux, puis saisissez l\'XP par objet fabriqué.',
      selectProfession: 'Sélectionner un métier',
      selectRange: 'Sélectionner une tranche de niveaux',
      recipe: 'Recette',
      expPerItem: 'XP par objet fabriqué',
      expPlaceholder: 'ex. 150',
      calculate: 'Calculer les fabrications nécessaires',
      resultsFor: 'Résultats pour',
      firstResource: 'Quantité du premier matériau à collecter :',
      secondResource: 'Quantité du deuxième matériau à collecter :',
      craftsNeeded: 'Fabrications nécessaires',
      xpDiff: 'Différence d\'XP',
      alert: 'Veuillez remplir tous les champs.',
      recipeName: 'Nom de la recette',
      createdBy: 'Créé par',
      langLabel: 'Langue',
      navCalculator: 'XP Calculator',
      navSublimation: 'Sublimation'
    },
    es: {
      title: 'Calculadora de XP de Artesanía de Wakfu',
      subtitle: 'Elige tu profesión, un rango de niveles e introduce la XP por objeto creado.',
      selectProfession: 'Seleccionar profesión',
      selectRange: 'Seleccionar rango de niveles',
      recipe: 'Receta',
      expPerItem: 'XP por objeto creado',
      expPlaceholder: 'p. ej., 150',
      calculate: 'Calcular creaciones necesarias',
      resultsFor: 'Resultados para',
      firstResource: 'Cantidad del primer recurso a recolectar:',
      secondResource: 'Cantidad del segundo recurso a recolectar:',
      craftsNeeded: 'Creaciones necesarias',
      xpDiff: 'Diferencia de XP',
      alert: 'Por favor, rellena todos los campos.',
      recipeName: 'Nombre de la receta',
      createdBy: 'Creado por',
      langLabel: 'Idioma',
      navCalculator: 'XP Calculator',
      navSublimation: 'Sublimation'
    }
  };

  const t = i18n[lang];

  // ===========================
  // Professions + ranges
  // ===========================
  const professions = [
    'Armorer','Baker','Chef','Handyman','Jeweler','Leather Dealer','Tailor','Weapons Master'
  ];

  const professionNames = {
    en: {
      'Armorer': 'Armorer',
      'Baker': 'Baker',
      'Chef': 'Chef',
      'Handyman': 'Handyman',
      'Jeweler': 'Jeweler',
      'Leather Dealer': 'Leather Dealer',
      'Tailor': 'Tailor',
      'Weapons Master': 'Weapons Master',
    },
    fr: {
      'Armorer': 'Armurier',
      'Baker': 'Boulanger',
      'Chef': 'Cuisinier',
      'Handyman': 'Bricoleur',
      'Jeweler': 'Bijoutier',
      'Leather Dealer': 'Maroquinier',
      'Tailor': 'Tailleur',
      'Weapons Master': "Maître d'armes",
    },
    es: {
      'Armorer': 'Armero',
      'Baker': 'Panadero',
      'Chef': 'Cocinero',
      'Handyman': 'Ebanista',
      'Jeweler': 'Joyero',
      'Leather Dealer': 'Peletero',
      'Tailor': 'Sastre',
      'Weapons Master': 'Maestro de armas',
    }
  };

  const levelRanges = [
    { range: "2 - 10", expDiff: 7500 },
    { range: "10 - 20", expDiff: 22500 },
    { range: "20 - 30", expDiff: 37500 },
    { range: "30 - 40", expDiff: 52500 },
    { range: "40 - 50", expDiff: 67500 },
    { range: "50 - 60", expDiff: 82500 },
    { range: "60 - 70", expDiff: 97500 },
    { range: "70 - 80", expDiff: 112500 },
    { range: "80 - 90", expDiff: 127500 },
    { range: "90 - 100", expDiff: 142500 },
    { range: "100 - 110", expDiff: 157500 },
    { range: "110 - 120", expDiff: 172500 },
    { range: "120 - 130", expDiff: 187500 },
    { range: "130 - 140", expDiff: 202500 },
    { range: "140 - 150", expDiff: 217500 },
    { range: "150 - 160", expDiff: 232500 }
  ];

  function handleCalculate(e) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);
    if (!expItem || !selectedRange || !selectedProfession) {
      alert(t.alert);
      return;
    }
    const selected = levelRanges.find(r => r.range === selectedRange);
    if (!selected) return;
    const craftCount = Math.ceil(selected.expDiff / expItem);
    const resourceCount = craftCount * 5;
    setResult({ ...selected, selectedProfession, craftCount, resourceCount });
  }

  // ===========================
  // Track visits
  // ===========================
  useEffect(() => {
    supabase.from("visitors").insert({
      page: activePage,
      user_agent: navigator.userAgent,
    });
  }, [activePage]);

  // ===========================
  // CLICK OUTSIDE
  // ===========================
  useEffect(() => {
    function handler(e) {
      const lb = document.getElementById("lang-btn");
      const lm = document.getElementById("lang-menu");
      if (lm && !lm.contains(e.target) && lb && !lb.contains(e.target)) {
        setLangOpen(false);
      }

      const hb = document.getElementById("hamburger-btn");
      const hm = document.getElementById("hamburger-menu");
      if (hm && !hm.contains(e.target) && hb && !hb.contains(e.target)) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ===========================================================
  // 🔥  PAGE: SUBLIMATION
  // ===========================================================
  if (activePage === "sublimation") {
    return (
      <div className="min-h-screen text-white relative">
        <button
          onClick={() => setActivePage("calculator")}
          className="absolute top-4 left-4 bg-black/40 px-4 py-2 rounded-xl border border-white/20"
        >
          ← {t.navCalculator}
        </button>

        <SublimationPage />
      </div>
    );
  }

  // ===========================================================
  // 🔥  PAGE: CALCULATOR (LA TUA UI ORIGINALE COMPLETA)
  // ===========================================================
  return (
    <div className="relative min-h-screen text-white flex flex-col items-center p-6 overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.70)'
        }}
      />

      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">

        {/* Hamburger */}
        <div className="relative">
          <button
            id="hamburger-btn"
            onClick={(e) => {
              e.stopPropagation();
              setHamburgerOpen(!hamburgerOpen);
              setLangOpen(false);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/40 border border-white/20"
          >
            <svg className="w-6 h-6" stroke="currentColor" fill="none">
              <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {hamburgerOpen && (
            <div
              id="hamburger-menu"
              className="absolute left-0 mt-2 w-56 bg-gray-900/95 border border-white/20 rounded-xl shadow-lg"
            >
              <button
                onClick={() => { setActivePage("calculator"); setHamburgerOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10"
              >
                {t.navCalculator}
              </button>

              <button
                onClick={() => { setActivePage("sublimation"); setHamburgerOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                {t.navSublimation}
              </button>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            id="lang-btn"
            onClick={(e) => {
              e.stopPropagation();
              setLangOpen(!langOpen);
              setHamburgerOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/20"
          >
            <span>{flags[lang]}</span>
            <span className="hidden sm:inline">{t.langLabel}</span>
          </button>

          {langOpen && (
            <div
              id="lang-menu"
              className="absolute right-0 mt-2 w-40 rounded-xl bg-gray-900/95 border border-white/20 shadow-lg"
            >
              <button onClick={() => { setLang('fr'); setLangOpen(false); }}
                className="w-full px-4 py-3 hover:bg-white/10 flex items-center gap-2 border-b border-white/10">
                🇫🇷 Français
              </button>

              <button onClick={() => { setLang('en'); setLangOpen(false); }}
                className="w-full px-4 py-3 hover:bg-white/10 flex items-center gap-2 border-b border-white/10">
                🇬🇧 English
              </button>

              <button onClick={() => { setLang('es'); setLangOpen(false); }}
                className="w-full px-4 py-3 hover:bg-white/10 flex items-center gap-2">
                🇪🇸 Español
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold mt-24 mb-3 text-center">
        {t.title}
      </h1>

      <p className="text-center text-emerald-200/90 max-w-2xl mb-10">
        {t.subtitle}
      </p>

      {/* FORM */}
      <form onSubmit={handleCalculate}
        className="bg-black/50 border border-white/10 backdrop-blur-xl p-6 rounded-3xl max-w-2xl w-full space-y-6">

        {/* select profession */}
        <div>
          <label className="text-emerald-300 text-sm">{t.selectProfession}</label>
          <div className="relative">
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-white/20 text-white"
            >
              <option value="">{t.selectProfession}</option>
              {professions.map((p) => (
                <option key={p} value={p}>
                  {professionNames[lang][p]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* range */}
        <div>
          <label className="text-emerald-300 text-sm">{t.selectRange}</label>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-white/20"
          >
            <option value="">{t.selectRange}</option>
            {levelRanges.map((r) => (
              <option key={r.range} value={r.range}>{r.range}</option>
            ))}
          </select>
        </div>

        {/* exp per craft */}
        <div>
          <label className="text-emerald-300 text-sm">{t.expPerItem}</label>
          <input
            type="number"
            value={expPerItem}
            onChange={(e) => setExpPerItem(e.target.value)}
            placeholder={t.expPlaceholder}
            className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-white/20"
          />
        </div>

        <button
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-4 rounded-xl"
        >
          {t.calculate}
        </button>
      </form>

      {/* RESULTS */}
      {result && (
        <div className="bg-emerald-950/80 border border-emerald-500/30 mt-10 rounded-3xl p-6 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">
            {t.resultsFor} {professionNames[lang][result.selectedProfession]}
            <span className="text-sm ml-3 opacity-70">{result.range}</span>
          </h2>

          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>{t.firstResource}</span>
              <span className="font-bold">{result.resourceCount}</span>
            </li>
            <li className="flex justify-between">
              <span>{t.secondResource}</span>
              <span className="font-bold">{result.resourceCount}</span>
            </li>
            <li className="flex justify-between border-t border-white/10 pt-3 mt-3">
              <span>{t.craftsNeeded}</span>
              <span className="font-bold text-2xl">{result.craftCount}</span>
            </li>
            <li className="flex justify-between">
              <span className="opacity-75">{t.xpDiff}</span>
              <span className="opacity-75">{result.expDiff} XP</span>
            </li>
          </ul>
        </div>
      )}

      <footer className="mt-16 text-emerald-200/40 text-xs text-center pb-6">
        <p>WAKFU is an MMORPG published by Ankama.</p>
        <p>"wakfujobcalculator" is an unofficial website.</p>
        <p className="mt-2">{new Date().getFullYear()} {t.createdBy} KreedAc & LadyKreedAc</p>
      </footer>

    </div>
  );
}
