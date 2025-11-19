import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function App() {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const BG_URL = '424478.jpg';

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

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
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.85) saturate(1.1)' }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-900/40 via-emerald-800/20 to-sky-900/40" />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,0.55)' }} />

      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        {/* Hamburger Menu */}
        <div className="relative">
          <button
            id="hamburger-btn"
            aria-haspopup="menu"
            aria-expanded={hamburgerOpen}
            onClick={() => setHamburgerOpen(v => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/20 border border-white/30 backdrop-blur shadow"
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
              className="absolute left-0 mt-2 w-48 rounded-xl overflow-hidden border border-white/20 bg-white/90 text-gray-900 shadow-2xl backdrop-blur z-10"
            >
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
            </div>
          )}
        </div>

        {/* Language dropdown */}
        <div className="relative">
          <button
            id="lang-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/20 border border-white/30 backdrop-blur shadow text-sm"
            title={t.langLabel}
          >
            <span>{flags[lang]}</span>
            <span className="hidden sm:inline">{t.langLabel}</span>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/></svg>
          </button>
          {menuOpen && (
            <div
              id="lang-menu"
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-white/20 bg-white/90 text-gray-900 shadow-2xl backdrop-blur z-10"
            >
              <button onClick={() => { setLang('fr'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2">🇫🇷 <span>Français</span></button>
              <button onClick={() => { setLang('en'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2">🇬🇧 <span>English</span></button>
              <button onClick={() => { setLang('es'); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2">🇪🇸 <span>Español</span></button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-6 text-center text-emerald-200">{t.title}</h1>
      <p className="text-emerald-100/90 mb-8 text-center max-w-2xl">{t.subtitle}</p>

      <form onSubmit={handleCalculate} className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.selectProfession}</label>
            <select aria-label={t.selectProfession} value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- {t.selectProfession} --</option>
              {professions.map((p, i) => (<option key={i} value={p}>{professionNames[lang][p]}</option>))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.selectRange}</label>
            <select aria-label={t.selectRange} value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- {t.selectRange} --</option>
              {levelRanges.map((r, i) => (<option key={i} value={r.range}>{r.range}</option>))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.recipe}</label>
            <p className="p-3 rounded-lg bg-white/80 text-gray-900 font-semibold">{recipeDisplay}</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.expPerItem}</label>
            <input type="number" value={expPerItem} onChange={(e) => setExpPerItem(e.target.value)} placeholder={t.expPlaceholder} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required />
          </div>
        </div>

        <button type="submit" className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition shadow-lg shadow-emerald-900/30">{t.calculate}</button>
      </form>

      {result && (
        <div className="mt-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-xl w-full">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-200">{t.resultsFor} {professionNames[lang][result.selectedProfession]} ({result.range})</h2>
            <ul className="divide-y divide-white/15 text-emerald-50/95">
              <li className="py-2 flex items-center justify-between"><span>{t.firstResource}</span><span className="font-semibold text-emerald-300">{result.resourceCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.secondResource}</span><span className="font-semibold text-emerald-300">{result.resourceCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.craftsNeeded}</span><span className="font-semibold text-emerald-300">{result.craftCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.xpDiff}</span><span className="font-semibold text-emerald-300">{result.expDiff.toLocaleString()}</span></li>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`::selection{ background: rgba(16, 185, 129, 0.35); }`}</style>
      <footer className="mt-12 text-emerald-200/80 text-sm text-center drop-shadow">© {new Date().getFullYear()} {t.createdBy} KreedAc and LadyKreedAc</footer>
    </div>
  );
}
