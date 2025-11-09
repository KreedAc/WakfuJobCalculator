import { useState, useEffect } from 'react';

export default function App() {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const BG_URL = '424478.jpg';
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

  const professions = PROF_IDS;

  // Ricette base (in inglese)
  const baseLevelRanges = [
    { range: '2 - 10', expDiff: 7500, recipe: 'Coarse' },
    { range: '10 - 20', expDiff: 22500, recipe: 'Basic' },
    { range: '20 - 30', expDiff: 37500, recipe: 'Imperfect' },
    { range: '30 - 40', expDiff: 52500, recipe: 'Fragile' },
    { range: '40 - 50', expDiff: 67500, recipe: 'Rustic' },
    { range: '50 - 60', expDiff: 82500, recipe: 'Raw' },
    { range: '60 - 70', expDiff: 97500, recipe: 'Solid' },
    { range: '70 - 80', expDiff: 112500, recipe: 'Durable' },
    { range: '80 - 90', expDiff: 127500, recipe: 'Refined' },
    { range: '90 - 100', expDiff: 142500, recipe: 'Precious' },
    { range: '100 - 110', expDiff: 157500, recipe: 'Exquisite' },
    { range: '110 - 120', expDiff: 172500, recipe: 'Mystical' },
    { range: '120 - 130', expDiff: 187500, recipe: 'Eternal' },
    { range: '130 - 140', expDiff: 202500, recipe: 'Divine' },
    { range: '140 - 150', expDiff: 217500, recipe: 'Infernal' },
    { range: '150 - 160', expDiff: 232500, recipe: 'Ancestral' }
  ];

  // Traduzioni francesi per le ricette
  const frenchRecipes = {
    'Coarse': 'Grossière',
    'Basic': 'Rudimentaire',
    'Imperfect': 'Imparfait',
    'Fragile': 'Fragile',
    'Rustic': 'Rustique',
    'Raw': 'Brut',
    'Solid': 'Solide',
    'Durable': 'Durable',
    'Refined': 'Raffiné',
    'Precious': 'Précieux',
    'Exquisite': 'Exquis',
    'Mystical': 'Mystique',
    'Eternal': 'Éternel',
    'Divine': 'Divin',
    'Infernal': 'Infernal',
    'Ancestral': 'Ancestral'
  };

  // Traduzioni francesi per gli oggetti professionali
  const frenchProfessionRecipes = {
    'Weapons Master': 'Manche',
    'Handyman': 'Équerre',
    'Baker': 'Huile',
    'Chef': 'Épice',
    'Armorer': 'Plaque',
    'Jeweler': 'Gemme',
    'Leather Dealer': 'Cuir',
    'Tailor': 'Fibre'
  };

  // Base profession recipes
  const professionRecipes = {
    'Weapons Master': 'Handle',
    'Handyman': 'Bracket',
    'Baker': 'Oil',
    'Chef': 'Spice',
    'Armorer': 'Plate',
    'Jeweler': 'Gem',
    'Leather Dealer': 'Leather',
    'Tailor': 'Fiber'
  };

  // Se la lingua è francese, applica traduzioni francesi
  const levelRanges = baseLevelRanges.map(r => ({
    ...r,
    recipe: lang === 'fr' ? frenchRecipes[r.recipe] || r.recipe : r.recipe
  }));

  const localizedProfessionRecipes = lang === 'fr' ? frenchProfessionRecipes : professionRecipes;

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

  const currentRangeRecipe = levelRanges.find(r => r.range === selectedRange)?.recipe || t.recipeName;
  const currentProfessionRecipe = localizedProfessionRecipes[selectedProfession] || '';
  const recipeDisplay = `${currentRangeRecipe}${currentProfessionRecipe ? `  ${currentProfessionRecipe}` : ''}`;

  // Chiude il menu lingue cliccando fuori
  useEffect(() => {
    function onDocClick(e) {
      const menu = document.getElementById('lang-menu');
      const btn = document.getElementById('lang-btn');
      if (!menu || !btn) return;
      if (!menu.contains(e.target) && !btn.contains(e.target)) setMenuOpen(false);
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

      {/* resto del codice invariato */}
