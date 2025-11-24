import React, { useState, useEffect } from 'react';
import { BookOpen, Hammer, ChefHat, Scroll, Shield, Scissors, Gem, Wrench } from 'lucide-react';

// Mock Supabase client since env vars are not available in preview
const supabase = {
  from: (table) => ({
    insert: async (data) => {
      console.log(`[Mock Supabase] Insert into ${table}:`, data);
      return { error: null };
    }
  })
};

export default function App() {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Using a fantasy landscape placeholder since the local file isn't available
  const BG_URL = 'https://drive.google.com/file/d/1vjyUkLt71_9t_XKgnEdO1YSqk-YieN3o/view?usp=sharing';

  const flags = { en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸' };

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
      langLabel: 'Language'
    },
    fr: {
      title: 'Calculateur d\'XP d\'Artisanat Wakfu',
      subtitle: 'Choisissez votre métier, une tranche de niveaux, puis saisissez l\'XP par objet fabriqué.',
      selectProfession: 'Sélectionner un métier',
      selectRange: 'Sélectionner une tranche de niveaux',
      recipe: 'Recette',
      expPerItem: 'XP par objet fabriqué',
      expPlaceholder: 'ex. 150',
      calculate: 'Calculer le nombre de fabrications',
      resultsFor: 'Résultats pour',
      firstResource: 'Quantité du premier matériau à collecter :',
      secondResource: 'Quantité du deuxième matériau à collecter :',
      craftsNeeded: 'Fabrications nécessaires',
      xpDiff: 'Différence d\'XP',
      alert: 'Veuillez remplir tous les champs et sélectionner un métier et une tranche de niveaux.',
      recipeName: 'Nom de la recette',
      createdBy: 'Créé par',
      langLabel: 'Langue'
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
      alert: 'Por favor, completa todos los campos y selecciona una profesión y un rango de niveles.',
      recipeName: 'Nombre de la receta',
      createdBy: 'Creado por',
      langLabel: 'Idioma'
    }
  };

  const t = i18n[lang];

  // Use internal IDs for professions, map to localized display names per language
  const PROF_IDS = [
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
      'Armorer': 'Armurier', // FR official: Armurier
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

  const professions = PROF_IDS;

  const levelRanges = [
    { range: '2 - 10', expDiff: 7500, recipe: { en: 'Coarse', fr: 'Grossière', es: 'Tosca' } },
    { range: '10 - 20', expDiff: 22500, recipe: { en: 'Basic', fr: 'Rudimentaire', es: 'Rudimentaria' } },
    { range: '20 - 30', expDiff: 37500, recipe: { en: 'Imperfect', fr: 'Imparfait', es: 'Imperfecta' } },
    { range: '30 - 40', expDiff: 52500, recipe: { en: 'Fragile', fr: 'Fragile', es: 'Frágil' } },
    { range: '40 - 50', expDiff: 67500, recipe: { en: 'Rustic', fr: 'Rustique', es: 'Rústica' } },
    { range: '50 - 60', expDiff: 82500, recipe: { en: 'Raw', fr: 'Brut', es: 'Bruta' } },
    { range: '60 - 70', expDiff: 97500, recipe: { en: 'Solid', fr: 'Solide', es: 'Sólida' } },
    { range: '70 - 80', expDiff: 112500, recipe: { en: 'Durable', fr: 'Durable', es: 'Duradera' } },
    { range: '80 - 90', expDiff: 127500, recipe: { en: 'Refined', fr: 'Raffiné', es: 'Refinada' } },
    { range: '90 - 100', expDiff: 142500, recipe: { en: 'Precious', fr: 'Précieux', es: 'Preciosa' } },
    { range: '100 - 110', expDiff: 157500, recipe: { en: 'Exquisite', fr: 'Exquis', es: 'Exquisita' } },
    { range: '110 - 120', expDiff: 172500, recipe: { en: 'Mystical', fr: 'Mystique', es: 'Mistica' } },
    { range: '120 - 130', expDiff: 187500, recipe: { en: 'Eternal', fr: 'Eternel', es: 'Eterna' } },
    { range: '130 - 140', expDiff: 202500, recipe: { en: 'Divine', fr: 'Divin', es: 'Divina' } },
    { range: '140 - 150', expDiff: 217500, recipe: { en: 'Infernal', fr: 'Infernal', es: 'Infernal' } },
    { range: '150 - 160', expDiff: 232500, recipe: { en: 'Ancestral', fr: 'Ancestral', es: 'Ancestral' } }
  ];

  
  const professionRecipes = {
    en: {
      'Weapons Master': 'Handle',
      'Handyman': 'Bracket',
      'Baker': 'Oil',
      'Chef': 'Spice',
      'Armorer': 'Plate',
      'Jeweler': 'Gem',
      'Leather Dealer': 'Leather',
      'Tailor': 'Fiber'
    },
    fr: {
      'Weapons Master': 'Manche',
      'Handyman': 'Equerre',
      'Baker': 'Huile',
      'Chef': 'Epice',
      'Armorer': 'Plaque',
      'Jeweler': 'Gemme',
      'Leather Dealer': 'Cuir',
      'Tailor': 'Fibre'
    },
    es: {
      'Weapons Master': 'Mango',
      'Handyman': 'Escuadrita',
      'Baker': 'Aceite',
      'Chef': 'Especia',
      'Armorer': 'Placa',
      'Jeweler': 'Gema',
      'Leather Dealer': 'Cuero',
      'Tailor': 'Fibra'
    }
  };

  function handleCalculate(e) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);

    if (!expItem || expItem <= 0 || !selectedRange || !selectedProfession) {
      alert(t.alert);
      return;
    }

    const selected = levelRanges.find(r => r.range === selectedRange);
    if (!selected) return;

    const craftCount = Math.ceil(selected.expDiff / expItem);
    const resourceCount = craftCount * 5;

    setResult({ ...selected, selectedProfession, craftCount, resourceCount });
  }

  const currentRangeRecipeObj = levelRanges.find(r => r.range === selectedRange)?.recipe;
  const currentRangeRecipe = currentRangeRecipeObj ? currentRangeRecipeObj[lang] : t.recipeName;
  const currentProfessionRecipe = professionRecipes[lang][selectedProfession] || '';
  const recipeDisplay = `${currentRangeRecipe}${currentProfessionRecipe ? `  ${currentProfessionRecipe}` : ''}`;

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from('visitors').insert({
          page: '/',
          user_agent: navigator.userAgent
        });
      } catch (error) {
        console.log('Visit tracking skipped');
      }
    };
    trackVisit();
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      const langMenu = document.getElementById('lang-menu');
      const langBtn = document.getElementById('lang-btn');
      const hamburgerMenu = document.getElementById('hamburger-menu');
      const hamburgerBtn = document.getElementById('hamburger-btn');

      if (langMenu && langBtn && !langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        setMenuOpen(false);
      }
      if (hamburgerMenu && hamburgerBtn && !hamburgerMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.65) saturate(1.1)' }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-900/40 via-emerald-800/20 to-sky-900/40" />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,0.55)' }} />

      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
        {/* Hamburger Menu */}
        <div className="relative">
          <button
            id="hamburger-btn"
            aria-haspopup="menu"
            aria-expanded={hamburgerOpen}
            onClick={(e) => {
              e.stopPropagation();
              setHamburgerOpen(v => !v);
              setMenuOpen(false);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/10 border border-white/20 backdrop-blur shadow transition-colors"
            title="Menu"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {hamburgerOpen && (
            <div
              id="hamburger-menu"
              role="menu"
              className="absolute left-0 mt-2 w-56 rounded-xl overflow-hidden border border-white/20 bg-gray-900/95 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Navigation</p>
              </div>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5">Work in progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5">Work in progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors">Work in progress</button>
            </div>
          )}
        </div>

        {/* Language dropdown */}
        <div className="relative">
          <button
            id="lang-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(v => !v);
              setHamburgerOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/10 border border-white/20 backdrop-blur shadow text-sm transition-colors"
            title={t.langLabel}
          >
            <span className="text-lg">{flags[lang]}</span>
            <span className="hidden sm:inline font-medium">{t.langLabel}</span>
            <svg className="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/></svg>
          </button>
          {menuOpen && (
            <div
              id="lang-menu"
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-white/20 bg-gray-900/95 text-white shadow-2xl backdrop-blur-xl animate-in fade-inZb slide-in-from-top-2 duration-200"
            >
              <button onClick={() => { setLang('fr'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5">
                <span className="text-xl">🇫🇷</span> <span className="font-medium">Français</span>
              </button>
              <button onClick={() => { setLang('en'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5">
                <span className="text-xl">🇬🇧</span> <span className="font-medium">English</span>
              </button>
              <button onClick={() => { setLang('es'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors">
                <span className="text-xl">🇪🇸</span> <span className="font-medium">Español</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
          {t.title}
        </h1>
        <p className="text-emerald-100/90 mb-10 text-center max-w-2xl text-lg leading-relaxed drop-shadow-md">
          {t.subtitle}
        </p>

        <form onSubmit={handleCalculate} className="backdrop-blur-xl bg-gray-900/60 border border-white/10 shadow-2xl rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-300 ml-1">{t.selectProfession}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-400">
                  <Hammer className="w-5 h-5" />
                </div>
                <select 
                  aria-label={t.selectProfession} 
                  value={selectedProfession} 
                  onChange={(e) => setSelectedProfession(e.target.value)} 
                  className="w-full p-4 pl-12 rounded-xl bg-black/40 text-emerald-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50" 
                  required
                >
                  <option value="" className="bg-gray-900 text-gray-400">-- {t.selectProfession} --</option>
                  {professions.map((p, i) => (<option key={i} value={p} className="bg-gray-900">{professionNames[lang][p]}</option>))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-300 ml-1">{t.selectRange}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <select 
                  aria-label={t.selectRange} 
                  value={selectedRange} 
                  onChange={(e) => setSelectedRange(e.target.value)} 
                  className="w-full p-4 pl-12 rounded-xl bg-black/40 text-emerald-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50" 
                  required
                >
                  <option value="" className="bg-gray-900 text-gray-400">-- {t.selectRange} --</option>
                  {levelRanges.map((r, i) => (<option key={i} value={r.range} className="bg-gray-900">{r.range}</option>))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-emerald-300 ml-1">{t.recipe}</label>
              <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/20 text-emerald-100 font-medium flex items-center gap-3">
                <Scroll className="w-5 h-5 text-emerald-400" />
                {recipeDisplay}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-emerald-300 ml-1">{t.expPerItem}</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={expPerItem} 
                  onChange={(e) => setExpPerItem(e.target.value)} 
                  placeholder={t.expPlaceholder} 
                  className="w-full p-4 rounded-xl bg-black/40 text-emerald-50 border border-white/10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" 
                  required 
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-emerald-400/50 text-sm font-medium">
                  XP
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t.calculate}
          </button>
        </form>

        {result && (
          <div className="mt-8 backdrop-blur-xl bg-emerald-950/80 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-emerald-900/50 px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Hammer className="w-6 h-6 text-emerald-400" />
                {t.resultsFor} <span className="text-emerald-300">{professionNames[lang][result.selectedProfession]}</span>
                <span className="text-sm px-3 py-1 bg-black/30 rounded-full text-emerald-200/80 ml-auto border border-white/5">{result.range}</span>
              </h2>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                  <span className="text-emerald-100/80">{t.firstResource}</span>
                  <span className="font-bold text-2xl text-white font-mono">{result.resourceCount.toLocaleString()}</span>
                </li>
                <li className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                  <span className="text-emerald-100/80">{t.secondResource}</span>
                  <span className="font-bold text-2xl text-white font-mono">{result.resourceCount.toLocaleString()}</span>
                </li>
                <div className="my-2 border-t border-white/10" />
                <li className="flex items-center justify-between">
                  <span className="text-emerald-200 font-medium">{t.craftsNeeded}</span>
                  <span className="font-bold text-3xl text-emerald-400 font-mono drop-shadow-sm">{result.craftCount.toLocaleString()}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-emerald-200/60 text-sm">{t.xpDiff}</span>
                  <span className="font-medium text-emerald-200/60 font-mono">{result.expDiff.toLocaleString()} XP</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <footer className="mt-16 text-emerald-200/40 text-xs text-center pb-8 font-medium">
          <p>WAKFU is an MMORPG published by Ankama.</p>
          <p className="mt-1">"wakfujobcalculator" is an unofficial website with no connection to Ankama.</p>
          <p className="mt-4 opacity-75">{new Date().getFullYear()} {t.createdBy} KreedAc and LadyKreedAc</p>
        </footer>
      </div>
    </div>
  );
}