import { useState, useEffect, useMemo } from 'react';
import { Scroll, Search, AlertCircle, X, Filter } from 'lucide-react';
import { FALLBACK_SUBLIMATIONS, type Sublimation } from '../data/fallbackSublimations';
import { processDescription, initializeRuneLevels } from '../utils/sublimationUtils';
import { LocalImage } from './LocalImage';
import { SlotSelector } from './SlotSelector';
import { type Language } from '../constants/translations';
import './Sublimations.css';

interface SublimationsProps {
  language: Language;
  translations: Record<string, string>;
}

export function Sublimations({ language, translations: t }: SublimationsProps) {
  const [runes, setRunes] = useState<Sublimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [runeLevels, setRuneLevels] = useState<Record<string, number>>({});
  const [dataSource, setDataSource] = useState<'loading' | 'json' | 'fallback' | 'error'>('loading');
  type Slot = 'Any' | 'R' | 'G' | 'B' | 'J';

const [slotFilters, setSlotFilters] = useState<[Slot, Slot, Slot, Slot]>([
  'Any', 'Any', 'Any', 'Any'
]);

  useEffect(() => {
    async function fetchData() {
      try {
        const sublimationsPath = `/data/sublimations.${language}.json`;
        const response = await fetch(sublimationsPath);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRunes(data);
            setRuneLevels(initializeRuneLevels(data));
            setDataSource('json');
            setLoading(false);
            return;
          }
        }
        throw new Error("JSON file not found or empty");
      } catch (err) {
        console.warn(`Could not load sublimations.${language}.json, trying fallback...`, err);
        try {
          const fallbackResponse = await fetch('sublimations.json');
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            if (Array.isArray(data) && data.length > 0) {
              setRunes(data);
              setRuneLevels(initializeRuneLevels(data));
              setDataSource('json');
              setLoading(false);
              return;
            }
          }
        } catch {
          console.warn("Could not load any sublimations file, using fallback data");
        }
        setRunes(FALLBACK_SUBLIMATIONS);
        setRuneLevels(initializeRuneLevels(FALLBACK_SUBLIMATIONS));
        setDataSource('fallback');
        setLoading(false);
      }
    }
    fetchData();
  }, [language]);

  const categories = useMemo(() => {
    if (!runes.length) return [];
    const cats = new Set(runes.map(r => r.category).filter(Boolean));
    return [t.allCategories, ...Array.from(cats).sort()];
  }, [runes, t.allCategories]);

  const handleLevelChange = (runeName: string, newLevel: number) => {
  setRuneLevels(prev => ({
    ...prev,
    [runeName]: newLevel
  }));
};

  type RuneSlot = 'R' | 'G' | 'B' | 'J';

const isRuneSlot = (c: string): c is RuneSlot =>
  c === 'R' || c === 'G' || c === 'B' || c === 'J';

// se rune.colors contiene anche "Epic"/"Relic", li scartiamo
const getRuneSlots = (rune: Sublimation): RuneSlot[] =>
  (rune.colors ?? []).filter(isRuneSlot).slice(0, 3);

const slotMatches = (equip: Slot, rune: RuneSlot) => {
  if (equip === 'Any') return false;   // "Any" = slot vuoto
  if (equip === 'J') return true;      // jolly equip = R/G/B (e anche J)
  if (rune === 'J') return true;       // jolly rune = R/G/B (e anche J)
  return equip === rune;               // match esatto
};

const COMBOS: [number, number, number][] = [
  [0, 1, 2],
  [1, 2, 3],
];

const matchesEquipmentSlots = (equipSlots: [Slot, Slot, Slot, Slot], rune: Sublimation) => {
  // se l'utente non filtra per slot, non blocchiamo nulla
  if (equipSlots.every(s => s === 'Any')) return true;

  const rs = getRuneSlots(rune);
  if (rs.length !== 3) return false;

  return COMBOS.some(([a, b, c]) =>
    slotMatches(equipSlots[a], rs[0]) &&
    slotMatches(equipSlots[b], rs[1]) &&
    slotMatches(equipSlots[c], rs[2])
  );
};

const filteredRunes = useMemo(() => {
    return runes.filter(rune => {
      if (!rune.name) return false;
      const nameMatch = rune.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = rune.description && rune.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === t.allCategories || rune.category === selectedCategory;

      const matchesSlots = matchesEquipmentSlots(slotFilters, rune);

      return matchesSearch && matchesCategory && matchesSlots;
    });
  }, [runes, searchTerm, selectedCategory, slotFilters, t.allCategories]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="animate-spin mb-4">
          <Scroll size={32} />
        </div>
        <p>{t.loadingSublimations}</p>
      </div>
    );
  }

  return (
    <div className="sublimation-container animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
          {t.sublimationsLibrary}
        </h1>
        <div className="flex justify-center items-center gap-3">
          <span className="text-sm text-emerald-200/70">
            {filteredRunes.length} {t.items}
          </span>
          {dataSource === 'fallback' && (
            <div className="text-amber-400 text-xs flex items-center gap-1 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30">
              <AlertCircle size={12} /> {t.usingBackupData}
            </div>
          )}
        </div>
      </div>

      <div className="controls">

        <div className="search-box">
          <input
            type="text"
            placeholder={t.searchByNameOrDesc}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-btn">
            <Search size={18} />
          </button>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-12 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

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

      <div className="slot-filter">
        <div className="slot-filter-title">{t.filterBySlots}</div>
        <div className="slot-filter-controls">
         {[0, 1, 2, 3].map(idx => (
  <SlotSelector
    key={idx}
    label={`${t.slot} ${idx + 1}`}
    value={slotFilters[idx]}
    onChange={(newValue) => {
      const newFilters = [...slotFilters] as [Slot, Slot, Slot, Slot];
      newFilters[idx] = newValue as Slot;
      setSlotFilters(newFilters);
    }}
  />
))}
{slotFilters.some(s => s !== 'Any') && (
  <button
    onClick={() => setSlotFilters(['Any', 'Any', 'Any', 'Any'])}
    className="slot-filter-reset"
  >
    {t.clearSlotFilters}
  </button>
)}
        </div>
      </div>

      <div className="runes-grid">
        {filteredRunes.map(rune => {
          const isSpecial = rune.colors.includes('Epic') || rune.colors.includes('Relic');
          const currentLevel = runeLevels[rune.name] || rune.minLevel || 1;
          const nameClass = rune.colors.includes('Relic') ? 'relic-name' : (rune.colors.includes('Epic') ? 'epic-name' : '');

          return (
            <div key={rune.name} className="rune-card">
              <div className="card-content">
                <div className="rune-header">
                  <div className="flex-1">
                    <div className={`rune-name ${nameClass}`}>{rune.name}</div>
                    {!isSpecial && <span className="rune-level-badge">{t.lvl} {currentLevel}</span>}
                  </div>
                  <div className="rune-colors">
                    {rune.colors.map((color, idx) => {
                      if (['R', 'G', 'B'].includes(color)) {
                        const iconMap = { R: 'red_slot.png', G: 'green_slot.png', B: 'blue_slot.png' };
                        return (
                          <div key={idx} className="color-slot" title={`${color} Slot`}>
                            <LocalImage src={`/data/icons/${iconMap[color as 'R' | 'G' | 'B']}`} alt={color} fallbackText={color} />
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className={`special-badge ${color.toLowerCase()}`}>
                          {color}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rune-meta">
                  <div className="obtenation">
                    {rune.obtenation && rune.obtenation.name && (
                      <>
                        <LocalImage
                          src={rune.obtenation.localIcon}
                          alt=""
                          className="w-7 h-7 rounded bg-slate-700"
                        />
                        <span className="truncate max-w-[140px]" title={rune.obtenation.name}>
                          {rune.obtenation.name}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {rune.rarity && rune.rarity.map((r, idx) => {
                      const iconMap = { Rare: 'rare_icon.png', Mythic: 'mythic_icon.png', Legendary: 'legendary_icon.png' };
                      if (['Rare', 'Mythic', 'Legendary'].includes(r)) {
                        return (
                          <LocalImage
                            key={idx}
                            src={`/data/icons/${iconMap[r as keyof typeof iconMap]}`}
                            alt={r}
                            className="w-6 h-6 object-contain drop-shadow-md"
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="rune-description">
                  {processDescription(rune, currentLevel)}
                </div>

                {!isSpecial && (
                  <div className="level-controls">
                    <input
                      type="range"
                      className="level-slider"
                      min={rune.minLevel || 1}
                      max={rune.maxLevel || 6}
                      step={rune.step || 1}
                      value={currentLevel}
                      onChange={(e) => handleLevelChange(rune.name, parseInt(e.target.value))}
                    />
                    <div className="level-display">{currentLevel}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filteredRunes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
          <Filter size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">{t.noSublimationsFound}</p>
          <p className="text-sm">{t.tryAdjustingFilters}</p>
          <button
           onClick={() => {
  setSearchTerm('');
  setSelectedCategory(t.allCategories);
  setSlotFilters(['Any', 'Any', 'Any', 'Any']);
}}
            className="mt-4 text-emerald-400 hover:underline text-sm"
          >
            {t.clearAllFilters}
          </button>
        </div>
      )}
    </div>
  );
}
