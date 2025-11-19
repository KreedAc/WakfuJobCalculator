import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- DATI CONSOLIDATI E I18N ---

const PROFESSIONS_DATA = {
  Armorer: { fr: 'Armurier', es: 'Armero', recipe: { en: 'Plate', fr: 'Plaque', es: 'Placa' } },
  Baker: { fr: 'Boulanger', es: 'Panadero', recipe: { en: 'Oil', fr: 'Huile', es: 'Aceite' } },
  Chef: { fr: 'Cuisinier', es: 'Cocinero', recipe: { en: 'Spice', fr: 'Epice', es: 'Especia' } },
  Handyman: { fr: 'Bricoleur', es: 'Ebanista', recipe: { en: 'Bracket', fr: 'Equerre', es: 'Escuadrita' } },
  Jeweler: { fr: 'Bijoutier', es: 'Joyero', recipe: { en: 'Gem', fr: 'Gemme', es: 'Gema' } },
  'Leather Dealer': { fr: 'Maroquinier', es: 'Peletero', recipe: { en: 'Leather', fr: 'Cuir', es: 'Cuero' } },
  Tailor: { fr: 'Tailleur', es: 'Sastre', recipe: { en: 'Fiber', fr: 'Fibre', es: 'Fibra' } },
  'Weapons Master': { fr: "Maître d'armes", es: 'Maestro de armas', recipe: { en: 'Handle', fr: 'Manche', es: 'Mango' } },
};

const LEVEL_RANGES = [
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

const I18N = {
  en: {
    title: 'Wakfu Crafting XP Calculator', subtitle: 'Select your profession, choose a level range, and enter the EXP per crafted item.',
    selectProfession: 'Select Profession', selectRange: 'Select Level Range', recipe: 'Recipe',
    expPerItem: 'EXP per Crafted Item', expPlaceholder: 'e.g. 150', calculate: 'Calculate Required Crafts',
    resultsFor: 'Results for', firstResource: 'Collect the first resource quantity:', secondResource: 'Collect the second resource quantity:',
    craftsNeeded: 'Crafts Needed', xpDiff: 'XP Difference',
    alert: 'Please fill all fields and select a profession and level range.',
    recipeName: 'Recipe Name', createdBy: 'Created by', langLabel: 'Language',
  },
  fr: {
    title: 'Calculateur d\'XP d\'Artisanat Wakfu', subtitle: 'Choisissez votre métier, une tranche de niveaux, puis saisissez l\'XP par objet fabriqué.',
    selectProfession: 'Sélectionner un métier', selectRange: 'Sélectionner une tranche de niveaux', recipe: 'Recette',
    expPerItem: 'XP par objet fabriqué', expPlaceholder: 'ex. 150', calculate: 'Calculer le nombre de fabrications',
    resultsFor: 'Résultats pour', firstResource: 'Quantité du premier matériau à collecter :', secondResource: 'Quantité du deuxième matériau à collecter :',
    craftsNeeded: 'Fabrications nécessaires', xpDiff: 'Différence d\'XP',
    alert: 'Veuillez remplir tous les champs et sélectionner un métier et une tranche de niveaux.',
    recipeName: 'Nom de la recette', createdBy: 'Créé par', langLabel: 'Langue',
  },
  es: {
    title: 'Calculadora de XP de Artesanía de Wakfu', subtitle: 'Elige tu profesión, un rango de niveles e introduce la XP por objeto creado.',
    selectProfession: 'Seleccionar profesión', selectRange: 'Seleccionar rango de niveles', recipe: 'Receta',
    expPerItem: 'XP por objeto creado', expPlaceholder: 'p. ej., 150', calculate: 'Calcular creaciones necesarias',
    resultsFor: 'Resultados para', firstResource: 'Cantidad del primer recurso a recolectar:', secondResource: 'Cantidad del segundo recurso a recolectar:',
    craftsNeeded: 'Creaciones necesarias', xpDiff: 'Diferencia de XP',
    alert: 'Por favor, completa todos los campos y selecciona una profesión y un rango de niveles.',
    recipeName: 'Nombre de la receta', createdBy: 'Creado por', langLabel: 'Idioma',
  }
};

const FLAGS = { en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸' };
const BG_URL = '424478.jpg';

// --- COMPONENTE PRINCIPALE ---

export default function App() {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Alias per le traduzioni correnti
  const t = I18N[lang];

  // Inizializzazione client Supabase
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // --- FUNZIONI DI ACCESSO AI DATI E CALCOLO ---

  // Ricerca del range selezionato per l'XP e il nome della ricetta
  const currentRangeData = LEVEL_RANGES.find(r => r.range === selectedRange);
  
  // Ottiene il nome localizzato della professione
  const getProfessionName = (id) => (
    (id && PROFESSIONS_DATA[id] && PROFESSIONS_DATA[id][lang]) || id
  );

  // Calcola e formatta la visualizzazione della ricetta
  const recipeDisplay = (() => {
    const rangeRecipe = currentRangeData?.recipe[lang] || t.recipeName;
    const professionRecipe = PROFESSIONS_DATA[selectedProfession]?.recipe[lang] || '';
    
    // Usa solo uno spazio tra i due elementi, evitando spazi se professionRecipe è vuoto
    return professionRecipe ? `${rangeRecipe} ${professionRecipe}` : rangeRecipe;
  })();

  function handleCalculate(e) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);

    if (!expItem || expItem <= 0 || !currentRangeData || !selectedProfession) {
      alert(t.alert);
      return;
    }

    const { expDiff } = currentRangeData;
    
    // Calcolo: arrotonda per eccesso (Math.ceil)
    const craftCount = Math.ceil(expDiff / expItem);
    // Presume 5 unità per tipo di risorsa per ogni craft
    const resourceCount = craftCount * 5;

    setResult({ 
      ...currentRangeData, 
      selectedProfession, 
      craftCount, 
      resourceCount 
    });
  }

  // --- EFFETTI COLLATERALI E LOGICA UI ---

  // 1. Tracciamento Visite (Rimosso 'try/catch' per pulizia, mantenuto 'async/await')
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from('visitors').insert({
          page: '/',
          user_agent: navigator.userAgent
        });
      } catch (error) {
        // console.log('Visit tracking skipped'); // Rimosso il log per pulizia
      }
    };
    // Esegue il tracciamento solo se Supabase è configurato (implicito)
    trackVisit();
  }, [supabase]); // Aggiunto 'supabase' come dipendenza, anche se statica

  // 2. Click Outside Logic (Snellita la funzione di pulizia)
  useEffect(() => {
    function onDocClick(e) {
      // Funzione helper per controllare se il click è fuori dal menu/bottone
      const isOutside = (menuId, btnId) => {
        const menu = document.getElementById(menuId);
        const btn = document.getElementById(btnId);
        return menu && btn && !menu.contains(e.target) && !btn.contains(e.target);
      };
      
      // Chiusura dei menu
      if (isOutside('lang-menu', 'lang-btn')) setMenuOpen(false);
      if (isOutside('hamburger-menu', 'hamburger-btn')) setHamburgerOpen(false);
    }
    
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // --- RENDERING ---

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background ottimizzato con un singolo div */}
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.85) saturate(1.1)' }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-900/40 via-emerald-800/20 to-sky-900/40" />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,0.55)' }} />

      {/* Top Navigation - Semplificato il rendering dei pulsanti */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        {/* Hamburger Menu */}
        <div className="relative">
          <button
            id="hamburger-btn" aria-haspopup="menu" aria-expanded={hamburgerOpen}
            onClick={() => setHamburgerOpen(v => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/20 border border-white/30 backdrop-blur shadow"
            title="Menu" aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {hamburgerOpen && (
            <div id="hamburger-menu" role="menu" className="absolute left-0 mt-2 w-48 rounded-xl overflow-hidden border border-white/20 bg-white/90 text-gray-900 shadow-2xl backdrop-blur z-10">
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
              <button role="menuitem" className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium">Work in Progress</button>
            </div>
          )}
        </div>

        {/* Language dropdown */}
        <div className="relative">
          <button
            id="lang-btn" aria-haspopup="menu" aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/20 border border-white/30 backdrop-blur shadow text-sm"
            title={t.langLabel}
          >
            <span>{FLAGS[lang]}</span>
            <span className="hidden sm:inline">{t.langLabel}</span>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/></svg>
          </button>
          {menuOpen && (
            <div id="lang-menu" role="menu" className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-white/20 bg-white/90 text-gray-900 shadow-2xl backdrop-blur z-10">
              {Object.keys(I18N).map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }} role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
                  {FLAGS[l]} <span>{l.charAt(0).toUpperCase() + l.slice(1)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-6 text-center text-emerald-200">{t.title}</h1>
      <p className="text-emerald-100/90 mb-8 text-center max-w-2xl">{t.subtitle}</p>

      {/* FORM DI CALCOLO */}
      <form onSubmit={handleCalculate} className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.selectProfession}</label>
            <select aria-label={t.selectProfession} value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- {t.selectProfession} --</option>
              {Object.keys(PROFESSIONS_DATA).map((p) => (<option key={p} value={p}>{getProfessionName(p)}</option>))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">{t.selectRange}</label>
            <select aria-label={t.selectRange} value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- {t.selectRange} --</option>
              {LEVEL_RANGES.map((r) => (<option key={r.range} value={r.range}>{r.range}</option>))}
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

      {/* RISULTATI */}
      {result && (
        <div className="mt-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-xl w-full">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-200">{t.resultsFor} {getProfessionName(result.selectedProfession)} ({result.range})</h2>
            <ul className="divide-y divide-white/15 text-emerald-50/95">
              <li className="py-2 flex items-center justify-between"><span>{t.firstResource}</span><span className="font-semibold text-emerald-300">{result.resourceCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.secondResource}</span><span className="font-semibold text-emerald-300">{result.resourceCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.craftsNeeded}</span><span className="font-semibold text-emerald-300">{result.craftCount.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>{t.xpDiff}</span><span className="font-semibold text-emerald-300">{result.expDiff.toLocaleString()}</span></li>
            </ul>
          </div>
        </div>
      )}

      {/* FOOTER