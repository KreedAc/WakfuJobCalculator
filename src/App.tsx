import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Hammer, Scroll, Search, Filter, AlertCircle, X, Menu, Sliders } from 'lucide-react';

/* =========================================
   CSS STYLES (Ported from sublimations.css)
   ========================================= */
const styles = `
  /* Sublimation-specific styles */
  .sublimation-container {
    max-width: 1800px;
    margin: 1.5rem auto;
    padding: 0 1rem;
    width: 100%;
  }

  /* ===== CONTROLS SECTION ===== */
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background: rgba(52, 76, 100, 0.6);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(87, 123, 141, 0.3);
    backdrop-filter: blur(5px);
  }

  .search-box {
    flex: 1;
    min-width: 250px;
    display: flex;
    align-items: center;
  }

  .search-box input {
    flex: 1;
    padding: 10px 16px;
    border: 2px solid #344C64;
    border-radius: 6px 0 0 6px;
    background: rgba(36, 7, 80, 0.4);
    color: #e0e0e0;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    height: 42px;
    box-sizing: border-box;
  }

  .search-box input:focus {
    border-color: #57A6A1;
    outline: none;
    box-shadow: 0 0 0 3px rgba(87, 166, 161, 0.2);
  }

  .search-btn {
    padding: 0 16px;
    background: #57A6A1;
    color: white;
    border: none;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    transition: background 0.3s;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-btn:hover {
    background: #4a8f8a;
  }

  .category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    padding: 8px;
    background: rgba(52, 76, 100, 0.6);
    border-radius: 10px;
    justify-content: center;
  }

  .category-tab {
    padding: 8px 16px;
    background: rgba(36, 7, 80, 0.4);
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid rgba(87, 123, 141, 0.3);
    font-size: 0.9rem;
    color: #e0e0e0;
  }

  .category-tab.active {
    background: #57A6A1;
    font-weight: bold;
    color: white;
    box-shadow: 0 0 10px rgba(87, 166, 161, 0.4);
  }

  .category-tab:hover {
    background: rgba(87, 166, 161, 0.3);
  }

  /* ===== RUNES GRID ===== */
  .runes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .rune-card {
    background: rgba(52, 76, 100, 0.6);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(87, 123, 141, 0.3);
    backdrop-filter: blur(5px);
    padding: 12px;
  }

  .rune-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border-color: #57A6A1;
  }

  .rune-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 16px;
  }

  .rune-name-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .rune-name {
    font-size: 1.3rem;
    font-weight: bold;
    color: #6fd6d0;
    margin-bottom: 2px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rune-name.relic-name { color: #9b59b6; }
  .rune-name.epic-name { color: #ff00cc; }

  .rune-level {
    font-size: 0.85rem;
    color: #6aa0bb;
  }

  .rune-colors {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .rune-color {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .color-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .special-color {
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.7rem;
    text-transform: uppercase;
  }
  .special-color.epic { background: linear-gradient(45deg, #ff00cc, #ff0066); color: white; }
  .special-color.relic { background: linear-gradient(45deg, #9b59b6, #8e44ad); color: white; }

  .divider {
    height: 1px;
    background: rgba(87, 123, 141, 0.3);
    margin: 8px 0;
  }

  .rune-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.85rem;
    color: #a0c0d0;
  }

  .obtenation {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .obtenation-icon {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: rgba(0,0,0,0.2);
    object-fit: contain;
  }

  .rune-description {
    background: rgba(36, 7, 80, 0.4);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 0.95rem;
    line-height: 1.4;
    border: 1px solid rgba(87, 123, 141, 0.3);
    min-height: 60px;
    color: #e0e0e0;
  }

  .level-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
  }

  .level-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: rgba(36, 7, 80, 0.6);
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  .level-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #57A6A1;
    cursor: pointer;
    border: 2px solid #fff;
  }

  .level-display {
    min-width: 30px;
    text-align: center;
    font-weight: bold;
    color: #57A6A1;
    background: rgba(0,0,0,0.3);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .loading-container {
    text-align: center;
    padding: 40px;
    color: #57A6A1;
  }
`;

// Helper component for Local Images with fallback
const LocalImage = ({ src, alt, className, fallbackText }) => {
  const [error, setError] = useState(false);

  if (error) {
    if (fallbackText) return <span className={`text-xs font-bold ${className}`}>{fallbackText}</span>;
    return <div className={`bg-gray-700 flex items-center justify-center ${className}`} title={alt}><span className="text-[8px] opacity-50">IMG</span></div>;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};

/* =========================================
   SUBLIMATIONS COMPONENT
   ========================================= */
function Sublimations() {
  const [runes, setRunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [runeLevels, setRuneLevels] = useState({}); // Map of runeName -> currentLevel

  // Fetch data from local JSON file
  useEffect(() => {
    async function fetchData() {
      try {
        // NOTE: This points to the file in the public folder as requested
        const response = await fetch('sublimations.json');
        if (!response.ok) {
           throw new Error(`Failed to load sublimations.json (Status: ${response.status})`);
        }
        const data = await response.json();
        setRunes(data);
        
        // Initialize levels
        const initialLevels = {};
        data.forEach(rune => {
            initialLevels[rune.name] = rune.minLevel || 1;
        });
        setRuneLevels(initialLevels);
        
      } catch (err) {
        console.error("Error loading runes:", err);
        setError(err.message);
        
        // Fallback data for preview purposes if json is missing
        const fallbackData = [
            {
                "name": "Influence",
                "colors": ["G", "B", "G"],
                "description": "[X]% Critical Hit",
                "rarity": ["Rare", "Mythic", "Legendary"],
                "effect": "Per additional level: +3% Critical hit",
                "maxLevel": 6,
                "minLevel": 1,
                "step": 1,
                "obtenation": { "name": "Runic Mimic" },
                "category": "Offensive",
                "values": [{ "base": 3, "increment": 3, "placeholder": "X" }]
            },
            {
                "name": "Save",
                "colors": ["B", "R", "R"],
                "description": "At end of turn: Unused AP are carried over to the next turn Max [X] AP",
                "rarity": ["Mythic"],
                "effect": "Per additional 2 levels: +1 AP max",
                "maxLevel": 6,
                "minLevel": 2,
                "step": 2,
                "obtenation": { "name": "Or'Hodruin Dungeon" },
                "category": "Stats Increase",
                "values": [{ "base": 1, "increment": 1, "placeholder": "X" }]
            }
        ];
        // Only set fallback if we strictly want to show something in preview when file is missing
        // setRunes(fallbackData); 
        // setRuneLevels({ "Influence": 1, "Save": 2 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = useMemo(() => {
    if (!runes.length) return [];
    const cats = new Set(runes.map(r => r.category).filter(Boolean));
    return ['All Categories', ...Array.from(cats).sort()];
  }, [runes]);

  const handleLevelChange = (runeName, newLevel) => {
    setRuneLevels(prev => ({
        ...prev,
        [runeName]: parseInt(newLevel)
    }));
  };

  const processDescription = (rune) => {
    let description = rune.description;
    const currentLevel = runeLevels[rune.name] || rune.minLevel;

    if (rune.values && rune.values.length > 0) {
        rune.values.forEach(value => {
            // Calculate steps taken from min level
            const steps = Math.floor((currentLevel - rune.minLevel) / rune.step);
            const calculatedValue = value.base + (value.increment * steps);
            
            // Regex to replace [X], [Y] etc globally
            // Escaping the placeholder for regex safety
            const placeholder = value.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
            description = description.replace(regex, calculatedValue);
        });
    }
    return description;
  };

  const filteredRunes = runes.filter(rune => {
    const matchesSearch = 
        rune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rune.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || rune.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="sublimation-container loading-container">
        <div className="animate-spin mb-4"><Sliders className="w-8 h-8 mx-auto"/></div>
        <p>Loading Sublimations...</p>
    </div>
  );

  return (
    <div className="sublimation-container fade-in">
      <style>{styles}</style>
      
      {/* Controls */}
      <div className="controls">
        <div className="search-box">
            <input 
                type="text" 
                placeholder="Search runes by name or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">
                <Search size={18} />
            </button>
        </div>
      </div>

      {/* Categories */}
      <div className="category-filter">
        {categories.map(cat => (
            <div 
                key={cat} 
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
            >
                {cat}
            </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                  <h3 className="font-bold">Error loading data</h3>
                  <p className="text-sm opacity-80">Make sure <code>sublimations.json</code> is placed in your site's folder.</p>
                  <p className="text-xs mt-1 font-mono">{error}</p>
              </div>
          </div>
      )}

      {/* Grid */}
      <div className="runes-grid">
        {filteredRunes.map(rune => {
            const isSpecial = rune.colors.includes('Epic') || rune.colors.includes('Relic');
            const currentLevel = runeLevels[rune.name] || rune.minLevel;
            const nameClass = rune.colors.includes('Relic') ? 'relic-name' : (rune.colors.includes('Epic') ? 'epic-name' : '');
            
            // Icon paths logic (preserving original logic)
            const getObtIcon = (name) => `./icons/${name.toLowerCase().replace(/\s+/g, '_')}.png`;

            return (
                <div key={rune.name} className="rune-card">
                    <div className="rune-header">
                        <div className="rune-name-container">
                            <div className={`rune-name ${nameClass}`}>{rune.name}</div>
                            {!isSpecial && <div className="rune-level">Lvl. {currentLevel}</div>}
                        </div>
                        <div className="rune-colors">
                            {rune.colors.map((color, idx) => {
                                if (['R','G','B'].includes(color)) {
                                    const iconMap = { R: 'red_slot.png', G: 'green_slot.png', B: 'blue_slot.png'};
                                    return (
                                        <div key={idx} className="rune-color" title={`${color} Slot`}>
                                            <LocalImage src={`./icons/${iconMap[color]}`} alt={color} className="color-icon" fallbackText={color} />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={idx} className={`special-color ${color.toLowerCase()}`}>
                                        {color}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="rune-meta">
                        <div className="obtenation">
                            {rune.obtenation && (
                                <>
                                   <LocalImage 
                                        src={rune.obtenation.localIcon || getObtIcon(rune.obtenation.name)} 
                                        alt={rune.obtenation.name} 
                                        className="obtenation-icon" 
                                    />
                                   <span className="truncate max-w-[120px]" title={rune.obtenation.name}>{rune.obtenation.name}</span>
                                </>
                            )}
                        </div>
                        {/* Rarity Icons */}
                        <div className="flex gap-1">
                             {rune.rarity.map((r, idx) => {
                                 const iconMap = { Rare: 'rare_icon.png', Mythic: 'mythic_icon.png', Legendary: 'legendary_icon.png' };
                                 // Epic/Relic use Obtenation icon usually in original code, simplifying here for standard display
                                 if(['Rare','Mythic','Legendary'].includes(r)) {
                                     return <LocalImage key={idx} src={`./icons/${iconMap[r]}`} alt={r} className="w-6 h-6 object-contain" />;
                                 }
                                 return null;
                             })}
                        </div>
                    </div>

                    <div className="rune-description">
                        {processDescription(rune)}
                    </div>

                    {!isSpecial && (
                        <div className="level-controls">
                            <input 
                                type="range" 
                                className="level-slider"
                                min={rune.minLevel}
                                max={rune.maxLevel}
                                step={rune.step}
                                value={currentLevel}
                                onChange={(e) => handleLevelChange(rune.name, e.target.value)}
                            />
                            <div className="level-display">{currentLevel}</div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
      
      {!loading && filteredRunes.length === 0 && !error && (
          <div className="text-center py-10 text-emerald-200/50">
              No sublimations found matching your criteria.
          </div>
      )}
    </div>
  );
}

/* =========================================
   MAIN APP COMPONENT
   ========================================= */

// Mock Supabase client
const supabase = {
  from: (table) => ({
    insert: async (data) => {
      console.log(`[Mock Supabase] Insert into ${table}:`, data);
      return { error: null };
    }
  })
};

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'sublimations'
  
  // Calculator State
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  
  // UI State
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const BG_URL = 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop';
  const flags = { en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸' };

  // ... (Keep existing translations and data) ...
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
      navCalc: 'XP Calculator',
      navSubli: 'Sublimations'
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
      langLabel: 'Langue',
      navCalc: 'Calculateur XP',
      navSubli: 'Sublimations'
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
      langLabel: 'Idioma',
      navCalc: 'Calculadora XP',
      navSubli: 'Sublimaciones'
    }
  };

  const t = i18n[lang];

  const PROF_IDS = ['Armorer','Baker','Chef','Handyman','Jeweler','Leather Dealer','Tailor','Weapons Master'];
  const professionNames = {
    en: { 'Armorer': 'Armorer', 'Baker': 'Baker', 'Chef': 'Chef', 'Handyman': 'Handyman', 'Jeweler': 'Jeweler', 'Leather Dealer': 'Leather Dealer', 'Tailor': 'Tailor', 'Weapons Master': 'Weapons Master' },
    fr: { 'Armorer': 'Armurier', 'Baker': 'Boulanger', 'Chef': 'Cuisinier', 'Handyman': 'Bricoleur', 'Jeweler': 'Bijoutier', 'Leather Dealer': 'Maroquinier', 'Tailor': 'Tailleur', 'Weapons Master': "Maître d'armes" },
    es: { 'Armorer': 'Armero', 'Baker': 'Panadero', 'Chef': 'Cocinero', 'Handyman': 'Ebanista', 'Jeweler': 'Joyero', 'Leather Dealer': 'Peletero', 'Tailor': 'Sastre', 'Weapons Master': 'Maestro de armas' }
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
    en: { 'Weapons Master': 'Handle', 'Handyman': 'Bracket', 'Baker': 'Oil', 'Chef': 'Spice', 'Armorer': 'Plate', 'Jeweler': 'Gem', 'Leather Dealer': 'Leather', 'Tailor': 'Fiber' },
    fr: { 'Weapons Master': 'Manche', 'Handyman': 'Equerre', 'Baker': 'Huile', 'Chef': 'Epice', 'Armorer': 'Plaque', 'Jeweler': 'Gemme', 'Leather Dealer': 'Cuir', 'Tailor': 'Fibre' },
    es: { 'Weapons Master': 'Mango', 'Handyman': 'Escuadrita', 'Baker': 'Aceite', 'Chef': 'Especia', 'Armorer': 'Placa', 'Jeweler': 'Gema', 'Leather Dealer': 'Cuero', 'Tailor': 'Fibra' }
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
    // Basic visit tracking
    const trackVisit = async () => {
      try { await supabase.from('visitors').insert({ page: '/', user_agent: navigator.userAgent }); } catch (error) { console.log('Tracking skipped'); }
    };
    trackVisit();

    // Click outside handler
    function onDocClick(e) {
      const langMenu = document.getElementById('lang-menu');
      const langBtn = document.getElementById('lang-btn');
      const hamburgerMenu = document.getElementById('hamburger-menu');
      const hamburgerBtn = document.getElementById('hamburger-btn');

      if (langMenu && langBtn && !langMenu.contains(e.target) && !langBtn.contains(e.target)) setMenuOpen(false);
      if (hamburgerMenu && hamburgerBtn && !hamburgerMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) setHamburgerOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center p-6 overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-700"
          style={{ 
            backgroundImage: `url(${BG_URL})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            filter: 'blur(2px) saturate(1.1)' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/80 via-emerald-900/60 to-slate-900/80" />
      </div>
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
          >
            <Menu className="w-6 h-6" />
          </button>
          {hamburgerOpen && (
            <div
              id="hamburger-menu"
              role="menu"
              className="absolute left-0 mt-2 w-64 rounded-xl overflow-hidden border border-white/20 bg-gray-900/95 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Navigation</p>
              </div>
              <button 
                onClick={() => { setActiveTab('calculator'); setHamburgerOpen(false); }}
                className={`w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5 flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-white/10 text-emerald-300' : ''}`}
              >
                <Hammer className="w-4 h-4" />
                {t.navCalc}
              </button>
              <button 
                onClick={() => { setActiveTab('sublimations'); setHamburgerOpen(false); }}
                className={`w-full text-left px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors border-b border-white/5 flex items-center gap-2 ${activeTab === 'sublimations' ? 'bg-white/10 text-emerald-300' : ''}`}
              >
                <Scroll className="w-4 h-4" />
                {t.navSubli}
              </button>
              <button disabled className="w-full text-left px-4 py-3 opacity-50 cursor-not-allowed text-sm font-medium">Work in progress</button>
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
          >
            <span className="text-lg">{flags[lang]}</span>
            <span className="hidden sm:inline font-medium">{t.langLabel}</span>
          </button>
          {menuOpen && (
            <div id="lang-menu" className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-white/20 bg-gray-900/95 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {['fr','en','es'].map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0">
                  <span className="text-xl">{flags[l]}</span> <span className="font-medium">{l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Español'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full flex flex-col items-center z-10 pt-20">
        
        {activeTab === 'calculator' && (
          <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in duration-500">
            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
              {t.title}
            </h1>
            <p className="text-emerald-100/90 mb-10 text-center max-w-2xl text-lg leading-relaxed drop-shadow-md">
              {t.subtitle}
            </p>

            <form onSubmit={handleCalculate} className="backdrop-blur-xl bg-gray-900/60 border border-white/10 shadow-2xl rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-300 ml-1">{t.selectProfession}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-400"><Hammer className="w-5 h-5" /></div>
                    <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="w-full p-4 pl-12 rounded-xl bg-black/40 text-emerald-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:bg-black/50" required>
                      <option value="" className="bg-gray-900 text-gray-400">-- {t.selectProfession} --</option>
                      {professions.map((p, i) => (<option key={i} value={p} className="bg-gray-900">{professionNames[lang][p]}</option>))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-300 ml-1">{t.selectRange}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-400"><BookOpen className="w-5 h-5" /></div>
                    <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="w-full p-4 pl-12 rounded-xl bg-black/40 text-emerald-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:bg-black/50" required>
                      <option value="" className="bg-gray-900 text-gray-400">-- {t.selectRange} --</option>
                      {levelRanges.map((r, i) => (<option key={i} value={r.range} className="bg-gray-900">{r.range}</option>))}
                    </select>
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
                    <input type="number" value={expPerItem} onChange={(e) => setExpPerItem(e.target.value)} placeholder={t.expPlaceholder} className="w-full p-4 rounded-xl bg-black/40 text-emerald-50 border border-white/10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-emerald-400/50 text-sm font-medium">XP</div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white shadow-lg transition-all transform hover:-translate-y-0.5">
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
                    <li className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"><span className="text-emerald-100/80">{t.firstResource}</span><span className="font-bold text-2xl text-white font-mono">{result.resourceCount.toLocaleString()}</span></li>
                    <li className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"><span className="text-emerald-100/80">{t.secondResource}</span><span className="font-bold text-2xl text-white font-mono">{result.resourceCount.toLocaleString()}</span></li>
                    <div className="my-2 border-t border-white/10" />
                    <li className="flex items-center justify-between"><span className="text-emerald-200 font-medium">{t.craftsNeeded}</span><span className="font-bold text-3xl text-emerald-400 font-mono drop-shadow-sm">{result.craftCount.toLocaleString()}</span></li>
                    <li className="flex items-center justify-between"><span className="text-emerald-200/60 text-sm">{t.xpDiff}</span><span className="font-medium text-emerald-200/60 font-mono">{result.expDiff.toLocaleString()} XP</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBLIMATIONS TAB */}
        {activeTab === 'sublimations' && (
           <Sublimations />
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